const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const path = require('path');
const ROOT = (__REPO + '/Interface/AddOns/HordesOfAzeroth');

function patch(file, pairs) {
  const p = path.join(ROOT, file);
  let src = fs.readFileSync(p, 'utf8');
  let applied = 0;
  for (const [oldStr, newStr] of pairs) {
    if (src.includes(oldStr)) { src = src.split(oldStr).join(newStr); applied++; }
    else console.log('MISS in', file, ':', JSON.stringify(oldStr.slice(0, 80)));
  }
  fs.writeFileSync(p, src, 'utf8');
  console.log(file, 'applied', applied, '/', pairs.length);
}

patch('VanillaBonkUI.lua', [
  ['UI.FONT = "Fonts\\\\FRIZQT__.TTF"\nUI.NUMBER_FONT = "Fonts\\\\ARIALN.TTF"\nUI.TITLE_FONT = "Fonts\\\\MORPHEUS.TTF"',
   'UI.FONT = VanillaBonkLocale.Font()\nUI.NUMBER_FONT = VanillaBonkLocale.NumberFont()\nUI.TITLE_FONT = VanillaBonkLocale.TitleFont()'],
]);

patch('VanillaBonk.lua', [
  ['local FONT = "Fonts\\\\FRIZQT__.TTF"',
   'local FONT = VanillaBonkLocale.Font()'],
  ['offerFrame.title:SetFont("Fonts\\\\MORPHEUS.TTF", 46, "OUTLINE")',
   'offerFrame.title:SetFont(VanillaBonkLocale.TitleFont(), 46, "OUTLINE")'],
]);

patch('VanillaBonkCodex.lua', [
  ['local FONT = "Fonts\\\\FRIZQT__.TTF"\nlocal NUMBER_FONT = "Fonts\\\\ARIALN.TTF"',
   'local FONT = VanillaBonkLocale.Font()\nlocal NUMBER_FONT = VanillaBonkLocale.NumberFont()'],
]);

patch('VanillaBonkPlates.lua', [
  ['local NAME_FONT = "Fonts\\\\FRIZQT__.TTF"\nlocal NUMBER_FONT = "Fonts\\\\ARIALN.TTF"',
   'local NAME_FONT = VanillaBonkLocale.Font()\nlocal NUMBER_FONT = VanillaBonkLocale.NumberFont()'],
]);

patch('VanillaBonkQuests.lua', [
  ['local FONT = "Fonts\\\\FRIZQT__.TTF"\nlocal NUMBER_FONT = "Fonts\\\\ARIALN.TTF"',
   'local FONT = VanillaBonkLocale.Font()\nlocal NUMBER_FONT = VanillaBonkLocale.NumberFont()'],
]);

patch('VanillaBonkSelfBar.lua', [
  ['local NUMBERS_FONT = "Interface\\\\AddOns\\\\HordesOfAzeroth\\\\Fonts\\\\Barlow-Bold.ttf"',
   'local NUMBERS_FONT = VanillaBonkLocale.IsZh() and "Interface\\\\AddOns\\\\HordesOfAzeroth\\\\Fonts\\\\ZhFont.ttf" or "Interface\\\\AddOns\\\\HordesOfAzeroth\\\\Fonts\\\\Barlow-Bold.ttf"'],
]);
