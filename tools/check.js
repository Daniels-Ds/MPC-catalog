// Проверка перед коммитом и деплоем: ни в одном файле репозитория нет слов из .blocklist.
// Запуск: npm run check
const fs = require('fs'), path = require('path');
const { BLOCKLIST } = require('./blocklist');
const root = path.join(__dirname, '..');
const SKIP = new Set(['.git', 'node_modules', 'publish', '.blocklist', '.claude']);
const hits = [];
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = path.join(dir, name), st = fs.statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (/\.(png|jpe?g|gif|webp|ico)$/i.test(name)) continue;
    const text = fs.readFileSync(p, 'utf8').toLowerCase();
    BLOCKLIST.forEach(w => { if (text.includes(w)) hits.push(`${path.relative(root, p)}: «${w}»`); });
  }
})(root);
if (!BLOCKLIST.length) console.log('Файла .blocklist нет — проверять нечего.');
if (hits.length) { console.error('Найдены запрещённые слова:\n' + hits.join('\n')); process.exit(1); }
console.log('Чисто.');
