const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const path = require('path');

const ZHDIR = __ZH;
const NUM = /\d[\d,]*(\.\d+)?/g;
const stripProtected = s => s.replace(/\|c[0-9a-fA-F]{8}/g, '').replace(/\|r/g, '').replace(/\|H[^|]*\|h/g, '').replace(/%[.\d]*[df]/g, '');

function loadAll() {
  const merged = {};
  for (const f of fs.readdirSync(ZHDIR).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(ZHDIR, f), 'utf8'));
    for (const [en, zh] of Object.entries(data)) {
      if (merged[en] !== undefined && merged[en] !== zh) {
        console.log('CONFLICT for key:', JSON.stringify(en.slice(0, 60)));
        console.log('  old:', merged[en].slice(0, 40), ' new:', zh.slice(0, 40));
      }
      merged[en] = zh;
    }
  }
  return merged;
}

const map = loadAll();
let ok = 0, issues = [];
for (const [en, zh] of Object.entries(map)) {
  const nums = (stripProtected(en).match(NUM) || []).concat(en.match(/\{N\}/g) || []);
  const markers = zh.match(/\{(\d+)\}/g) || [];
  const distinct = new Set(markers.map(m => m.slice(1, -1)));
  const zhPlain = stripProtected(zh).replace(/\{\d+\}/g, '');
  const zhNums = zhPlain.match(/\d/) ? (zhPlain.match(NUM) || []) : [];
  if (distinct.size !== nums.length) {
    issues.push(`COUNT MISMATCH (${nums.length} en numbers vs ${distinct.size} distinct zh markers): ${JSON.stringify(en.slice(0, 70))} -> ${zh.slice(0, 40)}`);
    continue;
  }
  const enE = (en.match(/\{E\}/g) || []).length;
  const zhE = (zh.match(/\{E\}/g) || []).length;
  const enM = (en.match(/\{M\}/g) || []).length;
  const zhM = (zh.match(/\{M\}/g) || []).length;
  if (enE !== zhE) { issues.push(`ENTITY MISMATCH (${enE} vs ${zhE}): ${en.slice(0, 60)}`); continue; }
  if (enM !== zhM) { issues.push(`MONEY MISMATCH (${enM} vs ${zhM}): ${en.slice(0, 60)}`); continue; }
  const seq = markers.map(m => Number(m.slice(1, -1)));
  for (const s of seq) {
    if (s < 1 || s > nums.length) { issues.push(`OUT OF RANGE ${s} in: ${en.slice(0, 50)}`); break; }
  }
  for (let i = 1; i <= nums.length; i++) {
    if (!seq.includes(i)) { issues.push(`MISSING marker {${i}} in: ${en.slice(0, 50)}`); break; }
  }
  if (zhNums.length) issues.push(`EXTRA literal digits in zh: ${en.slice(0, 50)} -> ${zh.slice(0, 50)}`);
  if (!issues.length) ok++;
}
console.log('entries:', Object.keys(map).length, 'validated ok:', ok);
for (const i of issues) console.log(i);
