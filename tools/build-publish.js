// Собирает демо для заказчика из design/ в design/publish/:
// стили и site.js вшиваются в каждую страницу, ссылки на ещё не готовые страницы заменяются на «#».
// Главная (index) публикуется как основная страница артефакта — без doctype/html/head/body,
// остальные — полноценными документами.
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', 'design'), out = path.join(src, 'publish');
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['index.html', 'catalog.html', 'category.html', 'search.html', 'suppliers.html', 'supplier.html', 'services.html', 'l5-um.html'];
const css = fs.readFileSync(path.join(src, 'styles.css'), 'utf8');
const siteJs = fs.readFileSync(path.join(src, 'site.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(src, 'data.js'), 'utf8');
const { BLOCKLIST } = require('./blocklist');
const EXTRA = '.header{top:env(safe-area-inset-top,0px)}body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--c-surface)}' +
  '@media (prefers-reduced-motion:reduce){*{transition:none!important}}';

fs.mkdirSync(out, { recursive: true });
for (const page of pages) {
  let html = fs.readFileSync(path.join(src, page), 'utf8');
  html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n${EXTRA}\n</style>`);
  html = html.replace('<script src="data.js"></script>', `<script>\n${dataJs}\n</script>`);
  html = html.replace('<script src="site.js"></script>', `<script>\n${siteJs}\n</script>`);
  // внутри site.js ссылки собираются из строк — заглушаем и их
  html = html.replace(/(href=["'`])([\w-]+\.html)(?:\?[^"'`]*)?(["'`])/g, (m, a, file, b) => pages.includes(file) ? m : a + '#' + b);
  html = html.replace(/(\?\s*')([\w-]+\.html)(')/g, (m, a, file, b) => pages.includes(file) ? m : a + '#' + b);
  html = html.replace(/(: ')([\w-]+\.html)(')/g, (m, a, file, b) => pages.includes(file) ? m : a + '#' + b);
  // главная в артефакте живёт в корне, а не по пути index.html
  html = html.replace(/href="index\.html"/g, 'href="./"');
  if (page === 'index.html') {
    const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
    const head = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta[^>]*>\s*/g, '').replace(title, '');
    const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
    html = `<title>МПС Каталог</title>\n${head}\n${body}`;
  }
  const hit = BLOCKLIST.find(w => html.toLowerCase().includes(w));
  if (hit) throw new Error(`${page}: найдено запрещённое слово «${hit}»`);
  fs.writeFileSync(path.join(out, page), html);
  console.log('built', page, html.length);
}
