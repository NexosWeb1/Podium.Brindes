/* ============================================================
   catalog.js — Render + filtro do catálogo (data-driven)
   ============================================================ */

import { CATEGORIES } from '../data/categories.js';
import { PRODUCTS } from '../data/products.js';
import { CONFIG } from './config.js';

const ALL = { id: 'todos', label: 'Todos' };

let onQuoteRequest = null; // callback injetado por main.js (card -> form)

/** Gera um placeholder SVG (data URI) quando a foto real não existe. */
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

/** Cria um card a partir do <template> (markup fora de strings JS). */
function createCard(product, tpl) {
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.dataset.category = product.category;
  node.dataset.productId = product.id;

  const img = node.querySelector('.product-card__media img');
  img.alt = product.imageAlt || product.name;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 400;
  img.height = 300;
  // Guarda o caminho real para troca fácil quando as fotos chegarem.
  img.dataset.realSrc = product.image;
  // Carrega a foto real se o global estiver ligado OU se o produto já tem foto.
  if (CONFIG.productImagesReady || product.hasImage) {
    img.src = product.image;
    img.addEventListener('error', () => (img.src = placeholder(product.name)), { once: true });
  } else {
    // Sem foto real ainda: mostra placeholder direto (sem 404).
    img.src = placeholder(product.name);
  }

  node.querySelector('.product-card__cat').textContent = categoryLabel(product.category);
  node.querySelector('.product-card__title').textContent = product.name;
  node.querySelector('.product-card__desc').textContent = product.description;

  const cta = node.querySelector('.product-card__cta button');
  cta.setAttribute(
    'aria-label',
    `Solicitar orçamento de ${product.name}`
  );
  cta.addEventListener('click', () => {
    if (onQuoteRequest) onQuoteRequest(product);
  });

  return node;
}

/** Constrói a barra de filtros (grupo de botões aria-pressed). */
function buildFilters(bar, onSelect) {
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
      onSelect(cat.id);
    });
    frag.appendChild(btn);
  });

  bar.appendChild(frag);
}

/**
 * Inicializa o catálogo.
 * @param {object} opts
 * @param {(product:object)=>void} opts.onQuote  chamado ao clicar em "Solicitar orçamento" num card.
 * @param {()=>void} [opts.onRender] chamado após render/filtro (ex.: ScrollTrigger.refresh).
 * @param {(els:Element[])=>void} [opts.reveal] registra a animação de entrada dos cards.
 */
export function initCatalog({ onQuote, onRender, reveal } = {}) {
  const grid = document.getElementById('catalog-grid');
  const bar = document.getElementById('catalog-filters');
  const tpl = document.getElementById('product-card-tpl');
  const empty = document.getElementById('catalog-empty');
  if (!grid || !bar || !tpl) return;

  onQuoteRequest = onQuote || null;

  // Render inicial de todos os cards (mantidos no DOM; filtro só oculta).
  const frag = document.createDocumentFragment();
  PRODUCTS.forEach((p) => frag.appendChild(createCard(p, tpl)));
  grid.appendChild(frag);

  const cards = [...grid.querySelectorAll('.product-card')];
  // Registra a animação de entrada agora que os cards existem no DOM.
  if (reveal) reveal(cards);
  let firstRender = true;

  function applyFilter(catId) {
    let visible = 0;
    cards.forEach((card) => {
      const show = catId === 'todos' || card.dataset.category === catId;
      card.classList.toggle('is-hidden', !show);
      if (show) {
        visible += 1;
        // Ao trocar de filtro, garante que o card apareca mesmo que a
        // animacao de reveal (ScrollTrigger) ainda nao tenha disparado.
        if (!firstRender) card.classList.add('is-revealed');
      }
    });
    if (empty) empty.hidden = visible > 0;
    if (onRender) onRender();
    firstRender = false;
  }

  buildFilters(bar, applyFilter);
  applyFilter('todos');

  return { applyFilter };
}
