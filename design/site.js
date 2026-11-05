// Общие блоки всех страниц: шапка, мега-меню, выбор города, подвал.
// Подключается до скрипта страницы: <div data-site="header"></div> … <div data-site="footer"></div>

const CITIES = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Новосибирск', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара',
  'Ростов-на-Дону', 'Краснодар', 'Пермь', 'Уфа', 'Воронеж', 'Волгоград', 'Красноярск', 'Тюмень', 'Оренбург', 'Минеральные Воды'];

// Строка навигации под шапкой: самые частые группы каталога + сервисы
const NAV = [
  ['Шпунт', 'catalog.html#pile'], ['Трубы', 'catalog.html#pipe'], ['Сортовой прокат', 'catalog.html#long'],
  ['Листовой прокат', 'catalog.html#flat'], ['Арматура', 'catalog.html#rebar'], ['Б/у', 'catalog.html#used'],
];
const NAV_SERVICE = [['Поставщики', 'suppliers.html'], ['Услуги', 'services.html'], ['Калькулятор', '#'], ['ГОСТы', '#']];
const catHref = (n, g) => LINKS[n] || `catalog.html#${g.id}`;
const groupIcon = k => `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">${ICONS[k]}</svg>`;

function megaMenu() {
  const total = new Set(GROUPS.flatMap(g => g.items)).size;
  return `
  <nav class="mega" id="mega" aria-label="Каталог">
    <div class="container">
      <div class="mega-top">
        <a class="mega-all" href="catalog.html">Весь каталог · ${total} категорий <span aria-hidden="true">→</span></a>
        <span class="mega-popular">Часто ищут: <a href="category.html">Шпунт Ларсена</a> <a href="l5-um.html">Л5-УМ</a> <a href="catalog.html#pipe">Трубы</a> <a href="catalog.html#rebar">Арматура А500С</a></span>
      </div>
      <div class="mega-body">
        <ul class="mega-groups" role="tablist" aria-orientation="vertical">
          ${GROUPS.map((g, i) => `<li><button type="button" role="tab" data-group="${g.id}" aria-selected="${i === 0}">
            <span class="mega-ico">${groupIcon(g.icon)}</span><span>${g.name}</span><small>${g.items.length}</small></button></li>`).join('')}
        </ul>
        <div class="mega-panels">
          ${GROUPS.map((g, i) => `<div class="mega-panel" role="tabpanel" data-panel="${g.id}"${i ? ' hidden' : ''}>
            <div class="mega-panel-head"><h4>${g.name}</h4><a href="catalog.html#${g.id}">Все ${g.items.length} категорий группы →</a></div>
            <ul>${g.items.map(n => `<li><a href="${catHref(n, g)}"${(g.hot || []).includes(n) ? ' class="hot"' : ''}>${n}</a></li>`).join('')}</ul>
          </div>`).join('')}
        </div>
        <div class="mega-mobile">
          ${GROUPS.map(g => `<details><summary><span class="mega-ico">${groupIcon(g.icon)}</span>${g.name}<small>${g.items.length}</small></summary>
            <ul>${g.items.map(n => `<li><a href="${catHref(n, g)}">${n}</a></li>`).join('')}<li><a class="all" href="catalog.html#${g.id}">Все категории группы →</a></li></ul>
          </details>`).join('')}
          <div class="mega-mobile-links">${NAV_SERVICE.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</div>
        </div>
      </div>
    </div>
  </nav>`;
}

const DEMO_NOTE = `<div class="demo-note"><div class="container">Демо-версия для согласования дизайна. Цены и поставщики — тестовые данные. Метка «Проверенный поставщик» показывает, как будет выглядеть платное размещение.</div></div>`;

