/* ============================================================
   admin.js — Painel de manutenção do catálogo.
   Login, listar, adicionar, editar, excluir, filtrar, upload.
   Usa o mesmo store do site (Supabase quando configurado; senão local).
   ============================================================ */

import { CATEGORIES } from '../data/categories.js';
import {
  IS_CLOUD,
  listProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  signIn,
  signOut,
  currentUser,
  seedIfEmpty,
} from './store.js';

const $ = (id) => document.getElementById(id);
const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
/** Só é foto real se for URL http/data (evita 404 de placeholders do seed). */
const realImg = (p) => (p.image && /^(data:|https?:)/.test(p.image) ? p.image : '');

let products = [];
let activeFilter = 'todos';
let pendingImage = null; // dataURL da imagem nova anexada
let deleteId = null;

/* ---------------- Login ---------------- */
async function boot() {
  $('login-mode').textContent = IS_CLOUD
    ? 'Conectado ao banco na nuvem (Supabase).'
    : 'Modo local (navegador). Senha padrão: podium';
  $('admin-mode').textContent = IS_CLOUD ? 'Nuvem' : 'Local';

  const user = await currentUser().catch(() => null);
  if (user) return showApp();
  showLogin();
}

function showLogin() {
  $('admin-login').hidden = false;
  $('admin-app').hidden = true;
}

async function showApp() {
  $('admin-login').hidden = true;
  $('admin-app').hidden = false;

  fillCategorySelects();

  if (IS_CLOUD) {
    try {
      const { seeded } = await seedIfEmpty();
      if (seeded) toast(`${seeded} produtos importados para o catálogo.`);
    } catch (e) {
      /* segue mesmo se o seed falhar */
    }
  }

  await reload();
}

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('login-email').value.trim();
  const password = $('login-pass').value;
  const err = $('login-error');
  err.hidden = true;
  $('login-btn').disabled = true;
  try {
    await signIn(email, password);
    await showApp();
  } catch (ex) {
    err.textContent = ex.message || 'Não foi possível entrar.';
    err.hidden = false;
  } finally {
    $('login-btn').disabled = false;
  }
});

$('logout-btn').addEventListener('click', async () => {
  await signOut();
  location.reload();
});

/* ---------------- Selects ---------------- */
function fillCategorySelects() {
  const filter = $('admin-filter');
  const form = $('pf-category');
  filter.length = 1; // mantém "Todas as categorias"
  form.innerHTML = '<option value="" disabled selected>Selecione o nicho</option>';
  CATEGORIES.forEach((c) => {
    filter.appendChild(new Option(c.label, c.id));
    form.appendChild(new Option(c.label, c.id));
  });
}

$('admin-filter').addEventListener('change', (e) => {
  activeFilter = e.target.value;
  renderGrid();
});

/* ---------------- Listagem ---------------- */
async function reload() {
  try {
    products = await listProducts();
  } catch (e) {
    products = [];
    toast('Erro ao carregar produtos.', true);
  }
  renderGrid();
}

function renderGrid() {
  const grid = $('admin-grid');
  const list =
    activeFilter === 'todos' ? products : products.filter((p) => p.category === activeFilter);

  $('admin-count').textContent = `${products.length} produto(s) no catálogo`;
  grid.innerHTML = '';
  $('admin-empty').hidden = list.length > 0;

  list.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'admin-card';
    const src = realImg(p);
    const img = src
      ? `<img src="${src}" alt="" loading="lazy" />`
      : `<div class="admin-card__noimg">Sem imagem</div>`;
    card.innerHTML = `
      <div class="admin-card__media">${img}${p.featured ? '<span class="admin-card__star">Destaque</span>' : ''}</div>
      <div class="admin-card__body">
        <span class="admin-card__cat">${catLabel(p.category)}</span>
        <h3 class="admin-card__name"></h3>
        <p class="admin-card__desc"></p>
      </div>
      <div class="admin-card__actions">
        <button type="button" class="btn btn--outline admin-card__edit">Editar</button>
        <button type="button" class="btn btn--ghost admin-card__del">Excluir</button>
      </div>`;
    card.querySelector('.admin-card__name').textContent = p.name;
    card.querySelector('.admin-card__desc').textContent = p.description || '';
    card.querySelector('.admin-card__edit').addEventListener('click', () => openForm(p));
    card.querySelector('.admin-card__del').addEventListener('click', () => askDelete(p));
    grid.appendChild(card);
  });
}

