import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import * as toolkit from '../scripts/lib/toolchain.mjs';
import {
  validateProfile, buildPlan, resolvePrivatePath, inspectRuntime,
  resolveInside, loadCatalog, writeReport,
  validateRuntimeLock,
} from '../scripts/lib/toolchain.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testBase = path.join(projectRoot, '.local', 'tests');
fs.mkdirSync(testBase, { recursive: true });
const sri = 'sha512-dAee29yRGin7ub6VHwmifLEfHrysGD41yq4RkY0gg7QQh0wyQKWfhiORGb/r6uNpKWc9A1GY8yowV07Lh+4rCg==';

function temporary(t) {
  const dir = fs.mkdtempSync(path.join(testBase, 'policy-'));
  t.after(() => {
    const resolved = path.resolve(dir);
    assert.ok(resolved.startsWith(path.resolve(testBase) + path.sep));
    fs.rmSync(resolved, { recursive: true, force: true });
  });
  return dir;
}

function inputs() {
  const source = {
    source_id: 'skills-cli-1.7.6', kind: 'npm', package: 'skills', version: '1.7.6',
    integrity: sri, runtime_dir: 'runtime/skills-cli', bin: 'bin/cli.mjs',
    owner: 'npm:skills', restore_mode: 'npm-lock', status: 'locked',
  };
  const sources = { schema_version: 1, sources: [source] };
  const catalog = { schema_version: 1, capabilities: [{
    capability_id: 'skill-management', title: 'Skills',
    implementations: [{ implementation_id: 'skills-cli', source_id: source.source_id,
      targets: ['codex', 'dsh'], recipe: 'recipes/skills.md', limitations: [] }],
  }] };
  const profile = { schema_version: 1, profile_id: 'sample', capabilities: [{
    capability_id: 'skill-management', implementation_id: 'skills-cli', source_id: source.source_id,
    required_targets: ['codex', 'dsh'], required: true, verification_id: 'skills-smoke',
  }] };
  return { source, sources, catalog, profile };
}

test('an unknown source fails before planning any installation', () => {
  const a = inputs(); a.profile.capabilities[0].source_id = 'not-reviewed';
  assert.throws(() => validateProfile(a.profile, a.catalog, a.sources), /source/i);
});

test('requested DSH coverage is not silently reduced to Codex', () => {
  const a = inputs(); a.catalog.capabilities[0].implementations[0].targets = ['codex'];
  assert.throws(() => validateProfile(a.profile, a.catalog, a.sources), /target.*dsh|dsh.*target/i);
});

test('duplicate capability selections fail instead of overwriting one another', () => {
  const a = inputs(); a.profile.capabilities.push({ ...a.profile.capabilities[0] });
  assert.throws(() => validateProfile(a.profile, a.catalog, a.sources), /duplicate/i);
});

test('floating npm versions cannot become an install action', () => {
  const a = inputs(); a.source.version = 'latest';
  assert.throws(() => validateProfile(a.profile, a.catalog, a.sources), /version/i);
});

test('npm metadata without a complete sha512 integrity is rejected', () => {
  const a = inputs(); a.source.integrity = 'sha512-AA==';
  assert.throws(() => validateProfile(a.profile, a.catalog, a.sources), /integrity/i);
});

test('runtime location cannot leave the repository runtime directory', () => {
  const a = inputs(); a.source.runtime_dir = '../elsewhere';
  assert.throws(() => validateProfile(a.profile, a.catalog, a.sources), /runtime|path/i);
});

test('planning preserves targets and writes no files', t => {
  const root = temporary(t); const a = inputs();
  const before = fs.readdirSync(root);
  const plan = buildPlan({ root, ...a });
  assert.equal(plan.items.length, 1);
  assert.equal(plan.items[0].status, 'ready');
  assert.deepEqual(plan.items[0].required_targets, ['codex', 'dsh']);
  assert.equal(plan.items[0].agent_task_passed, false);
  assert.deepEqual(fs.readdirSync(root), before);
});

test('pending source remains blocked even when it names a version', t => {
  const root = temporary(t); const a = inputs(); a.source.status = 'candidate';
  const plan = buildPlan({ root, ...a });
  assert.equal(plan.items[0].status, 'blocked');
});

