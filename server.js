// Сервер демо-сайта «МПС Каталог»: отдаёт статические страницы из design/.
// Без зависимостей, только встроенные модули Node.
//
// Переменные окружения:
//   PORT           — порт (Railway задаёт сам), по умолчанию 4173
//   DEMO_PASSWORD  — если задан, сайт спрашивает логин и пароль (Basic Auth)
//   DEMO_USER      — логин, по умолчанию «demo»
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, 'design');
const PORT = +process.env.PORT || 4173;
const USER = process.env.DEMO_USER || 'demo';
const PASSWORD = process.env.DEMO_PASSWORD || '';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};
// Сборка для артефакта не должна попадать на сайт
const HIDDEN = ['/publish/'];

const NOT_FOUND = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Страница не найдена · МПС Каталог</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f5f8fc;color:#23344b;font:15px/1.5 system-ui,sans-serif;text-align:center;padding:16px}
h1{font-size:28px;color:#0b1b33;margin:0 0 8px}a{color:#115ea9;font-weight:600}</style></head>
<body><div><h1>Страница не найдена</h1><p>Такой страницы в демо пока нет.</p><a href="/">На главную</a></div></body></html>`;

function send(res, status, body, type = 'text/html; charset=utf-8', extra = {}) {
  res.writeHead(status, { 'Content-Type': type, ...extra });
  res.end(body);
}

function authorized(req) {
  if (!PASSWORD) return true;
  const [scheme, value] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Basic' || !value) return false;
  const [u, ...rest] = Buffer.from(value, 'base64').toString().split(':');
  return u === USER && rest.join(':') === PASSWORD;
}

const server = http.createServer((req, res) => {
  // Демо не индексируется поисковиками
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');

  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { return send(res, 400, 'Bad request', 'text/plain'); }

  if (url === '/healthz') return send(res, 200, 'ok', 'text/plain');
  if (url === '/robots.txt') return send(res, 200, 'User-agent: *\nDisallow: /\n', 'text/plain; charset=utf-8');
  if (!authorized(req)) {
    return send(res, 401, 'Нужен логин и пароль', 'text/plain; charset=utf-8', { 'WWW-Authenticate': 'Basic realm="MPS Catalog demo", charset="UTF-8"' });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', 'text/plain', { Allow: 'GET, HEAD' });

  if (url === '/favicon.ico') url = '/assets/logo-mps-small.png';
  if (url.endsWith('/')) url += 'index.html';
  if (!path.extname(url)) url += '.html'; // /catalog → catalog.html
  const file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT + path.sep) || HIDDEN.some(h => url.startsWith(h))) return send(res, 404, NOT_FOUND);

  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, NOT_FOUND);
    const ext = path.extname(file);
    // Страницы, стили и скрипты проверяются при каждом заходе — правки видны сразу; картинки кэшируются
    const cache = ['.html', '.css', '.js'].includes(ext) ? 'no-cache' : 'public, max-age=86400';
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': cache });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`МПС Каталог: http://localhost:${PORT}${PASSWORD ? ' (вход по паролю)' : ''}`);
});
