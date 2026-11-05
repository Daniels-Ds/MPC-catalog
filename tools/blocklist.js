// Слова, которых не должно быть в файлах для заказчика.
// Сам список лежит в .blocklist (одно слово на строку) — файл не попадает в репозиторий.
const fs = require('fs'), path = require('path');
const file = path.join(__dirname, '..', '.blocklist');
const BLOCKLIST = fs.existsSync(file)
  ? fs.readFileSync(file, 'utf8').split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean)
  : [];
module.exports = { BLOCKLIST };