test('native host plugins produce a manual step, never a shell command', t => {
  const root = temporary(t); const a = inputs();
  Object.assign(a.source, { kind: 'host-managed', status: 'managed', command: 'unexpected text' });
  const plan = buildPlan({ root, ...a });
  assert.equal(plan.items[0].status, 'manual');
  assert.equal(plan.items[0].agent_task_passed, false);
  assert.equal(plan.items[0].command, undefined);
});

test('missing private roots are reported as blocked, not empty success', t => {
  const root = temporary(t); const a = inputs();
  Object.assign(a.source, { kind: 'private-local', status: 'pending-capture', root_key: 'personal_skills', relative_path: 'grilling' });
  const plan = buildPlan({ root, ...a, privateRoots: {} });
  assert.equal(plan.items[0].status, 'blocked');
  assert.match(plan.items[0].reason, /private|root/i);
});

test('private file references cannot traverse to a sibling', t => {
  const root = temporary(t); fs.mkdirSync(path.join(root, 'private'));
  fs.writeFileSync(path.join(root, 'outside.txt'), 'outside');
  assert.throws(() => resolvePrivatePath(path.join(root, 'private'), '../outside.txt'), /outside|escape|relative/i);
});

test('private references reject Windows absolute paths even on other platforms', t => {
  const root = temporary(t);
  assert.throws(() => resolvePrivatePath(root, 'C:\\outside\\secret'), /absolute|relative/i);
});

