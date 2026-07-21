/* ============================================================
   main.js — Entry point. Orquestra os módulos.
   ============================================================ */

import { CONFIG, waLink } from './config.js';
import { CATEGORIES } from '../data/categories.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initNav } from './nav.js';
import { initCatalog } from './catalog.js';
import { initForm } from './form.js';
import { initAnimations } from './animations.js';

function buildMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  const labels = [...CATEGORIES.map((c) => c.label), 'Personalização exclusiva', 'Qualidade premium'];
  // Duplicado para loop contínuo (a animação translada -50%)
  const html = [...labels, ...labels]
    .map((l) => `<span class="marquee__item">${l}</span>`)
    .join('');
  track.innerHTML = html;
}

function hydrateContactLinks() {
  // Todos os CTAs simples de WhatsApp
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink();
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Telefone / e-mail / endereço no rodapé
  const set = (id, text, href) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    if (href && el.tagName === 'A') el.href = href;
  };

  const a = CONFIG.address;
  set('contact-phone', CONFIG.phoneDisplay, `tel:+${CONFIG.whatsapp}`);
  set('contact-email', CONFIG.email, `mailto:${CONFIG.email}`);
  set(
    'contact-address',
    `${a.street}, ${a.district}, ${a.city}-${a.state}, ${a.cep}`
  );

  // Instagram (esconde se não houver handle)
  const ig = document.getElementById('social-instagram');
  if (ig) {
    if (CONFIG.instagram) ig.href = CONFIG.instagram;
    else ig.hidden = true;
  }

  // Horários
  const hoursList = document.getElementById('footer-hours');
  if (hoursList) {
    hoursList.innerHTML = '';
    CONFIG.hours.forEach((h) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${h.days}</span> <strong>${h.time}</strong>`;
      hoursList.appendChild(li);
    });
  }
}

function main() {
  hydrateContactLinks();
  buildMarquee();

  const scroll = initSmoothScroll();
  const anim = initAnimations();

  initNav({
    scrollTo: scroll.scrollTo,
    pause: scroll.pause,
    resume: scroll.resume,
  });

  const form = initForm();

  initCatalog({
    onQuote: (product) => {
      form?.prefill?.(product);
      scroll.scrollTo('#orcamento', { offset: -72 });
    },
    onRender: () => anim.refresh?.(),
  });

  // Recalcula ScrollTrigger após fontes carregarem (evita desalinhamento)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => anim.refresh?.());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
