/* ============================================================
   form.js — Formulário de orçamento -> WhatsApp (wa.me)
   Selects dependentes (Produto filtrado pela Categoria).
   ============================================================ */

import { CATEGORIES } from '../data/categories.js';
import { listProducts } from './store.js';
import { CONFIG, waLink } from './config.js';

let PRODUCTS = [];

/** Hook para futura integração (analytics/backend). No-op por padrão. */
export function onQuoteSubmitted(payload) {
  // Substituir por chamada a backend/analytics quando existir.
  // console.debug('quote', payload);
}

function fillCategories(select) {
  const frag = document.createDocumentFragment();
  const none = new Option('Selecione uma categoria', '');
  none.disabled = true;
  none.selected = true;
  frag.appendChild(none);
  CATEGORIES.forEach((c) => frag.appendChild(new Option(c.label, c.id)));
  select.appendChild(frag);
}

function fillProducts(select, categoryId) {
  select.innerHTML = '';
  const frag = document.createDocumentFragment();
  const list = PRODUCTS.filter((p) => !categoryId || p.category === categoryId);
  const first = new Option(categoryId ? 'Selecione um produto' : 'Escolha a categoria antes', '');
  first.disabled = !categoryId ? true : false;
  first.selected = true;
  frag.appendChild(first);
  list.forEach((p) => frag.appendChild(new Option(p.name, p.id)));
  frag.appendChild(new Option('Outro / Não sei ainda', 'outro'));
  select.appendChild(frag);
  select.disabled = !categoryId;
}

function buildMessage(data) {
  const vazio = 'Não informado';
  const catLabel = CATEGORIES.find((c) => c.id === data.categoria)?.label || vazio;
  const prodLabel =
    data.produto === 'outro'
      ? 'Outro / a definir'
      : PRODUCTS.find((p) => p.id === data.produto)?.name || vazio;

  return [
    `*Solicitação de Orçamento | ${CONFIG.brand}*`,
    '',
    `*Nome:* ${data.nome}`,
    `*Empresa:* ${data.empresa || vazio}`,
    `*WhatsApp:* ${data.whatsapp}`,
    `*Categoria:* ${catLabel}`,
    `*Produto:* ${prodLabel}`,
    `*Quantidade estimada:* ${data.quantidade || vazio}`,
    '',
    `*Mensagem:*`,
    data.mensagem || vazio,
  ].join('\n');
}

export async function initForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  try {
    PRODUCTS = await listProducts();
  } catch (e) {
    PRODUCTS = [];
  }

  const catSelect = form.elements.categoria;
  const prodSelect = form.elements.produto;
  const fallback = document.getElementById('form-fallback');
  const fallbackLink = document.getElementById('form-fallback-link');

  fillCategories(catSelect);
  fillProducts(prodSelect, '');

  catSelect.addEventListener('change', () => {
    fillProducts(prodSelect, catSelect.value);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    const message = buildMessage(data);
    const url = waLink(message);

    onQuoteSubmitted({ ...data, message });

    // Abre o WhatsApp; se o popup for bloqueado, mostra link de fallback.
    const win = window.open(url, '_blank', 'noopener');
    if (fallback && fallbackLink) {
      fallbackLink.href = url;
      if (!win || win.closed || typeof win.closed === 'undefined') {
        fallback.hidden = false;
      }
    }
  });

  /** Pré-seleciona categoria+produto (usado pelo clique no card). */
  function prefill(product) {
    if (!product) return;
    catSelect.value = product.category;
    fillProducts(prodSelect, product.category);
    prodSelect.value = product.id;
  }

  return { prefill };
}
