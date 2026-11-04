import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const kinds = new Set(['npm', 'git-skill', 'private-local', 'host-managed', 'upstream-guided', 'msi']);
const idPattern = /^[a-z0-9][a-z0-9._-]*$/;
const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

function fail(message) { throw new Error(message); }
function object(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${name} must be an object`);
}
function list(value, name) { if (!Array.isArray(value)) fail(`${name} must be an array`); return value; }
function identifier(value, name) { if (typeof value !== 'string' || !idPattern.test(value)) fail(`Invalid ${name}`); }
function schema(value, name) { object(value, name); if (value.schema_version !== 1) fail(`Unsupported ${name} schema_version`); }
function unique(items, key, name) {
  const result = new Map();
  for (const item of list(items, name)) {
    object(item, name); identifier(item[key], key);
    if (result.has(item[key])) fail(`Duplicate ${key}: ${item[key]}`);
    result.set(item[key], item);
  }
  return result;
}
function readJson(filename) { return JSON.parse(fs.readFileSync(filename, 'utf8').replace(/^\uFEFF/, '')); }
function within(base, target) {
  const relative = path.relative(base, target);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

export function resolveInside(root, relativePath) {
  if (typeof relativePath !== 'string' || !relativePath || path.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath)) {
    fail('Expected a relative path, not an absolute path');
  }
  const base = path.resolve(root);
  const candidate = path.resolve(base, relativePath);
  if (!within(base, candidate)) fail('Path escapes outside its allowed root');
  const actualBase = fs.realpathSync(base);
  let ancestor = candidate;
  const tail = [];
  while (true) {
    try { fs.lstatSync(ancestor); break; }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = path.dirname(ancestor);
      if (parent === ancestor) fail('No existing ancestor for path');
      tail.unshift(path.basename(ancestor)); ancestor = parent;
    }
  }
  const actualTarget = path.resolve(fs.realpathSync(ancestor), ...tail);
  if (!within(actualBase, actualTarget)) fail('Resolved path escapes outside its allowed root');
  return candidate;
}

export function resolvePrivatePath(root, relativePath) {
  if (typeof root !== 'string' || !fs.existsSync(root)) fail('Private root is missing');
  const resolved = resolveInside(root, relativePath);
  if (!fs.existsSync(resolved)) fail('Private source is missing');
  return resolved;
}

function validateNpmSource(source) {
  if (typeof source.package !== 'string' || !/^(?:@[a-z0-9._-]+\/)?[a-z0-9][a-z0-9._-]*$/.test(source.package)) fail('Invalid npm package');
  if (!exactVersion.test(source.version ?? '')) fail('npm source requires an exact version');
  const digest = source.integrity?.match(/^sha512-([A-Za-z0-9+/]+={0,2})$/)?.[1];
  if (!digest || Buffer.from(digest, 'base64').length !== 64 || Buffer.from(digest, 'base64').toString('base64') !== digest) {
    fail('npm source requires complete sha512 integrity');
  }
  if (!/^runtime\/[a-z0-9-]+$/.test(source.runtime_dir ?? '')) fail('Invalid runtime path');
  if (typeof source.bin !== 'string' || !source.bin || source.bin.includes('..') || path.win32.isAbsolute(source.bin) || path.isAbsolute(source.bin)) {
    fail('Invalid npm executable path');
  }
}

export function assertExecutableSource(source) {
  if (!source || source.kind !== 'npm') fail('Executable source must be an npm source');
  if (source.status !== 'locked') fail('Executable source must be reviewed and locked');
  validateNpmSource(source);
}

function indexes(catalog, sources) {
  schema(catalog, 'catalog'); schema(sources, 'sources');
  const sourceMap = unique(sources.sources, 'source_id', 'sources');
  const capabilityMap = unique(catalog.capabilities, 'capability_id', 'capabilities');
  const occupied = new Map();
  for (const source of sourceMap.values()) {
    if (!kinds.has(source.kind)) fail(`Unsupported source kind: ${source.kind}`);
    if (source.kind === 'npm') {
      validateNpmSource(source);
      if (occupied.has(source.runtime_dir)) fail(`Duplicate runtime owner for ${source.runtime_dir}`);
      occupied.set(source.runtime_dir, source.source_id);
    }
  }
  for (const capability of capabilityMap.values()) {
    const implementations = unique(capability.implementations, 'implementation_id', 'implementations');
    for (const implementation of implementations.values()) {
      if (!sourceMap.has(implementation.source_id)) fail(`Unknown implementation source: ${implementation.source_id}`);
      list(implementation.targets, 'targets');
    }
  }
  return { sourceMap, capabilityMap };
}

export function loadCatalog(root) {
  const catalog = readJson(resolveInside(root, 'catalog/capabilities.json'));
  const sources = readJson(resolveInside(root, 'catalog/sources.lock.json'));
  indexes(catalog, sources);
  return { catalog, sources };
}

export function validateProfile(profile, catalog, sources) {
  schema(profile, 'profile'); identifier(profile.profile_id, 'profile_id');
  const { sourceMap, capabilityMap } = indexes(catalog, sources);
  unique(profile.capabilities, 'capability_id', 'profile capabilities');
  for (const choice of profile.capabilities) {
    const capability = capabilityMap.get(choice.capability_id);
    if (!capability) fail(`Unknown capability: ${choice.capability_id}`);
    const implementation = capability.implementations.find(item => item.implementation_id === choice.implementation_id);
    if (!implementation) fail(`Unknown implementation: ${choice.implementation_id}`);
    if (!sourceMap.has(choice.source_id) || implementation.source_id !== choice.source_id) fail(`Invalid source reference: ${choice.source_id}`);
    if (typeof choice.required !== 'boolean') fail('required must be boolean');
    identifier(choice.verification_id, 'verification_id');
    const targets = list(choice.required_targets, 'required_targets');
    if (!targets.length || new Set(targets).size !== targets.length) fail('required_targets must be nonempty and unique');
    for (const target of targets) {
      identifier(target, 'target');
      if (!implementation.targets.includes(target)) fail(`Unsupported target ${target} for ${choice.implementation_id}`);
    }
  }
  return true;
}

function runtimePaths(root, source) {
  validateNpmSource(source);
  const runtime = resolveInside(root, source.runtime_dir);
  const packageDir = resolveInside(root, `${source.runtime_dir}/node_modules/${source.package}`);
  const bin = resolveInside(root, `${source.runtime_dir}/node_modules/${source.package}/${source.bin}`);
  return { runtime, packageDir, bin };
}

export function validateRuntimeLock(root, source) {
  const { runtime } = runtimePaths(root, source);
  const shrinkwrap = resolveInside(root, `${source.runtime_dir}/npm-shrinkwrap.json`);
  try { fs.lstatSync(shrinkwrap); fail('Unreviewed npm-shrinkwrap.json would override the package lock'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const manifest = readJson(resolveInside(root, `${source.runtime_dir}/package.json`));
  const lock = readJson(resolveInside(root, `${source.runtime_dir}/package-lock.json`));
  const manifestFields = new Set(['name', 'version', 'private', 'dependencies']);
  if (Object.keys(manifest).some(key => !manifestFields.has(key))) fail('Unsupported runtime manifest field or dependency entrypoint');
  if (manifest.private !== true || Object.keys(manifest.dependencies ?? {}).length !== 1 || manifest.dependencies?.[source.package] !== source.version) {
    fail(`Runtime manifest mismatch: ${source.source_id}`);
  }
  const lockRoot = lock.packages?.[''];
  const lockRootFields = new Set(['name', 'version', 'dependencies']);
  if (!lockRoot || Object.keys(lockRoot).some(key => !lockRootFields.has(key)) || Object.keys(lockRoot.dependencies ?? {}).length !== 1) {
    fail('Unsupported lock root field or dependency entrypoint');
  }
  const entry = lock.packages?.[`node_modules/${source.package}`];
  if (lock.lockfileVersion !== 3 || lock.packages?.['']?.dependencies?.[source.package] !== source.version || entry?.version !== source.version || entry?.integrity !== source.integrity) {
    fail(`Runtime lock integrity/version mismatch: ${source.source_id}`);
  }
  return { runtime, package: source.package, version: source.version, integrity: source.integrity };
}

export function inspectRuntime(root, source) {
  const paths = runtimePaths(root, source);
  const manifestPath = path.join(paths.runtime, 'package.json');
  const lockPath = path.join(paths.runtime, 'package-lock.json');
  const installedPath = path.join(paths.packageDir, 'package.json');
  if (!fs.existsSync(installedPath)) {
    if (fs.existsSync(manifestPath) && fs.existsSync(lockPath)) {
      try { validateRuntimeLock(root, source); }
      catch (error) { return { status: 'conflict', reason: error.message }; }
    }
    if (fs.existsSync(paths.packageDir)) return { status: 'conflict', reason: 'Package directory exists without a valid manifest' };
    return { status: 'missing', runtime: paths.runtime };
  }
  try {
    validateRuntimeLock(root, source);
    const installed = readJson(installedPath);
    if (installed.name !== source.package || installed.version !== source.version) fail('Installed package version/name mismatch');
    if (!fs.statSync(paths.bin).isFile()) fail('Installed executable is not a regular file');
    return { status: 'installed', ...paths, version: installed.version, integrity: source.integrity };
  } catch (error) { return { status: 'conflict', reason: error.message }; }
}

export function buildPlan({ root, profile, catalog, sources, privateRoots = {} }) {
  validateProfile(profile, catalog, sources);
  const sourceMap = new Map(sources.sources.map(source => [source.source_id, source]));
  const items = profile.capabilities.map(choice => {
    const source = sourceMap.get(choice.source_id);
    const implementation = catalog.capabilities.find(c => c.capability_id === choice.capability_id)
      .implementations.find(i => i.implementation_id === choice.implementation_id);
    const item = { ...choice, required_targets: [...choice.required_targets], owner: source.owner,
      kind: source.kind, recipe: implementation.recipe, agent_task_passed: false,
      status: 'manual', reason: 'Use the documented native workflow; no command is evaluated from catalog data.' };
    if (source.kind === 'npm') {
      if (source.status !== 'locked') return { ...item, status: 'blocked', reason: 'Source is not locked/reviewed' };
      const installed = inspectRuntime(root, source);
      return { ...item, package: source.package, version: source.version, runtime_dir: source.runtime_dir,
        status: installed.status === 'installed' ? 'satisfied' : installed.status === 'conflict' ? 'conflict' : 'ready',
        reason: installed.reason ?? (installed.status === 'installed' ? 'Installed version and lock metadata match; agent tasks are not checked.' : 'Ready for explicit local npm installation.') };
    }
    if (source.kind === 'private-local') {
      try {
        const privatePath = resolvePrivatePath(privateRoots[source.root_key], source.relative_path);
        return { ...item, status: 'manual', private_source_available: true,
          reason: `Private source is available; checksum capture and native deployment remain manual (${path.basename(privatePath)}).` };
      } catch (error) { return { ...item, status: 'blocked', reason: error.message }; }
    }
    if (source.kind === 'git-skill') return { ...item, status: 'manual', reason: 'Pinned skill deployment requires a reviewed scope and ownership inventory; no global files are changed by this planner.' };
    return item;
  });
  return { schema_version: 1, profile_id: profile.profile_id, generated_at: new Date().toISOString(),
    mode: 'plan', task_scope: 'installation-only', agent_tasks_verified: false,
    summary: Object.fromEntries(['ready', 'satisfied', 'manual', 'blocked', 'conflict'].map(status => [status, items.filter(i => i.status === status).length])), items };
}

export function writeReport(root, output, data) {
  const relative = path.isAbsolute(output) || path.win32.isAbsolute(output) ? path.relative(root, output) : output;
  const target = resolveInside(root, relative);
  const localRoot = path.resolve(root, '.local');
  if (!within(localRoot, target) || target === localRoot) fail('Reports must be written below .local');
  try { if (fs.lstatSync(localRoot).isSymbolicLink()) fail('.local must not be redirected by a link'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  fs.mkdirSync(localRoot, { recursive: true });
  const privateTarget = resolveInside(localRoot, path.relative(localRoot, target));
  fs.mkdirSync(path.dirname(privateTarget), { recursive: true });
  fs.writeFileSync(privateTarget, JSON.stringify(data, null, 2) + '\n', 'utf8');
  return privateTarget;
}

function parseArgs(args) {
  const command = args.shift() ?? 'help'; const options = {};
  for (let i = 0; i < args.length; i++) {
    const name = args[i];
    if (name === '--tools-only') { options.toolsOnly = true; continue; }
    if (!['--root', '--profile', '--output', '--only', '--private-roots', '--source'].includes(name) || !args[i + 1]) fail(`Unknown/incomplete argument ${name}`);
    options[name.slice(2)] = args[++i];
  }
  return { command, options };
}

function emit(root, output, value) {
  if (output) writeReport(root, output, value);
  process.stdout.write(JSON.stringify(value, null, 2) + '\n');
}

function cli(args) {
  const { command, options } = parseArgs([...args]);
  const root = path.resolve(options.root ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '../..'));
  if (command === 'help') { console.log('Commands: validate, plan, check-runtime, verify. --root --profile --output --only --tools-only'); return; }
  if (command === 'write-report') {
    if (!options.output) fail('write-report requires --output');
    writeReport(root, options.output, JSON.parse(fs.readFileSync(0, 'utf8').replace(/^\uFEFF/, '')));
    return;
  }
  const { catalog, sources } = loadCatalog(root);
  if (command === 'validate') {
    emit(root, options.output, { schema_version: 1, status: 'valid', capabilities: catalog.capabilities.length, sources: sources.sources.length }); return;
  }
  if (command === 'check-runtime') {
    const source = sources.sources.find(s => s.source_id === options.source);
    assertExecutableSource(source);
    emit(root, options.output, validateRuntimeLock(root, source)); return;
  }
  if (!['plan', 'verify'].includes(command) || !options.profile) fail('plan/verify requires --profile');
  let profile = readJson(path.resolve(root, options.profile));
  validateProfile(profile, catalog, sources);
  if (options.only) {
    const selected = new Set(options.only.split(',').filter(Boolean));
    for (const id of selected) if (!profile.capabilities.some(c => c.implementation_id === id)) fail(`Selection is not in profile: ${id}`);
    profile = { ...profile, capabilities: profile.capabilities.filter(c => selected.has(c.implementation_id)) };
  }
  const privateRoots = options['private-roots'] ? readJson(path.resolve(root, options['private-roots'])) : {};
  const plan = buildPlan({ root, profile, catalog, sources, privateRoots });
  if (command === 'plan') { emit(root, options.output, plan); return; }
  const results = plan.items.map(item => {
    const source = sources.sources.find(s => s.source_id === item.source_id);
    const result = { ...item, cli_checked: false, cli_passed: false };
    if (item.kind !== 'npm' || item.status !== 'satisfied') return result;
    const installed = inspectRuntime(root, source);
    const probe = spawnSync(process.execPath, [installed.bin, '--version'], {
      cwd: installed.runtime, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, DISABLE_TELEMETRY: '1', DO_NOT_TRACK: '1' }, windowsHide: true,
    });
    const output = `${probe.stdout ?? ''}\n${probe.stderr ?? ''}`.trim();
    const versionPattern = new RegExp(`(^|[^0-9.])${source.version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^0-9.])`);
    return { ...result, cli_checked: true, cli_passed: probe.status === 0 && versionPattern.test(output),
      cli_exit_code: probe.status, cli_output: output.slice(0, 1500), error: probe.error?.message };
  });
  const failed = results.some(item => item.kind === 'npm' && !item.cli_passed);
  const manual = results.some(item => item.kind !== 'npm' && item.required);
  const status = failed ? 'failed' : (options.toolsOnly && !manual ? 'tools-verified' : 'partial');
  emit(root, options.output, { schema_version: 1, profile_id: profile.profile_id, generated_at: new Date().toISOString(),
    status, scope: options.toolsOnly ? 'local-tool-versions-and-cli' : 'profile',
    agent_tasks_verified: false, note: 'CLI checks do not certify Codex/DSH tasks or machine recovery.', results });
  process.exitCode = failed ? 1 : status === 'partial' ? 2 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { cli(process.argv.slice(2)); }
  catch (error) { process.stderr.write(`Toolchain error: ${error.message}\n`); process.exitCode = 1; }
}
