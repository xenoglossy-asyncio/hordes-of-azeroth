const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const d = JSON.parse(fs.readFileSync((__WORK + '/bonk-data.json'), 'utf8'));
const OUT = (__WORK + '/db-corpus.json');

const spec = {
  bonk_card: ['name', 'description'],
  bonk_glyph: ['name', 'description', 'drawback'],
  bonk_item_set: ['name'],
  bonk_item_set_bonus: ['description'],
  bonk_keyword: ['name', 'description'],
  bonk_map: ['name', 'summary', 'description'],
  bonk_mastery: ['name', 'description'],
  bonk_mastery_tree: ['name'],
  bonk_passive: ['name', 'description'],
  bonk_pet_family: ['name', 'description'],
  bonk_quest: ['name', 'description'],
  bonk_shop_tree: ['name'],
  bonk_talent: ['name', 'description'],
  bonk_tier: ['name', 'description', 'details'],
  bonk_title: ['name'],
  bonk_upgrade: ['name', 'description'],
  bonk_wave: ['name'],
  bonk_weapon: ['name', 'description'],
  bonk_archetype: ['name'],
};

const corpus = {};
for (const [table, cols] of Object.entries(spec)) {
  const t = d[table];
  if (!t) { console.error('missing', table); continue; }
  for (const r of t.rows || []) {
    for (const c of cols) {
      const v = r[c];
      if (typeof v === 'string' && v.trim() && v.trim() !== '0') {
        if (!corpus[v]) corpus[v] = { zh: '', where: [] };
        corpus[v].where.push(table + '.' + c);
      }
    }
  }
}

// custom item names (game items use entry >= 900000)
const items = d.item_template.nameMap;
let itemCount = 0;
for (const [entry, name] of Object.entries(items)) {
  if (Number(entry) >= 900000) {
    if (!corpus[name]) corpus[name] = { zh: '', where: [] };
    corpus[name].where.push('item#' + entry);
    itemCount++;
  }
}

fs.writeFileSync(OUT, JSON.stringify(corpus, null, 1), 'utf8');
const keys = Object.keys(corpus);
console.log('unique strings:', keys.length, 'custom items:', itemCount);
const lens = keys.map(k => k.length);
console.log('total chars:', lens.reduce((a, b) => a + b, 0));
console.log('with digits:', keys.filter(k => /\d/.test(k)).length);
