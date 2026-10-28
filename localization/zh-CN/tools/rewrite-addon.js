const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const path = require('path');

const ROOT = (__REPO + '/Interface');
const ZHDIR = __ZH;

const MARK = { NUM: '\u0001', ENT: '\u0002', MON: '\u0003' };

function loadKeys() {
  const plain = new Set();
  const patterns = new Set();
  const merged = {};
  for (const f of fs.readdirSync(ZHDIR).filter(f => f.endsWith('.json')).sort()) {
    Object.assign(merged, JSON.parse(fs.readFileSync(path.join(ZHDIR, f), 'utf8')));
  }
  for (const en of Object.keys(merged)) {
    plain.add(en);
    const norm = normalizeKey(en);
    patterns.add(norm);
  }
  return { plain, patterns };
}

// same normalization as build-locale.js (protect colors/links/%specifiers; digits and {N}/{E}/{M} -> markers)
function normalizeKey(text) {
  const pieces = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    const rest = text.slice(i);
    let m;
    if ((m = rest.match(/^\|c[0-9a-fA-F]{8}/))) { pieces.push(m[0]); i += m[0].length; continue; }
    if ((m = rest.match(/^\|r/))) { pieces.push(m[0]); i += 2; continue; }
    if ((m = rest.match(/^\|H[^|\n]*\|h/))) { pieces.push(m[0]); i += m[0].length; continue; }
    if ((m = rest.match(/^%[.\d]*[df]/))) { pieces.push(m[0]); i += m[0].length; continue; }
    if ((m = rest.match(/^\{(N|E|M)\}/))) { pieces.push(m[1] === 'N' ? MARK.NUM : (m[1] === 'E' ? MARK.ENT : MARK.MON)); i += 4; continue; }
    if ((m = rest.match(/^\d[\d,]*(\.\d+)?/))) { pieces.push(MARK.NUM); i += m[0].length; continue; }
    if ((m = rest.match(/^[^|%\d\{]+/))) { pieces.push(m[0]); i += m[0].length; continue; }
    pieces.push(rest[0]); i += 1;
  }
  return pieces.join('');
}

function unescapeLua(literalBody) {
  let out = '';
  for (let i = 0; i < literalBody.length; i++) {
    if (literalBody[i] === '\\') {
      const c = literalBody[i + 1];
      if (c === 'n') { out += '\n'; i++; }
      else if (c === 'r') { out += '\r'; i++; }
      else if (c === 't') { out += '\t'; i++; }
      else if (c === '"') { out += '"'; i++; }
      else if (c === '\\') { out += '\\'; i++; }
      else if (/[0-9]/.test(c)) {
        let digits = '';
        let j = i + 1;
        while (j < literalBody.length && digits.length < 3 && /[0-9]/.test(literalBody[j])) { digits += literalBody[j]; j++; }
        out += String.fromCharCode(parseInt(digits, 10));
        i = j - 1;
      } else { out += c; i++; }
    } else {
      out += literalBody[i];
    }
  }
  return out;
}

function findLiterals(line) {
  const out = [];
  let i = 0;
  let inStr = false;
  let start = 0;
  while (i < line.length) {
    const c = line[i];
    if (!inStr) {
      if (c === '"') { inStr = true; start = i; }
      else if (c === '-' && line[i + 1] === '-') break;
      i++;
    } else {
      if (c === '\\') { i += 2; continue; }
      if (c === '"') {
        out.push({ start, end: i, body: line.slice(start + 1, i) });
        inStr = false;
      }
      i++;
    }
  }
  return out;
}

function contextIsKeyPosition(line, start, end) {
  let before = '';
  for (let j = start - 1; j >= 0; j--) {
    const ch = line[j];
    if (ch !== ' ' && ch !== '\t') { before = ch; break; }
  }
  let after = '';
  for (let j = end + 1; j < line.length; j++) {
    const ch = line[j];
    if (ch !== ' ' && ch !== '\t') { after = ch; break; }
  }
  return before === '[' && after === ']';
}

function contextIsComparison(line, start) {
  let before = '';
  for (let j = start - 1; j >= 0; j--) {
    const ch = line[j];
    if (ch !== ' ' && ch !== '\t') { before = line.slice(Math.max(0, j - 1), j + 1); break; }
  }
  return before === '==' || before === '~=' || before.endsWith('=') && before.length === 1;
}

function contextInMatcher(line, start) {
  const prefix = line.slice(0, start);
  return /(?:strfind|string\.find|gsub|string\.gsub|gmatch)\s*\([^,]*,\s*$/.test(prefix);
}

function main() {
  const { plain, patterns } = loadKeys();
  const files = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
      else if (e.name.endsWith('.lua')) files.push(path.join(dir, e.name));
    }
  })(ROOT);
  files.sort();

  let totalWrapped = 0;
  const report = [];
  for (const file of files) {
    const rel = path.relative(path.dirname(ROOT), file).split(path.sep).join('/');
    if (rel.includes('VanillaBonkLocale')) continue;
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    let wrapped = 0;
    const outLines = lines.map((line, idx) => {
      if (line.trim().startsWith('--')) return line;
      const literals = findLiterals(line);
      if (!literals.length) return line;
      let delta = 0;
      let newLine = line;
      for (const lit of literals) {
        const value = unescapeLua(lit.body);
        let match = null;
        if (plain.has(value)) match = 'plain';
        else if (patterns.has(normalizeKey(value))) match = 'pattern';
        else {
          const trimmed = value.replace(/\s+$/, '');
          if (trimmed !== value && plain.has(trimmed)) match = 'plain';
        }
        if (!match) continue;
        const s = lit.start + delta;
        const e = lit.end + delta;
        if (contextIsKeyPosition(newLine, s, e)) continue;
        if (contextIsComparison(newLine, s)) continue;
        if (contextInMatcher(newLine, s)) continue;
        const literal = newLine.slice(s, e + 1);
        newLine = newLine.slice(0, s) + 'VanillaBonkLocale.L(' + literal + ')' + newLine.slice(e + 1);
        delta += 'VanillaBonkLocale.L('.length + 1;
        wrapped++;
        report.push(`${rel}:${idx + 1}: ${match} ${JSON.stringify(value.slice(0, 60))}`);
      }
      return newLine;
    });
    if (wrapped > 0) {
      fs.writeFileSync(file, outLines.join('\n'), 'utf8');
      totalWrapped += wrapped;
      console.log(String(wrapped).padStart(4), rel);
    }
  }
  fs.writeFileSync((__WORK + '/wrap-report.txt'), report.join('\n'), 'utf8');
  console.log('TOTAL wrapped:', totalWrapped, 'files touched listed above');
}

main();
