import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { loadCatalog, inspectRuntime, resolveInside, writeReport, assertExecutableSource } from './toolchain.mjs';

export function evaluateBundle(text, expected) {
  if (expected.schema_version !== 1 || !Array.isArray(expected.files) || !Array.isArray(expected.facts)) throw new Error('Invalid pilot expectations');
  const blocks = new Map();
  for (const match of text.matchAll(/<file path="([^"]+)">([\s\S]*?)<\/file>/g)) {
    const filename = match[1].replaceAll('\\', '/');
    if (blocks.has(filename)) throw new Error(`Duplicate bundle file block: ${filename}`);
    blocks.set(filename, match[2]);
  }
  const missingFiles = expected.files.filter(filename => !blocks.has(filename));
  const missingFacts = expected.facts.filter(fact => !blocks.get(fact.file)?.includes(fact.needle)).map(fact => fact.id);
  return { status: missingFiles.length || missingFacts.length ? 'failed' : 'passed',
    scope: 'synthetic-source-bundle-completeness', files_expected: expected.files.length,
    files_found: expected.files.length - missingFiles.length, facts_expected: expected.facts.length,
    facts_found: expected.facts.length - missingFacts.length, missing_files: missingFiles, missing_facts: missingFacts,
    semantic_analysis_verified: false, hardware_verified: false, agent_tasks_verified: false };
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const { sources } = loadCatalog(root);
  const source = sources.sources.find(item => item.source_id === 'repomix-1.18.1');
  if (!source) throw new Error('Reviewed Repomix source missing');
  assertExecutableSource(source);
  const runtime = inspectRuntime(root, source);
  if (runtime.status !== 'installed') throw new Error(`Repomix is not ready: ${runtime.status}`);
  const sample = resolveInside(root, 'examples/stm32-context');
  const expected = JSON.parse(fs.readFileSync(path.join(sample, 'expected.json'), 'utf8').replace(/^\uFEFF/, ''));
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDirectory = resolveInside(root, `.local/pilots/repomix-${stamp}`);
  writeReport(root, path.join(outputDirectory, 'report.json'), { status: 'running', scope: 'synthetic-pilot' });
  const bundle = path.join(outputDirectory, 'bundle.xml');
  const started = Date.now();
  const result = spawnSync(process.execPath, [runtime.bin, '.', '--config', 'repomix.config.json', '--output', bundle], {
    cwd: sample, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024, windowsHide: true,
    env: { ...process.env, DISABLE_TELEMETRY: '1', DO_NOT_TRACK: '1' },
  });
  fs.writeFileSync(path.join(outputDirectory, 'cli.log'), `${result.stdout ?? ''}\n${result.stderr ?? ''}`, 'utf8');
  if (result.error || result.status !== 0) throw new Error(`Repomix pilot failed (${result.status}): ${result.error?.message ?? result.stderr?.slice(-1200)}`);
  const evaluation = evaluateBundle(fs.readFileSync(bundle, 'utf8'), expected);
  const report = { schema_version: 1, generated_at: new Date().toISOString(), ...evaluation,
    tool: 'repomix', version: source.version, input: 'examples/stm32-context',
    elapsed_ms: Date.now() - started, output_bytes: fs.statSync(bundle).size,
    output: path.relative(root, bundle).replaceAll('\\', '/'),
    note: 'This measures material preservation only. No model comparison, firmware build or hardware test is implied.' };
  writeReport(root, path.join(outputDirectory, 'report.json'), report);
  writeReport(root, '.local/reports/repomix-pilot-latest.json', report);
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (evaluation.status !== 'passed') process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(`Pilot error: ${error.message}`); process.exitCode = 1; }
}
