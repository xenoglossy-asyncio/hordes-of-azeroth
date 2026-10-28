const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const path = require('path');
const luaparse = require('luaparse');

const ROOT = (__REPO + '/Interface');
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith('.lua')) files.push(path.join(dir, e.name));
  }
})(ROOT);
files.sort();

let failed = 0;
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  try {
    luaparse.parse(src, { luaVersion: '5.1', comments: false });
  } catch (e) {
    failed++;
    console.log('SYNTAX FAIL:', path.relative(path.dirname(ROOT), file), e.message.slice(0, 100));
  }
}
console.log('checked', files.length, 'files, failures:', failed);