function siteHeader() {
  const city = (() => { try { return localStorage.getItem('city') || 'Москва'; } catch { return 'Москва'; } })();
  const page = location.pathname.split('/').pop() || 'index.html';
  return `${DEMO_NOTE}
<div class="topbar">
  <div class="container">
    <div class="city">
      <button class="city-btn" type="button" id="cityBtn" aria-expanded="false" aria-controls="cityList">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
        <span id="cityName">${city}</span>
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
      </button>
      <div class="city-list" id="cityList" hidden>
        ${CITIES.map(c => `<button type="button" data-city="${c}"${c === city ? ' aria-current="true"' : ''}>${c}</button>`).join('')}
      </div>
    </div>
    <span class="hide-sm">Цены поставщиков обновляются ежедневно</span>
    <span class="spacer"></span>
    <a href="#">Поставщикам</a>
    <a href="#" class="hide-sm">Реклама на сайте</a>
    <a href="#" class="hide-sm">Контакты</a>
  </div>
</div>
<header class="header">
  <div class="container">
    <a class="brand" href="index.html" aria-label="МПС Каталог — на главную">
      <img src="assets/logo-mps-small.png" alt="">
      <span class="brand-text"><b>МПС Каталог</b><small>металлопрокат по ценам поставщиков</small></span>
    </a>
    <button class="btn btn-primary" type="button" id="megaBtn" aria-expanded="false" aria-controls="mega">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
      <span class="hide-md">Каталог</span>
    </button>
    <form class="search" action="search.html" role="search">
      <label class="sr-only" for="q">Поиск по каталогу</label>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
      <input class="input" id="q" name="q" type="search" placeholder="Шпунт Л5-УМ, труба 57×3, уголок 50…">
    </form>
    <div class="header-actions">
      <button class="icon-btn" type="button" id="reqBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4h8l1 3h3v13H4V7h3z"/><path d="M9 12h6M9 16h4"/></svg>
        <span class="label">Запрос</span><span class="count" id="reqCount">0</span>
      </button>
      <a class="btn btn-outline hide-lg" href="#">Разместить прайс</a>
    </div>
  </div>
  <nav class="navbar" aria-label="Разделы">
    <div class="container">
      ${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}
      <span class="navbar-sep" aria-hidden="true"></span>
      ${NAV_SERVICE.map(([t, h]) => `<a href="${h}"${page === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
    </div>
  </nav>
  ${megaMenu()}
</header>`;
}

function siteFooter() {
  return `
<footer class="footer">
  <div class="container footer-grid">
    <div><img src="assets/logo-mps-small.png" alt="МПС" style="height:56px;filter:brightness(1.6)"><p style="margin:14px 0 0;max-width:26ch">Каталог металлопроката с ценами поставщиков по всей России.</p></div>
    <div><h5>Каталог</h5><ul><li><a href="category.html">Шпунт</a></li><li><a href="catalog.html">Трубы</a></li><li><a href="catalog.html">Сортовой прокат</a></li><li><a href="catalog.html">Листовой прокат</a></li></ul></div>
    <div><h5>Сервисы</h5><ul><li><a href="suppliers.html">Поставщики</a></li><li><a href="services.html">Услуги</a></li><li><a href="#">Калькулятор</a></li><li><a href="#">ГОСТы и ТУ</a></li></ul></div>
    <div><h5>Поставщикам</h5><ul><li><a href="#">Разместить прайс</a></li><li><a href="#">Реклама на сайте</a></li><li><a href="#">Платное размещение</a></li></ul></div>
    <div><h5>Контакты</h5><ul><li>+7 (800) 000-00-00</li><li>info@mps-catalog.ru</li></ul></div>
  </div>
  <div class="container footer-bottom">
    <span>© 2026 МПС Каталог · демо-версия</span><a href="#">Политика конфиденциальности</a>
  </div>
</footer>`;
}

if (!document.querySelector('link[rel="icon"]')) document.head.insertAdjacentHTML('beforeend', '<link rel="icon" type="image/png" href="assets/logo-mps-small.png">');
document.querySelectorAll('[data-site="header"]').forEach(el => { el.outerHTML = siteHeader(); });
document.querySelectorAll('[data-site="footer"]').forEach(el => { el.outerHTML = siteFooter(); });

(() => {
  const megaBtn = document.getElementById('megaBtn');
  const toggleMega = open => {
    document.getElementById('mega').classList.toggle('open', open);
    megaBtn.setAttribute('aria-expanded', String(open));
  };
  megaBtn.onclick = () => toggleMega(megaBtn.getAttribute('aria-expanded') !== 'true');
  document.addEventListener('click', e => { if (!e.target.closest('#mega, #megaBtn')) toggleMega(false); });
  document.getElementById('mega').addEventListener('click', e => { if (e.target.closest('a')) toggleMega(false); });

  // Две панели: группа слева переключается наведением, фокусом или нажатием
  const tabs = [...document.querySelectorAll('.mega-groups [data-group]')];
  const selectGroup = id => {
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.group === id)));
    document.querySelectorAll('.mega-panel').forEach(p => { p.hidden = p.dataset.panel !== id; });
  };
  tabs.forEach(t => {
    t.addEventListener('mouseenter', () => selectGroup(t.dataset.group));
    t.addEventListener('focus', () => selectGroup(t.dataset.group));
    t.addEventListener('click', () => selectGroup(t.dataset.group));
  });

  const cityBtn = document.getElementById('cityBtn'), cityList = document.getElementById('cityList');
  cityBtn.onclick = () => { cityList.hidden = !cityList.hidden; cityBtn.setAttribute('aria-expanded', String(!cityList.hidden)); };
  cityList.onclick = e => {
    const c = e.target.dataset.city; if (!c) return;
    document.getElementById('cityName').textContent = c;
    try { localStorage.setItem('city', c); } catch {}
    cityList.querySelectorAll('button').forEach(b => b.toggleAttribute('aria-current', b.dataset.city === c));
    cityList.hidden = true; cityBtn.setAttribute('aria-expanded', 'false');
  };
  document.addEventListener('click', e => {
    if (!e.target.closest('.city')) { cityList.hidden = true; cityBtn.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { toggleMega(false); cityList.hidden = true; } });

  // Подставить текущий запрос в поле поиска на странице результатов
  const q = new URLSearchParams(location.search).get('q');
  if (q) document.getElementById('q').value = q;
})();

// ---------- Поиск ----------
// Нормализация: регистр, ё→е, кириллица и латиница с одинаковым начертанием сводятся к одной форме,
// пробелы, дефисы и скобки убираются — «сшк 20-600», «CШК(20600)» и «сшк20600» совпадают.
const LOOKALIKE = { а: 'a', в: 'b', е: 'e', к: 'k', м: 'm', н: 'h', о: 'o', р: 'p', с: 'c', т: 't', у: 'y', х: 'x' };
const norm = s => s.toLowerCase().replace(/ё/g, 'е').replace(/[авекмнорстух]/g, ch => LOOKALIKE[ch]).replace(/[^a-zа-я0-9]/g, '');
const EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`", RU = 'йцукенгшщзхъфывапролджэячсмитьбюё';
const fixLayout = s => [...s.toLowerCase()].map(ch => { const i = EN.indexOf(ch); return i >= 0 ? RU[i] : ch; }).join('');

const SEARCH_INDEX = (() => {
  if (typeof GROUPS === 'undefined') return [];
  const idx = [];
  NAMES.forEach(n => idx.push({ type: 'size', name: n, sub: 'Шпунт Ларсена', href: n === 'Л5-УМ' ? 'l5-um.html' : '#', offers: OFFERS[n]?.[0] ?? 0, price: OFFERS[n]?.[1] ?? null }));
  GROUPS.forEach(g => g.items.forEach(n => idx.push({ type: 'cat', name: n, sub: g.name, href: LINKS[n] || 'catalog.html', icon: g.icon, hot: (g.hot || []).includes(n) })));
  SUPPLIERS.forEach(s => idx.push({ type: 'sup', name: s.name, sub: `${s.city} · ${s.profiles.length} профилей шпунта`, href: `supplier.html#${s.id}`, featured: s.featured }));
  SERVICES.forEach(n => idx.push({ type: 'srv', name: n, sub: 'Услуги', href: 'services.html' }));
  idx.forEach(i => { i.nName = norm(i.name); i.nAll = norm(i.name + ' ' + i.sub); });
  return idx;
})();

function searchCatalog(query) {
  const run = q => {
    const tokens = q.split(/\s+/).map(norm).filter(Boolean);
    if (!tokens.length) return [];
    const nq = tokens.join('');
    return SEARCH_INDEX.map(i => {
      if (!tokens.every(t => i.nAll.includes(t))) return null;
      let score = { cat: 30, size: 20, sup: 15, srv: 10 }[i.type];
      if (i.nName === nq) score += 100;
      else if (i.nName.startsWith(nq)) score += 60;
      else if (tokens.every(t => i.nName.includes(t))) score += 30;
      if (i.price) score += 5;
      if (i.hot) score += 10;
      return { ...i, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ru', { numeric: true }));
  };
  let results = run(query), fixed = null;
  if (!results.length && /[a-z]/i.test(query)) {
    const alt = fixLayout(query), altResults = run(alt);
    if (altResults.length) { results = altResults; fixed = alt; }
  }
  return { results, fixed };
}

const TYPE_LABEL = { size: 'Типоразмер', cat: 'Категория', sup: 'Поставщик', srv: 'Услуга' };

(() => {
  const input = document.getElementById('q'), form = input.closest('form');
  const box = document.createElement('div');
  box.className = 'suggest'; box.hidden = true; box.setAttribute('role', 'listbox'); box.id = 'suggest';
  form.append(box);
  input.setAttribute('autocomplete', 'off'); input.setAttribute('aria-controls', 'suggest');
  let active = -1, items = [];

  const remember = q => { try { sessionStorage.setItem('q', q); } catch {} };
  const show = () => {
    const q = input.value.trim();
    if (q.length < 2) { box.hidden = true; return; }
    const { results, fixed } = searchCatalog(q);
    items = results.slice(0, 7); active = -1;
    box.innerHTML = (fixed ? `<div class="suggest-note">Показываем результаты для «${fixed}»</div>` : '') +
      (items.length ? items.map((i, n) => `<a role="option" href="${i.href}" data-n="${n}"><span><b>${i.name}</b><small>${i.sub}</small></span>${i.price ? `<em class="num">от ${i.price.toLocaleString('ru-RU')} ₽</em>` : `<i>${TYPE_LABEL[i.type]}</i>`}</a>`).join('') : '<div class="suggest-note">Ничего не нашли — нажмите Enter, чтобы искать везде</div>') +
      `<button type="submit" class="suggest-all">Все результаты по «${fixed || q}» →</button>`;
    box.hidden = false;
  };
  input.addEventListener('input', show);
  input.addEventListener('focus', show);
  input.addEventListener('keydown', e => {
    const links = [...box.querySelectorAll('a')];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!links.length) return;
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((l, n) => l.classList.toggle('active', n === active));
    } else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); links[active].click(); }
    else if (e.key === 'Escape') box.hidden = true;
  });
  form.addEventListener('submit', () => remember(input.value.trim()));
  box.addEventListener('click', e => { if (e.target.closest('a')) remember(input.value.trim()); });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) box.hidden = true; });
})();