test('private symlinks cannot bypass the permitted root', t => {
  const root = temporary(t); const owned = path.join(root, 'owned'); const outside = path.join(root, 'outside');
  fs.mkdirSync(owned); fs.mkdirSync(outside); fs.writeFileSync(path.join(outside, 'data.txt'), 'not owned');
  try { fs.symlinkSync(outside, path.join(owned, 'linked'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (err) { if (['EPERM', 'EACCES'].includes(err.code)) return t.skip('link creation unavailable'); throw err; }
  assert.throws(() => resolvePrivatePath(owned, 'linked/data.txt'), /outside|escape/i);
});

test('uncreated paths are checked using their nearest existing ancestor', t => {
  const root = temporary(t); const owned = path.join(root, 'owned'); const outside = path.join(root, 'outside');
  fs.mkdirSync(owned); fs.mkdirSync(outside);
  try { fs.symlinkSync(outside, path.join(owned, 'linked'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (err) { if (['EPERM', 'EACCES'].includes(err.code)) return t.skip('link creation unavailable'); throw err; }
  assert.throws(() => resolveInside(owned, 'linked/not-created/file.json'), /outside|escape/i);
});

function installed(root, source, integrity = source.integrity) {
  const runtime = path.join(root, source.runtime_dir);
  const pkg = path.join(runtime, 'node_modules', source.package);
  fs.mkdirSync(path.join(pkg, 'bin'), { recursive: true });
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({ name: source.package, version: source.version }));
  fs.writeFileSync(path.join(pkg, source.bin), 'console.log("fixture");');
  fs.writeFileSync(path.join(runtime, 'package.json'), JSON.stringify({ private: true, dependencies: { [source.package]: source.version } }));
  fs.writeFileSync(path.join(runtime, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: {
    '': { dependencies: { [source.package]: source.version } },
    [`node_modules/${source.package}`]: { version: source.version, integrity },
  } }));
  return { runtime, pkg };
}

test('verified local version is skipped without claiming an agent task passed', t => {
  const root = temporary(t); const a = inputs(); installed(root, a.source);
  const result = inspectRuntime(root, a.source);
  assert.equal(result.status, 'installed');
  const plan = buildPlan({ root, ...a });
  assert.equal(plan.items[0].status, 'satisfied');
  assert.equal(plan.items[0].agent_task_passed, false);
});

test('an integrity mismatch is a conflict, not a reinstall opportunity', t => {
  const root = temporary(t); const a = inputs();
  installed(root, a.source, 'sha512-' + 'A'.repeat(86) + '==');
  assert.equal(inspectRuntime(root, a.source).status, 'conflict');
  assert.equal(buildPlan({ root, ...a }).items[0].status, 'conflict');
});

test('a declared package without its executable is not treated as installed', t => {
  const root = temporary(t); const a = inputs(); const { pkg } = installed(root, a.source);
  fs.unlinkSync(path.join(pkg, a.source.bin));
  assert.equal(inspectRuntime(root, a.source).status, 'conflict');
});

test('a changed version is a conflict even if the original lock is present', t => {
  const root = temporary(t); const a = inputs(); const { pkg } = installed(root, a.source);
  fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({ name: 'skills', version: '9.9.9' }));
  assert.equal(inspectRuntime(root, a.source).status, 'conflict');
});

test('reports cannot be written into public source files', t => {
  const root = temporary(t); fs.writeFileSync(path.join(root, 'README.md'), 'keep');
  assert.throws(() => writeReport(root, 'README.md', { status: 'x' }), /local|report/i);
  assert.equal(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), 'keep');
});

test('explicit private report output writes valid JSON inside .local', t => {
  const root = temporary(t);
  const location = writeReport(root, '.local/reports/test.json', { status: 'partial' });
  assert.equal(JSON.parse(fs.readFileSync(location, 'utf8')).status, 'partial');
});

test('catalog validation detects broken implementation-source references', t => {
  const root = temporary(t); const a = inputs(); fs.mkdirSync(path.join(root, 'catalog'));
  a.catalog.capabilities[0].implementations[0].source_id = 'missing';
  fs.writeFileSync(path.join(root, 'catalog', 'capabilities.json'), JSON.stringify(a.catalog));
  fs.writeFileSync(path.join(root, 'catalog', 'sources.lock.json'), JSON.stringify(a.sources));
  assert.throws(() => loadCatalog(root), /source/i);
});

function cliFixture(root, a) {
  fs.mkdirSync(path.join(root, 'catalog'));
  fs.writeFileSync(path.join(root, 'catalog/capabilities.json'), JSON.stringify(a.catalog));
  fs.writeFileSync(path.join(root, 'catalog/sources.lock.json'), JSON.stringify(a.sources));
  fs.writeFileSync(path.join(root, 'profile.json'), JSON.stringify(a.profile));
}
function runCli(root, command, extra = []) {
  return spawnSync(process.execPath, [path.join(projectRoot, 'scripts/lib/toolchain.mjs'), command,
    '--root', root, '--profile', 'profile.json', ...extra], { encoding: 'utf8', windowsHide: true });
}

test('CLI refuses a selected implementation outside the profile', t => {
  const root = temporary(t); cliFixture(root, inputs());
  const result = runCli(root, 'plan', ['--only', 'not-approved']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /not in profile/);
  assert.equal(fs.existsSync(path.join(root, 'runtime')), false);
});

test('CLI profile verification is partial even when a real executable version probe passes', t => {
  const root = temporary(t); const a = inputs(); cliFixture(root, a);
  const { pkg } = installed(root, a.source);
  fs.writeFileSync(path.join(pkg, a.source.bin), 'console.log("1.7.6");');
  const result = runCli(root, 'verify');
  assert.equal(result.status, 2, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, 'partial');
  assert.equal(report.results[0].cli_passed, true);
  assert.equal(report.agent_tasks_verified, false);
});

test('tools-only verification succeeds without claiming agent compatibility', t => {
  const root = temporary(t); const a = inputs(); cliFixture(root, a);
  const { pkg } = installed(root, a.source);
  fs.writeFileSync(path.join(pkg, a.source.bin), 'console.log("1.7.6");');
  const result = runCli(root, 'verify', ['--tools-only']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 'tools-verified');
  assert.equal(JSON.parse(result.stdout).agent_tasks_verified, false);
});

test('an executable reporting another version fails verification', t => {
  const root = temporary(t); const a = inputs(); cliFixture(root, a);
  const { pkg } = installed(root, a.source);
  fs.writeFileSync(path.join(pkg, a.source.bin), 'console.log("9.9.9");');
  const result = runCli(root, 'verify', ['--tools-only']);
  assert.equal(result.status, 1);
  assert.equal(JSON.parse(result.stdout).results[0].cli_passed, false);
});

test('report-writer command accepts UTF-8 stdin without executing imported CLI arguments', t => {
  const root = temporary(t); cliFixture(root, inputs());
  const input = { status: 'partial', label: '中文目录与报告' };
  const result = spawnSync(process.execPath, [path.join(projectRoot, 'scripts/lib/toolchain.mjs'),
    'write-report', '--root', root, '--output', '.local/reports/unicode.json'], {
    encoding: 'utf8', input: JSON.stringify(input), windowsHide: true,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, '.local/reports/unicode.json'), 'utf8')), input);
});

