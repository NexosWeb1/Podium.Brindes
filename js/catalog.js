/* ============================================================
   catalog.js — Catálogo do site (data-driven via store).
   Card: só foto + nome. Clique abre o modal de detalhe.
   Filtro por categoria + paginação de 4 por página.
   ============================================================ */

import { CATEGORIES } from '../data/categories.js';
import { CONFIG } from './config.js';
import { listProducts } from './store.js';
import { openProductModal } from './product-modal.js';

/** Só carrega a imagem se for foto real (evita 404 de placeholders do seed). */
function hasRealImage(product) {
  return (
    product.hasImage ||
    CONFIG.productImagesReady ||
    /^(data:|https?:)/.test(product.image || '')
  );
}

const ALL = { id: 'todos', label: 'Todos' };
const PER_PAGE = 4;

function placeholder(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f0efed"/><stop offset="1" stop-color="#e4e2df"/>
    </linearGradient></defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <path d="M200 120a26 26 0 100 52 26 26 0 000-52zm-70 90c0-24 31-38 70-38s70 14 70 38" fill="none" stroke="#c9c6c2" stroke-width="8" stroke-linecap="round"/>
    <text x="200" y="255" font-family="system-ui,sans-serif" font-size="17" fill="#8a857f" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function chevron(dir) {
  const d = dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${d}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export async function initCatalog({ onQuote, onRender, scrollTo, pause, resume } = {}) {
  const grid = document.getElementById('catalog-grid');
  const bar = document.getElementById('catalog-filters');
  const tpl = document.getElementById('product-card-tpl');
  const empty = document.getElementById('catalog-empty');
  const pager = document.getElementById('catalog-pager');
  if (!grid || !bar || !tpl) return null;

  let products = [];
  try {
    products = await listProducts();
  } catch (e) {
    console.error('Falha ao carregar catálogo:', e);
    products = [];
  }

  let activeCat = 'todos';
  let page = 1;

  function filtered() {
    return activeCat === 'todos'
      ? products
      : products.filter((p) => p.category === activeCat);
  }

  function createCard(product, index) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.productId = product.id;
    node.style.setProperty('--i', index);

    const img = node.querySelector('.product-card__media img');
    img.alt = product.imageAlt || product.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 400;
    img.height = 300;
    if (hasRealImage(product)) {
      img.src = product.image;
      img.addEventListener('error', () => (img.src = placeholder(product.name)), { once: true });
    } else {
      img.src = placeholder(product.name);
    }

    node.querySelector('.product-card__cat').textContent = categoryLabel(product.category);
    node.querySelector('.product-card__title').textContent = product.name;
    node.setAttribute('aria-label', `Ver detalhes de ${product.name}`);

    node.addEventListener('click', () =>
      openProductModal(product, {
        onQuote,
        categoryLabel: categoryLabel(product.category),
        pause,
        resume,
      })
    );
    return node;
  }

  function renderPager(pages) {
    if (!pager) return;
    pager.innerHTML = '';
    if (pages <= 1) {
      pager.hidden = true;
      return;
    }
    pager.hidden = false;

    const mk = (html, goto, { disabled = false, current = false, aria } = {}) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pager__btn' + (current ? ' is-current' : '');
      b.innerHTML = html;
      if (disabled) b.disabled = true;
      if (current) b.setAttribute('aria-current', 'page');
      if (aria) b.setAttribute('aria-label', aria);
      if (!disabled && !current) {
        b.addEventListener('click', () => {
          page = goto;
          render();
          if (scrollTo) scrollTo('#catalogo', { offset: -70 });
        });
      }
      return b;
    };

    pager.appendChild(mk(chevron('left'), page - 1, { disabled: page === 1, aria: 'Página anterior' }));
    for (let i = 1; i <= pages; i += 1) {
      pager.appendChild(mk(String(i), i, { current: i === page, aria: `Página ${i}` }));
    }
    pager.appendChild(
      mk(chevron('right'), page + 1, { disabled: page === pages, aria: 'Próxima página' })
    );
  }

  function render() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (page > pages) page = pages;
    const slice = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    grid.innerHTML = '';
    slice.forEach((p, i) => grid.appendChild(createCard(p, i)));
    if (empty) empty.hidden = list.length > 0;
    renderPager(pages);
    if (onRender) onRender();
  }

  function buildFilters() {
    const items = [ALL, ...CATEGORIES];
    const frag = document.createDocumentFragment();
    items.forEach((cat, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = cat.label;
      btn.dataset.filter = cat.id;
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => {
        bar
          .querySelectorAll('.chip')
          .forEach((c) => c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'));
        activeCat = cat.id;
        page = 1;
        render();
      });
      frag.appendChild(btn);
    });
    bar.appendChild(frag);
  }

  buildFilters();
  render();

  return {
    reload: async () => {
      products = await listProducts();
      page = 1;
      render();
    },
  };
}
