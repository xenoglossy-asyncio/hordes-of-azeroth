const __REPO = require("path").resolve(__dirname, "../../..").split(require("path").sep).join("/");
const __ZH = __REPO + "/localization/zh-CN/translations";
const __WORK = require("path").join(require("os").tmpdir(), "hoa-zh").split(require("path").sep).join("/");
const fs = require('fs');
const readline = require('readline');

const DUMP = process.argv[2] || (__WORK + '/worlddb/server/sql/world.sql');
const OUT = process.argv[3] || (__WORK + '/bonk-data.json');

const want = (t) => t.startsWith('bonk_') || t === 'creature_template' || t === 'item_template';

async function main() {
  const rl = readline.createInterface({ input: fs.createReadStream(DUMP, 'utf8'), crlfDelay: Infinity });
  const tables = {};          // name -> { columns: [], rows: [] }
  const columnCache = {};
  let currentTable = null;    // during CREATE TABLE
  let insertTable = null;     // during INSERT block
  let insertBuf = [];
  let inInsert = false;

  const finishInsert = () => {
    if (!insertTable) return;
    const sql = insertBuf.join('\n');
    const open = sql.indexOf('(');
    const body = sql.slice(open, sql.lastIndexOf(')') + 1);
    for (const tuple of splitTuples(body)) {
      const fields = splitFields(tuple);
      if (fields) tables[insertTable].rows.push(fields);
    }
    inInsert = false; insertTable = null; insertBuf = [];
  };

  for await (const raw of rl) {
    const line = raw.trim();
    if (currentTable) {
      const m = line.match(/^`([^`]+)`\s+(.+?),?$/);
      if (m && !/^(PRIMARY|UNIQUE|KEY|CONSTRAINT|FOREIGN)/.test(m[1])) {
        columnCache[currentTable].push(m[1]);
      }
      if (line.startsWith(')')) {
        tables[currentTable].columns = columnCache[currentTable];
        currentTable = null;
      }
      continue;
    }
    let m = line.match(/^CREATE TABLE `([^`]+)`/);
    if (m) {
      if (!want(m[1])) continue;
      currentTable = m[1];
      columnCache[m[1]] = [];
      tables[m[1]] = { columns: [], rows: [] };
      continue;
    }
    if (inInsert) {
      insertBuf.push(line);
      if (/;\s*$/.test(line) || line === '') finishInsert();
      continue;
    }
    m = line.match(/^INSERT INTO `([^`]+)` VALUES/);
    if (m && want(m[1])) {
      insertTable = m[1];
      inInsert = true;
      insertBuf = [line];
      if (/;\s*$/.test(line)) finishInsert();
    }
  }
  if (inInsert) finishInsert();

  // sql string unescape (mysqldump style backslash escapes + doubled quotes)
  function unsql(s) {
    s = s.replace(/^'|'$/g, '');
    let out = '';
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '\\' && i + 1 < s.length) {
        const n = s[i + 1];
        if (n === 'n') { out += '\n'; i++; }
        else if (n === 'r') { out += '\r'; i++; }
        else if (n === 't') { out += '\t'; i++; }
        else if (n === '0') { out += '\0'; i++; }
        else { out += n; i++; }
        continue;
      }
      if (c === "'" && s[i + 1] === "'") { out += "'"; i++; continue; }
      out += c;
    }
    return out;
  }
  function splitTuples(body) {
    const out = [];
    let depth = 0, cur = '', inStr = false;
    for (let i = 0; i < body.length; i++) {
      const c = body[i];
      if (inStr) {
        cur += c;
        if (c === '\\') { cur += (body[i + 1] || ''); i++; continue; }
        if (c === "'") {
          if (body[i + 1] === "'") { cur += "'"; i++; }
          else inStr = false;
          continue;
        }
        continue;
      }
      if (c === "'") { inStr = true; cur += c; continue; }
      if (c === '(') { depth++; if (depth === 1) { cur = ''; continue; } }
      if (c === ')') { depth--; if (depth === 0) { out.push(cur); cur = ''; continue; } }
      if (depth >= 1) cur += c;
    }
    return out;
  }
  function splitFields(tuple) {
    const out = [];
    let cur = '', inStr = false;
    for (let i = 0; i < tuple.length; i++) {
      const c = tuple[i];
      if (inStr) {
        cur += c;
        if (c === '\\') { cur += tuple[i + 1] || ''; i++; continue; }
        if (c === "'") {
          if (tuple[i + 1] === "'") { cur += "'"; i++; }
          else inStr = false;
        }
        continue;
      }
      if (c === "'") { inStr = true; cur += c; continue; }
      if (c === ',' && !inStr) { out.push(cur.trim()); cur = ''; continue; }
      cur += c;
    }
    out.push(cur.trim());
    return out.map(f => f === 'NULL' ? null : (f.startsWith("'") ? unsql(f) : f));
  }

  const result = {};
  for (const [name, t] of Object.entries(tables)) {
    if (name === 'creature_template' || name === 'item_template') {
      const cols = t.columns;
      const idIdx = cols.indexOf('entry');
      const nameIdx = cols.indexOf('name');
      const map = {};
      for (const r of t.rows) if (r[idIdx] != null && r[nameIdx]) map[r[idIdx]] = r[nameIdx];
      result[name] = { columns: cols, nameMap: map, rowCount: t.rows.length };
      continue;
    }
    const rows = t.rows.map(r => {
      const o = {};
      t.columns.forEach((c, i) => o[c] = r[i]);
      return o;
    });
    result[name] = { columns: t.columns, rows, rowCount: rows.length };
  }
  fs.writeFileSync(OUT, JSON.stringify(result, null, 1), 'utf8');
  const summary = Object.entries(result).map(([k, v]) => `${k}: ${v.rowCount} rows, ${v.columns.length} cols`).join('\n');
  console.log(summary);
}

main().catch(e => { console.error(e); process.exit(1); });
