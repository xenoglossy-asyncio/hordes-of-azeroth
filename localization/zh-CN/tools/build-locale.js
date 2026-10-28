const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const path = require('path');

const ZHDIR = __ZH;
const OUTS = [
  (__REPO + '/Interface/AddOns/HordesOfAzeroth/VanillaBonkLocaleZhCN.lua'),
  (__REPO + '/Interface/GlueXML/VanillaBonkLocaleZhCN.lua'),
];
const PREFERRED = { Blink: '闪现术', Volley: '乱射', Bloodlust: '血之渴', ' in ': '，用时 ' };

const MARK = { NUM: '\u0001', ENT: '\u0002', MON: '\u0003' };

function luaEscape(s) {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (ch === '"') out += '\\"';
    else if (ch === '\\') out += '\\\\';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (c < 32 || (c >= 127 && c <= 255)) out += '\\' + String(c).padStart(3, '0');
    else out += ch;
  }
  return out;
}

// tokenize: split into protected segments and plain segments
// protected: |cXXXXXXXX .. |r pairs (approx: just the |c tag + 8 hex), |H..|h links, %format specifiers
function protectAndNormalize(text, markerForNumber) {
  const pieces = [];
  let i = 0;
  const n = text.length;
  const pushPlain = (s) => {
    if (!s) return;
    // number tokens -> MARK.NUM ; {N} -> MARK.NUM ; {E}/{M} handled separately
    let out = '';
    let j = 0;
    while (j < s.length) {
      const brace = s.slice(j).match(/^\{(N|E|M)\}/);
      if (brace) {
        out += brace[1] === 'N' ? MARK.NUM : (brace[1] === 'E' ? MARK.ENT : MARK.MON);
        j += 4;
        continue;
      }
      const num = s.slice(j).match(/^\d[\d,]*(\.\d+)?/);
      if (num) {
        out += MARK.NUM;
        j += num[0].length;
        continue;
      }
      out += s[j];
      j += 1;
    }
    pieces.push(out);
  };
  while (i < n) {
    const rest = text.slice(i);
    let m;
    if ((m = rest.match(/^\|c[0-9a-fA-F]{8}/))) { pieces.push(m[0]); i += m[0].length; continue; }
    if ((m = rest.match(/^\|r/))) { pieces.push(m[0]); i += 2; continue; }
    if ((m = rest.match(/^\|H[^|\n]*\|h/))) { pieces.push(m[0]); i += m[0].length; continue; }
    if ((m = rest.match(/^%[.\d]*[df]/))) { pieces.push(m[0]); i += m[0].length; continue; }
    const ch = rest.match(/^[^|%\d\{]+/);
    if (ch) { pushPlain(ch[0]); i += ch[0].length; continue; }
    if (rest[0] === '|' || rest[0] === '%') { pieces.push(rest[0]); i += 1; continue; }
    if (rest[0] === '{') {
      const b = rest.match(/^\{[^}]*\}/);
      if (b && b[0].length <= 6 && b[0] !== '{') { pieces.push(b[0]); i += b[0].length; continue; }
      pieces.push('{'); i += 1; continue;
    }
    if (rest[0] === '\d') { pieces.push(rest[0]); i += 1; continue; }
    pieces.push(rest[0]); i += 1;
  }
  return pieces.join('');
}

function normalizeZh(text) {
  // {1}..{n} -> NUM+idx, {E} -> ENT+pos, {M} -> MON+pos
  let out = '';
  let entPos = 0, monPos = 0;
  let i = 0;
  while (i < text.length) {
    const m = text.slice(i).match(/^\{(\d+)\}/);
    if (m) {
      const idx = Math.min(255, parseInt(m[1], 10));
      out += MARK.NUM + String.fromCharCode(idx);
      i += m[0].length;
      continue;
    }
    if (text.slice(i).startsWith('{E}')) { entPos += 1; out += MARK.ENT + String.fromCharCode(Math.min(255, entPos)); i += 3; continue; }
    if (text.slice(i).startsWith('{M}')) { monPos += 1; out += MARK.MON + String.fromCharCode(Math.min(255, monPos)); i += 3; continue; }
    out += text[i];
    i += 1;
  }
  return out;
}

function loadAll() {
  const merged = {};
  const conflicts = [];
  const order = fs.readdirSync(ZHDIR).filter(f => f.endsWith('.json')).sort();
  for (const f of order) {
    const data = JSON.parse(fs.readFileSync(path.join(ZHDIR, f), 'utf8'));
    for (const [en, zh] of Object.entries(data)) {
      if (en in merged && merged[en] !== zh) {
        if (PREFERRED[en]) merged[en] = PREFERRED[en];
        else conflicts.push(`${en.slice(0, 50)} | ${merged[en]} vs ${zh}`);
      } else if (!(en in merged)) merged[en] = zh;
    }
  }
  return { merged, conflicts };
}

function main() {
  const { merged, conflicts } = loadAll();
  console.log('entries:', Object.keys(merged).length, 'conflicts:', conflicts.length);
  for (const c of conflicts) console.log('  CONFLICT kept-first:', c);

  const table = {};
  for (const [en, zh] of Object.entries(merged)) {
    const key = protectAndNormalize(en);
    const val = normalizeZh(zh);
    if (key in table && table[key] !== val) {
      console.log('  KEY COLLISION after normalization:', JSON.stringify(key.slice(0, 60)));
      console.log('    old:', table[key].slice(0, 50), ' new:', val.slice(0, 50));
    }
    table[key] = val;
  }

  // entity candidates: keys that are name-like (no sentence punctuation, reasonably short)
  const entities = [];
  for (const k of Object.keys(merged)) {
    if (k.length <= 60 && !/[.;!?]/.test(k) && k.trim() === k && (k.includes(' ') || /^[A-Za-z'·-]+$/.test(k))) {
      entities.push(protectAndNormalize(k));
    }
  }
  const entitySet = Array.from(new Set(entities)).sort((a, b) => b.length - a.length);

  const lines = [];
  lines.push('VanillaBonkLocaleZhCN = {}');
  lines.push('');
  lines.push('VanillaBonkLocaleZhCN.texts = {');
  const keys = Object.keys(table).sort();
  for (const k of keys) {
    lines.push(`  ["${luaEscape(k)}"] = "${luaEscape(table[k])}",`);
  }
  lines.push('}');
  lines.push('');
  lines.push('VanillaBonkLocaleZhCN.entities = {');
  for (const e of entitySet) {
    if (!e) continue;
    lines.push(`  "${luaEscape(e)}",`);
  }
  lines.push('}');
  lines.push('');
  lines.push('VanillaBonkLocale.SetLanguage(VanillaBonkLocale.DetectLanguage())');
  lines.push('');
  for (const OUT of OUTS) {
    fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
    console.log('wrote', OUT, ':', keys.length, 'texts,', entitySet.length, 'entities,', Math.round(fs.statSync(OUT).size / 1024), 'KB');
  }
}

main();
