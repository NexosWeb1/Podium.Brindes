/* ============================================================
   product-modal.js — Card flutuante (mini página) do produto.
   openProductModal(product, { onQuote, pause, resume })
   ============================================================ */

let root = null;
let lastFocus = null;
let hooks = {};

function buildRoot() {
  root = document.createElement('div');
  root.className = 'pmodal';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="pmodal__backdrop" data-close></div>
    <div class="pmodal__dialog" role="dialog" aria-modal="true" aria-labelledby="pmodal-title">
      <button class="pmodal__close" type="button" aria-label="Fechar" data-close>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>
      </button>
      <div class="pmodal__media">
        <img id="pmodal-img" src="" alt="" />
        <span class="pmodal__cat" id="pmodal-cat"></span>
      </div>
      <div class="pmodal__body">
        <h3 class="pmodal__title" id="pmodal-title"></h3>
        <p class="pmodal__desc" id="pmodal-desc"></p>
        <dl class="pmodal__specs" id="pmodal-specs"></dl>
        <button class="btn btn--gold btn--lg pmodal__cta" id="pmodal-cta" type="button">
          Solicitar Orçamento
        </button>
      </div>
    </div>`;
  document.body.appendChild(root);

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!root.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') trapTab(e);
  });
}

function trapTab(e) {
  const focusables = root.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function placeholder(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="600" height="450" fill="#f0efed"/>
    <text x="300" y="230" font-family="system-ui,sans-serif" font-size="22" fill="#8a857f" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function renderSpecs(specs) {
  const dl = root.querySelector('#pmodal-specs');
  dl.innerHTML = '';
  if (!specs || typeof specs !== 'object') {
    dl.hidden = true;
    return;
  }
  const labels = {
    conteudo: 'Conteúdo',
    estojo: 'Estojo',
    altura: 'Altura',
    largura: 'Largura',
    gravacao: 'Áreas de gravação',
    peso: 'Peso aproximado',
  };
  const entries = Object.entries(specs).filter(([, v]) => v);
  if (!entries.length) {
    dl.hidden = true;
    return;
  }
  dl.hidden = false;
  entries.forEach(([k, v]) => {
    const dt = document.createElement('dt');
    dt.textContent = labels[k] || k;
    const dd = document.createElement('dd');
    dd.textContent = v;
    dl.append(dt, dd);
  });
}

export function openProductModal(product, options = {}) {
  hooks = options;
  if (!root) buildRoot();

  const img = root.querySelector('#pmodal-img');
  const realImage = /^(data:|https?:)/.test(product.image || '') || product.hasImage;
  img.alt = product.imageAlt || product.name;
  if (realImage && product.image) {
    img.src = product.image;
    img.onerror = () => {
      img.onerror = null;
      img.src = placeholder(product.name);
    };
  } else {
    img.src = placeholder(product.name);
  }

  root.querySelector('#pmodal-cat').textContent = options.categoryLabel || '';
  root.querySelector('#pmodal-title').textContent = product.name;
  root.querySelector('#pmodal-desc').textContent =
    product.description || 'Produto personalizável. Solicite um orçamento.';
  renderSpecs(product.specs);

  const cta = root.querySelector('#pmodal-cta');
  cta.onclick = () => {
    close();
    hooks.onQuote?.(product);
  };

  lastFocus = document.activeElement;
  root.setAttribute('aria-hidden', 'false');
  root.classList.add('open');
  document.body.classList.add('no-scroll');
  hooks.pause?.();
  requestAnimationFrame(() => root.querySelector('.pmodal__close').focus());
}

export function close() {
  if (!root) return;
  root.classList.remove('open');
  root.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  hooks.resume?.();
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
