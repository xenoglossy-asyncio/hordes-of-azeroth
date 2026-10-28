const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const path = require('path');

const ROOT = (__REPO + '/Interface');
const OUT = process.argv[2] || (__WORK + '/addon-strings.json');

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name.endsWith('.lua')) files.push(path.join(dir, e.name));
  }
})(ROOT);

const noise = /^(Interface\\|Fonts\\|Sound\\|SPELL_|PLAY_|IG_|ACTIONBAR_|CHAT_|UNIT_|PLAYER_|UIMENU_|LOOT_|EQUIP_|RAF_|STORE_|WOW_|igQuest|GLUE|\.bonk|BONK~|[a-z_]+\.lua$)/i;

const result = {};
let total = 0;
for (const file of files) {
  const rel = path.relative(path.dirname(ROOT), file);
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const found = [];
  lines.forEach((line, idx) => {
    const stripped = line.replace(/--.*$/, '');
    for (const m of stripped.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
      const s = m[1];
      if (!s) continue;
      if (noise.test(s)) continue;
      if (!/[A-Za-z]{2}/.test(s)) continue;
      if (s.length < 3) continue;
      if (/^[A-Z0-9_]+ [A-Z0-9_]+$/.test(s)) continue;
      if (s === s.toUpperCase() && !/ /.test(s) && s.length < 8) continue;
      found.push({ line: idx + 1, text: s, raw: line.trim().slice(0, 120) });
    }
  });
  result[rel] = found;
  total += found.length;
}
fs.writeFileSync(OUT, JSON.stringify(result, null, 1), 'utf8');
for (const [f, arr] of Object.entries(result)) console.log(String(arr.length).padStart(4), f);
console.log('TOTAL', total);
