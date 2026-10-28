const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const merged = {};
for (const f of fs.readdirSync(__ZH).filter(f => f.endsWith('.json')))
  Object.assign(merged, JSON.parse(fs.readFileSync((__ZH + '/') + f, 'utf8')));
const d = JSON.parse(fs.readFileSync((__WORK + '/addon-strings.json'), 'utf8'));

const uiLike = s =>
  /[a-z]{3}/.test(s) && / /.test(s) &&
  !/^Interface\\/.test(s) && !/^Fonts\\/.test(s) && !/^Sound\\/.test(s) &&
  !/^World\\/.test(s) && !/^Spells\\/.test(s) && !/^Creature\\/.test(s) && !/^Textures\\/.test(s) &&
  !/%[sd]/.test(s);

const missed = [];
for (const [file, arr] of Object.entries(d)) {
  if (file.includes('GlueXML')) continue;
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x.text)) continue;
    seen.add(x.text);
    if (x.text in merged) continue;
    if (!uiLike(x.text)) continue;
    if (/RegisterEvent|SetScript|CreateFrame\(\"|getglobal|SetTexture|PlaySound|SetNormalTexture|SetPushedTexture|SetHighlightTexture|SetMask|GetObjectType|GetScript/.test(x.raw) &&
        !/SetText|AddLine|AddDoubleLine|Button\(|Tabs\(|title|label|hint|Row\(|Heading\(|StatRow\(|Card\(|Section\(|Note\(|KeyRow\(|SliderRow\(|CheckRow\(|ChoiceRow\(|ShowGuide/.test(x.raw)) continue;
    missed.push(file.split('\\').pop() + ' | ' + x.text + '   <<< ' + x.raw.slice(0, 55));
  }
}
console.log('untranslated UI-like:', missed.length);
missed.forEach(m => console.log(m));
