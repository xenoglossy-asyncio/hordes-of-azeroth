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

patch('VanillaBonk.lua', [
  ['tooltip:AddLine(keyword.description, 1, 1, 1, 1)',
   'tooltip:AddLine(VanillaBonkLocale.L(keyword.description), 1, 1, 1, 1)'],
]);

patch('VanillaBonkBoss.lua', [
  ['            ShowBoss(f[2], tonumber(f[3]) or 0, tonumber(f[4]) or 0, f[5], f[6], f[7], f[8])',
   '            ShowBoss(VanillaBonkLocale.L(f[2]), tonumber(f[3]) or 0, tonumber(f[4]) or 0, f[5], f[6], f[7], f[8])'],
]);

patch('VanillaBonkTracker.lua', [
  ['callout.name = f[2] ~= "" and f[2] or VanillaBonkLocale.L("Mini-boss")',
   'callout.name = f[2] ~= "" and VanillaBonkLocale.L(f[2]) or VanillaBonkLocale.L("Mini-boss")'],
]);

patch('VanillaBonkObjectives.lua', [
  ['objective.label = f[7] or ""',
   'objective.label = VanillaBonkLocale.L(f[7] or "")'],
  ['objective.description = f[10] or ""',
   'objective.description = VanillaBonkLocale.L(f[10] or "")'],
]);

patch('VanillaBonkHeroBar.lua', [
  ['        class = f[2] or VanillaBonkLocale.L("Class"),',
   '        class = VanillaBonkLocale.L(f[2] or "") ~= "" and VanillaBonkLocale.L(f[2]) or VanillaBonkLocale.L("Class"),'],
]);

patch('VanillaBonkQuests.lua', [
  ['        name = f[3] or "",\n        description = f[4] or "",',
   '        name = VanillaBonkLocale.L(f[3] or ""),\n        description = VanillaBonkLocale.L(f[4] or ""),'],
  ['        reward = f[9] or "",',
   '        reward = VanillaBonkLocale.L(f[9] or ""),'],
  ['    tinsert(toast.queue, { name = f[3] or "", reward = f[4] or "", icon = f[5] or "" })',
   '    tinsert(toast.queue, { name = VanillaBonkLocale.L(f[3] or ""), reward = VanillaBonkLocale.L(f[4] or ""), icon = f[5] or "" })'],
]);

patch('VanillaBonkCards.lua', [
  ['        tips[f[2]] = { name = f[3] or "", description = f[4] or "" }',
   '        tips[f[2]] = { name = VanillaBonkLocale.L(f[3] or ""), description = VanillaBonkLocale.L(f[4] or "") }'],
  ['        states[id] = (f[3] and f[3] ~= "") and f[3] or nil',
   '        states[id] = (f[3] and f[3] ~= "") and VanillaBonkLocale.L(f[3]) or nil'],
]);

patch('VanillaBonkGlyphs.lua', [
  ['    info[id] = {\n        name = f[3] or "",\n        icon = f[4] or "",\n        rarity = tonumber(f[5] or "") or 0,\n        description = f[6] or "",\n        drawback = f[7] or "",\n    }',
   '    info[id] = {\n        name = VanillaBonkLocale.L(f[3] or ""),\n        icon = f[4] or "",\n        rarity = tonumber(f[5] or "") or 0,\n        description = VanillaBonkLocale.L(f[6] or ""),\n        drawback = VanillaBonkLocale.L(f[7] or ""),\n    }'],
]);

patch('VanillaBonkVendor.lua', [
  ['    shop.name = (f[5] and f[5] ~= "") and f[5] or VanillaBonkLocale.L("Zixil")',
   '    shop.name = (f[5] and f[5] ~= "") and VanillaBonkLocale.L(f[5]) or VanillaBonkLocale.L("Zixil")'],
  ['    local description = gsub(f[8] or "", "|n", "\\n")',
   '    local description = gsub(VanillaBonkLocale.L(f[8] or ""), "|n", "\\n")'],
  ['        name = f[6] or "",\n        icon = f[7] or "",\n        description = description,',
   '        name = VanillaBonkLocale.L(f[6] or ""),\n        icon = f[7] or "",\n        description = description,'],
]);

patch('VanillaBonkCodex.lua', [
  ['    incoming = {\n        npc = f[2] or "",',
   '    incoming = {\n        npc = VanillaBonkLocale.L(f[2] or ""),'],
  ['    local spell = {\n        kind = "w",\n        id = id,\n        name = f[3] or "",',
   '    local spell = {\n        kind = "w",\n        id = id,\n        name = VanillaBonkLocale.L(f[3] or ""),'],
  ['        spell.description = f[3] or ""',
   '        spell.description = VanillaBonkLocale.L(f[3] or "")'],
  ['    local passive = {\n        kind = "p",\n        id = id,\n        name = f[3] or "",',
   '    local passive = {\n        kind = "p",\n        id = id,\n        name = VanillaBonkLocale.L(f[3] or ""),'],
  ['        maxRank = tonumber(f[5]) or 1,\n        description = f[7] or "",',
   '        maxRank = tonumber(f[5]) or 1,\n        description = VanillaBonkLocale.L(f[7] or ""),'],
  ['    local card = {\n        kind = "c",\n        id = id,\n        name = f[3] or "",',
   '    local card = {\n        kind = "c",\n        id = id,\n        name = VanillaBonkLocale.L(f[3] or ""),'],
  ['        card.description = f[3] or ""',
   '        card.description = VanillaBonkLocale.L(f[3] or "")'],
  ['    tinsert(incoming.debuffs, {\n        id = tonumber(f[2]) or 0,\n        name = f[3] or "",',
   '    tinsert(incoming.debuffs, {\n        id = tonumber(f[2]) or 0,\n        name = VanillaBonkLocale.L(f[3] or ""),'],
  ['        maxStacks = tonumber(f[5]) or 1,\n        durationMs = tonumber(f[6]) or 0,\n        description = f[7] or "",',
   '        maxStacks = tonumber(f[5]) or 1,\n        durationMs = tonumber(f[6]) or 0,\n        description = VanillaBonkLocale.L(f[7] or ""),'],
  ['    tinsert(eliteAffixes, { name = name, icon = f[3] or "", description = f[4] or "" })',
   '    tinsert(eliteAffixes, { name = name, icon = f[3] or "", description = VanillaBonkLocale.L(f[4] or "") })'],
  ['            affix.icon, affix.description = f[3] or "", f[4] or ""',
   '            affix.icon, affix.description = f[3] or "", VanillaBonkLocale.L(f[4] or "")'],
  ['        incoming.locks[(f[2] or "") .. (f[3] or "")] = { name = f[4] or "", description = f[5] or "" }',
   '        incoming.locks[(f[2] or "") .. (f[3] or "")] = { name = VanillaBonkLocale.L(f[4] or ""), description = VanillaBonkLocale.L(f[5] or "") }'],
]);

patch('VanillaBonkRunMaster.lua', [
  ['            mapInfo[f[2]] = { continent = f[3] or "", summary = f[4] or "", description = f[5] or "",',
   '            mapInfo[f[2]] = { continent = VanillaBonkLocale.L(f[3] or ""), summary = VanillaBonkLocale.L(f[4] or ""), description = VanillaBonkLocale.L(f[5] or ""),'],
]);

patch('VanillaBonkDebuffs.lua', [
  ['        GameTooltip:AddLine(keyword.description, 1, 1, 1, 1)',
   '        GameTooltip:AddLine(VanillaBonkLocale.L(keyword.description), 1, 1, 1, 1)'],
]);
