import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
const legacy = createRequire(import.meta.url);
const root = createRequire(new URL('../../package.json', import.meta.url));
assert.match(root('eslint/package.json').version, /^10\./);
assert.match(legacy('eslint/package.json').version, /^9\./);
assert.match(root('typescript').version, /^6\./);
assert.match(execFileSync(process.execPath, ['node_modules/typescript-native/bin/tsc', '--version'], { encoding: 'utf8' }), /Version 7\./);
const eslint = new (legacy('eslint').ESLint)({ overrideConfigFile: resolve('tools/react-lint/eslint.config.js') });
for (const [source, rule] of [
  ['export const Example = () => [<div />];', 'react/jsx-key'],
  ['export const Example = () => <div children="x"><span /></div>;', 'react/no-children-prop'],
  ['export const Example = () => <div title="a" title="b" />;', 'react/jsx-no-duplicate-props'],
]) {
  const [result] = await eslint.lintText(source, { filePath: 'examples/playground/src/lint-fixture.tsx' });
  assert.ok(result.messages.some(message => message.ruleId === rule), `${rule} must remain active`);
}
console.log('ESLint 10 + React ESLint 9 rules + native TS 7 / compiler API 6 verified');