test('npm shrinkwrap cannot override the reviewed package lock', t => {
  const root = temporary(t); const a = inputs(); const { runtime } = installed(root, a.source);
  fs.writeFileSync(path.join(runtime, 'npm-shrinkwrap.json'), JSON.stringify({ lockfileVersion: 3, packages: {} }));
  assert.throws(() => validateRuntimeLock(root, a.source), /shrinkwrap/i);
});

test('a dedicated runtime rejects additional dependency and workspace entrypoints', t => {
  const root = temporary(t); const a = inputs(); const { runtime } = installed(root, a.source);
  const clean = { name: 'test', private: true, dependencies: { skills: '1.7.6' } };
  for (const extra of [
    { devDependencies: { 'extra-package': '1.0.0' } },
    { optionalDependencies: { 'extra-package': '1.0.0' } },
    { peerDependencies: { 'extra-package': '1.0.0' } },
    { workspaces: ['../../external'] },
    { overrides: { skills: '2.0.0' } },
  ]) {
    fs.writeFileSync(path.join(runtime, 'package.json'), JSON.stringify({ ...clean, ...extra }));
    assert.throws(() => validateRuntimeLock(root, a.source), /manifest|dependency|workspace|field/i);
  }
});

test('extra dependency declarations in lock root are rejected', t => {
  const root = temporary(t); const a = inputs(); const { runtime } = installed(root, a.source);
  const lockPath = path.join(runtime, 'package-lock.json');
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  lock.packages[''].devDependencies = { extra: '1.0.0' };
  fs.writeFileSync(lockPath, JSON.stringify(lock));
  assert.throws(() => validateRuntimeLock(root, a.source), /lock|dependency|field/i);
});

test('report output junction cannot redirect private data into a public repository directory', t => {
  const root = temporary(t); const publicDir = path.join(root, 'public');
  fs.mkdirSync(publicDir); fs.mkdirSync(path.join(root, '.local'));
  try { fs.symlinkSync(publicDir, path.join(root, '.local', 'reports'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (err) { if (['EPERM', 'EACCES'].includes(err.code)) return t.skip('link creation unavailable'); throw err; }
  assert.throws(() => writeReport(root, '.local/reports/new/report.json', { private: true }), /local|outside|escape/i);
  assert.deepEqual(fs.readdirSync(publicDir), []);
});

test('the .local directory itself cannot be redirected to a public directory', t => {
  const root = temporary(t); const publicDir = path.join(root, 'public'); fs.mkdirSync(publicDir);
  try { fs.symlinkSync(publicDir, path.join(root, '.local'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (err) { if (['EPERM', 'EACCES'].includes(err.code)) return t.skip('link creation unavailable'); throw err; }
  assert.throws(() => writeReport(root, '.local/report.json', { private: true }), /local|redirect|link/i);
  assert.deepEqual(fs.readdirSync(publicDir), []);
});

test('candidate source cannot authorize an executable even if its package is installed', () => {
  const a = inputs(); a.source.status = 'candidate';
  assert.throws(() => toolkit.assertExecutableSource(a.source), /locked|reviewed/i);
  a.source.status = 'locked'; a.source.kind = 'host-managed';
  assert.throws(() => toolkit.assertExecutableSource(a.source), /npm|source/i);
});

test('runtime control files cannot escape through a symlink', t => {
  const root = temporary(t); const a = inputs(); const { runtime } = installed(root, a.source);
  const outside = temporary(t); const other = path.join(outside, 'manifest.json');
  fs.copyFileSync(path.join(runtime, 'package.json'), other);
  fs.unlinkSync(path.join(runtime, 'package.json'));
  try { fs.symlinkSync(other, path.join(runtime, 'package.json'), 'file'); }
  catch (err) { if (['EPERM', 'EACCES'].includes(err.code)) return t.skip('file symlink creation unavailable'); throw err; }
  assert.throws(() => validateRuntimeLock(root, a.source), /outside|escape/i);
});
