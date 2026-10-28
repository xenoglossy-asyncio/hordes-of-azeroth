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
    if (src.includes(oldStr)) {
      src = src.replace(oldStr, newStr);
      applied++;
    } else {
      console.log('MISS in', file, ':', JSON.stringify(oldStr.slice(0, 70)));
    }
  }
  fs.writeFileSync(p, src, 'utf8');
  console.log(file, 'applied', applied, '/', pairs.length);
}

patch('VanillaBonk.lua', [
  ['tinsert(terms, { text = keyword.name, id = id })',
   'tinsert(terms, { text = VanillaBonkLocale.L(keyword.name), id = id })'],
  ['tooltip:AddLine(keyword.name, VB.KeywordRGB(id))',
   'tooltip:AddLine(VanillaBonkLocale.L(keyword.name), VB.KeywordRGB(id))'],
  ['block.label:SetText(ColorKeywords(stat.label))',
   'block.label:SetText(ColorKeywords(VanillaBonkLocale.L(stat.label)))'],
  ['card.name:SetText(option.name)',
   'card.name:SetText(VanillaBonkLocale.L(option.name))'],
  ['GameTooltip:AddLine(option.name, 1, 0.82, 0)',
   'GameTooltip:AddLine(VanillaBonkLocale.L(option.name), 1, 0.82, 0)'],
  ['GameTooltip:AddLine(option.name, 0.6, 0.6, 0.6)',
   'GameTooltip:AddLine(VanillaBonkLocale.L(option.name), 0.6, 0.6, 0.6)'],
  ['GameTooltip:AddLine(option.description, 1, 1, 1, 1)',
   'GameTooltip:AddLine(ColorKeywords(option.description), 1, 1, 1, 1)'],
  ['GameTooltip:AddLine(node.name, 1, 1, 1)',
   'GameTooltip:AddLine(VanillaBonkLocale.L(node.name), 1, 1, 1)'],
  ['GameTooltip:AddLine(VanillaBonkLocale.L("Each rank: ") .. node.description, 1, 0.82, 0, 1)',
   'GameTooltip:AddLine(VanillaBonkLocale.L("Each rank: ") .. ColorKeywords(VanillaBonkLocale.L(node.description)), 1, 0.82, 0, 1)'],
  ['GameTooltip:AddLine(node.description, 1, 0.82, 0, 1)',
   'GameTooltip:AddLine(ColorKeywords(VanillaBonkLocale.L(node.description)), 1, 0.82, 0, 1)'],
  ['shop.header:SetText(data.npc)',
   'shop.header:SetText(VanillaBonkLocale.L(data.npc))'],
  ['tinsert(maps, { icon = parts[1] or "", name = parts[2] or parts[1], type = parts[3], reward = tonumber(parts[4] or ""), key = parts[5] or "" })',
   'tinsert(maps, { icon = parts[1] or "", name = VanillaBonkLocale.L(parts[2] or parts[1]), type = parts[3], reward = tonumber(parts[4] or ""), key = parts[5] or "" })'],
  ['tinsert(dungeons, { key = parts[1], icon = parts[2] or "", name = parts[3] or parts[1], open = parts[4] == "1" })',
   'tinsert(dungeons, { key = parts[1], icon = parts[2] or "", name = VanillaBonkLocale.L(parts[3] or parts[1]), open = parts[4] == "1" })'],
  ['tinsert(VB.pendingTiers, { id = f[2], key = f[3], name = f[4], unlocked = f[5] == "1", hint = f[6] or "", best = tonumber(f[7]) or 0,',
   'tinsert(VB.pendingTiers, { id = f[2], key = f[3], name = VanillaBonkLocale.L(f[4]), unlocked = f[5] == "1", hint = VanillaBonkLocale.L(f[6] or ""), best = tonumber(f[7]) or 0,'],
  ['        description = f[8] or "", art = f[9] or "", maps = maps, stages = tonumber(f[11] or ""), endless = f[12] == "1",\n        dungeons = dungeons, details = f[14] or "" })',
   '        description = VanillaBonkLocale.L(f[8] or ""), art = f[9] or "", maps = maps, stages = tonumber(f[11] or ""), endless = f[12] == "1",\n        dungeons = dungeons, details = VanillaBonkLocale.L(f[14] or "") })'],
  ['tinsert(VB.pendingStarters, { id = f[2], icon = f[3] or "", name = f[4] or "", unlocked = f[5] == "1", chosen = f[6] == "1",\n        hint = f[7] or "", description = f[8] or "" })',
   'tinsert(VB.pendingStarters, { id = f[2], icon = f[3] or "", name = VanillaBonkLocale.L(f[4] or ""), unlocked = f[5] == "1", chosen = f[6] == "1",\n        hint = VanillaBonkLocale.L(f[7] or ""), description = VanillaBonkLocale.L(f[8] or "") })'],
  ['handlers["msg"] = function(f)\n    Notice(f[2])\nend',
   'handlers["msg"] = function(f)\n    Notice(VanillaBonkLocale.L(f[2]))\nend'],
  ['handlers["find"] = function(f)\n    UIErrorsFrame:AddMessage(f[2], 0.3, 0.8, 1.0, 1.0, 10)',
   'handlers["find"] = function(f)\n    UIErrorsFrame:AddMessage(VanillaBonkLocale.L(f[2]), 0.3, 0.8, 1.0, 1.0, 10)'],
  ['VB.shopIncoming = { kind = f[2], open = f[3] == "1", npc = f[4] or "", currency = f[5] or "gold", balance = tonumber(f[6]) or 0,',
   'VB.shopIncoming = { kind = f[2], open = f[3] == "1", npc = VanillaBonkLocale.L(f[4] or ""), currency = f[5] or "gold", balance = tonumber(f[6]) or 0,'],
  ['tinsert(VB.shopIncoming.trees, { id = f[2], name = f[3] or "", background = f[4] or "MageFire" })',
   'tinsert(VB.shopIncoming.trees, { id = f[2], name = VanillaBonkLocale.L(f[3] or ""), background = f[4] or "MageFire" })'],
  ['        name = f[14] or "",\n        description = f[15] or "",\n        locked = f[16] == "1",\n        quest = f[17] or "",',
   '        name = VanillaBonkLocale.L(f[14] or ""),\n        description = f[15] or "",\n        locked = f[16] == "1",\n        quest = f[17] or "",'],
  ['        valuePerRank = f[18] or "",\n        refund = tonumber(f[19]) or 0,\n        questDescription = f[20] or "",',
   '        valuePerRank = f[18] or "",\n        refund = tonumber(f[19]) or 0,\n        questDescription = VanillaBonkLocale.L(f[20] or ""),'],
  ['local set = { name = f[3], pieces = {}, bonuses = {} }',
   'local set = { name = VanillaBonkLocale.L(f[3]), pieces = {}, bonuses = {} }'],
  ['byName[name] = { entry = entry, name = name, entries = { entry } }',
   'byName[name] = { entry = entry, name = VanillaBonkLocale.L(name), entries = { entry } }'],
  ['tinsert(set.bonuses, { pieces = tonumber(f[3]) or 0, stats = ParseStats(f[4]), text = f[5] or "" })',
   'tinsert(set.bonuses, { pieces = tonumber(f[3]) or 0, stats = ParseStats(f[4]), text = VanillaBonkLocale.L(f[5] or "") })'],
]);
