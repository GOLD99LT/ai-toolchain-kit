import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBundle } from '../scripts/lib/pilot.mjs';

const expected = { schema_version: 1, files: ['Core/main.c', 'Core/irq.c'], facts: [
  { id: 'start', file: 'Core/main.c', needle: 'Board_Init();' },
  { id: 'irq', file: 'Core/irq.c', needle: 'HAL_UART_IRQHandler(&uart);' },
] };

test('bundle checks require facts in their named source blocks', () => {
  const xml = '<file path="Core/main.c">Board_Init();</file>\n<file path="Core/irq.c">HAL_UART_IRQHandler(&uart);</file>';
  const result = evaluateBundle(xml, expected);
  assert.equal(result.status, 'passed');
  assert.equal(result.files_found, 2);
  assert.equal(result.facts_found, 2);
  assert.equal(result.semantic_analysis_verified, false);
});

test('an answer file cannot hide missing source facts', () => {
  const xml = '<file path="Core/main.c">Board_Init();</file>\n<file path="EXPECTED.md">HAL_UART_IRQHandler(&uart);</file>';
  const result = evaluateBundle(xml, expected);
  assert.equal(result.status, 'failed');
  assert.deepEqual(result.missing_files, ['Core/irq.c']);
  assert.deepEqual(result.missing_facts, ['irq']);
});

test('a fact copied to another module does not validate the intended module', () => {
  const xml = '<file path="Core/main.c">Board_Init(); HAL_UART_IRQHandler(&uart);</file>\n<file path="Core/irq.c">empty</file>';
  const result = evaluateBundle(xml, expected);
  assert.equal(result.files_found, 2);
  assert.deepEqual(result.missing_facts, ['irq']);
});

test('duplicate file blocks are rejected instead of choosing a convenient copy', () => {
  const xml = '<file path="Core/main.c">empty</file><file path="Core/main.c">Board_Init();</file>';
  assert.throws(() => evaluateBundle(xml, expected), /duplicate/i);
});