/* ---------------- Formulário add/editar ---------------- */
function openForm(product) {
  const editing = Boolean(product);
  $('pf-title').textContent = editing ? 'Editar produto' : 'Adicionar produto';
  $('pf-id').value = editing ? product.id : '';
  $('pf-name').value = editing ? product.name : '';
  $('pf-category').value = editing ? product.category : '';
  $('pf-description').value = editing ? product.description || '' : '';
  $('pf-featured').checked = editing ? !!product.featured : false;
  pendingImage = null;
  $('pf-error').hidden = true;

  const preview = $('pf-preview');
  const existing = editing ? realImg(product) : '';
  preview.innerHTML = existing ? `<img src="${existing}" alt="" />` : '<span>Sem imagem</span>';
  preview.dataset.existing = existing;
  $('pf-image-clear').hidden = !existing;

  openModal('product-form-modal');
  setTimeout(() => $('pf-name').focus(), 60);
}

$('add-btn').addEventListener('click', () => openForm(null));
$('pf-image-btn').addEventListener('click', () => $('pf-image').click());

$('pf-image').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    pendingImage = await compressImage(file, 1000, 0.82);
    $('pf-preview').innerHTML = `<img src="${pendingImage}" alt="" />`;
    $('pf-image-clear').hidden = false;
  } catch (ex) {
    toast('Não foi possível ler a imagem.', true);
  }
});

$('pf-image-clear').addEventListener('click', () => {
  pendingImage = '';
  $('pf-preview').innerHTML = '<span>Sem imagem</span>';
  $('pf-preview').dataset.existing = '';
  $('pf-image').value = '';
  $('pf-image-clear').hidden = true;
});

$('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('pf-error');
  err.hidden = true;

  const id = $('pf-id').value;
  const name = $('pf-name').value.trim();
  const category = $('pf-category').value;
  const description = $('pf-description').value.trim();
  const featured = $('pf-featured').checked;

  if (!name || !category) {
    err.textContent = 'Preencha nome e categoria.';
    err.hidden = false;
    return;
  }

  const saveBtn = $('pf-save');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Salvando...';

  try {
    // Resolve a imagem: nova anexada, mantida, ou removida.
    let image;
    if (pendingImage) {
      image = await uploadImage(pendingImage, name);
    } else if (pendingImage === '') {
      image = null; // removida
    } else {
      image = $('pf-preview').dataset.existing || null; // mantém a atual
    }

    const payload = { name, category, description, featured, image };
    if (id) await updateProduct(id, payload);
    else await addProduct(payload);

    closeModal('product-form-modal');
    toast(id ? 'Produto atualizado.' : 'Produto adicionado.');
    await reload();
  } catch (ex) {
    err.textContent = ex.message || 'Erro ao salvar.';
    err.hidden = false;
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar produto';
  }
});

/* ---------------- Exclusão ---------------- */
function askDelete(product) {
  deleteId = product.id;
  $('del-text').innerHTML = `Excluir <strong></strong>? Esta ação não pode ser desfeita.`;
  $('del-text').querySelector('strong').textContent = product.name;
  openModal('delete-modal', 'aria-hidden');
}

$('del-confirm').addEventListener('click', async () => {
  if (!deleteId) return;
  const btn = $('del-confirm');
  btn.disabled = true;
  try {
    await deleteProduct(deleteId);
    closeModal('delete-modal');
    toast('Produto excluído.');
    await reload();
  } catch (ex) {
    toast('Erro ao excluir.', true);
  } finally {
    btn.disabled = false;
    deleteId = null;
  }
});

/* ---------------- Modais utilitários ---------------- */
function openModal(id) {
  const m = $(id);
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}
function closeModal(id) {
  const m = $(id);
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal('product-form-modal');
  if (e.target.closest('[data-close-del]')) closeModal('delete-modal');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('product-form-modal');
    closeModal('delete-modal');
  }
});

/* ---------------- Utilidades ---------------- */
function compressImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

let toastTimer = null;
function toast(msg, isError = false) {
  const t = $('admin-toast');
  t.textContent = msg;
  t.classList.toggle('is-error', isError);
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 3200);
}

boot();
