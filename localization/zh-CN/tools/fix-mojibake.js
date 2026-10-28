const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');

function fixLine(file, matchPrefix, newLine) {
  let buf = fs.readFileSync(file);
  const text = buf.toString('latin1'); // byte-preserving view
  const lines = text.split('\n');
  let fixed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(matchPrefix)) {
      lines[i] = newLine;
      fixed++;
    }
  }
  if (fixed) {
    const out = Buffer.from(lines.join('\n'), 'latin1');
    fs.writeFileSync(file, out);
  }
  console.log(file, 'fixed', fixed, 'line(s)');
}

const zh = Buffer.from('中文', 'utf8').toString('latin1');

fixLine(
  (__REPO + '/Interface/GlueXML/BonkGlue.lua'),
  '\tBonkLanguageButton:SetText(',
  '\tBonkLanguageButton:SetText(VanillaBonkLocale.LanguageCVar() == "zhCN" and "English" or "' + zh + '");'
);

fixLine(
  (__REPO + '/Interface/AddOns/HordesOfAzeroth/VanillaBonkInterfaceOptions.lua'),
  '        return GetCVar(',
  '        return VanillaBonkLocale.LanguageCVar() == "zhCN" and "' + zh + '" or "English"'
);
