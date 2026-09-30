// Run with: node tests/test_safe_links.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'docs/index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
const code = script.slice(script.indexOf('  function safeUrl('), script.indexOf('  function isGeneric('));
const context = vm.createContext({URL});
vm.runInContext(code, context);
for (const url of ['javascript:alert(1)', 'java\nscript:alert(1)', 'data:text/html,test',
                   'https://user:password@example.com', '//example.com', 'https://[bad']) {
  assert.equal(context.safeUrl(url), '');
}
for (const url of ['https://careers.example.com/job/1', 'http://careers.example.com/job/1',
                   'mailto:careers@example.com?subject=Apply']) {
  assert.equal(context.safeUrl(url), url);
}
console.log('Jobs application-link safety checks passed.');