// Ссылки вида search.html?q=… и формы поиска на страницах запоминают запрос:
// в опубликованном демо параметры адреса до страницы не доходят.
document.addEventListener('click', e => {
  const a = e.target.closest('a[href*="search.html?q="]');
  if (a) try { sessionStorage.setItem('q', new URL(a.href).searchParams.get('q')); } catch {}
});
document.addEventListener('submit', e => {
  const input = e.target.querySelector('input[name="q"]');
  if (input) try { sessionStorage.setItem('q', input.value.trim()); } catch {}
});

// ---------- Контакты поставщиков ----------
// На сайте это настройка админки («показывать контакты»). В демо её можно переключить,
// чтобы показать заказчику оба состояния; выбор запоминается в браузере.
const contactsVisible = () => { try { return localStorage.getItem('showContacts') === '1'; } catch { return false; } };
const supplierByName = name => SUPPLIERS.find(s => s.name === name);
const initials = name => name.replace(/[«»"]/g, '').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

// Переключатель для демо: <div data-contacts-toggle></div>; onChange перерисовывает страницу
function mountContactsToggle(onChange) {
  document.querySelectorAll('[data-contacts-toggle]').forEach(el => {
    const draw = () => {
      const on = contactsVisible();
      el.innerHTML = `<span class="demo-toggle"><span>Демо: контакты поставщиков</span>
        <span class="seg"><button type="button" data-v="0" aria-pressed="${!on}">Скрыты</button><button type="button" data-v="1" aria-pressed="${on}">Открыты</button></span></span>`;
      el.querySelectorAll('button').forEach(b => b.onclick = () => {
        try { localStorage.setItem('showContacts', b.dataset.v); } catch {}
        draw(); onChange && onChange();
      });
    };
    draw();
  });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href*="supplier.html#"]');
  if (a) try { sessionStorage.setItem('supplier', a.getAttribute('href').split('#')[1]); } catch {}
});
