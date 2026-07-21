/* ============================================================
   config.js — Dados de negócio e ajustes globais.
   TROCAR CONTATO/WHATSAPP AQUI (fonte única).
   ============================================================ */

export const CONFIG = {
  brand: 'Podium Brindes',

  // WhatsApp em formato E.164 (só dígitos, com DDI 55). Placeholder.
  // TODO cliente: confirmar se este número tem WhatsApp.
  whatsapp: '553537433647',
  phoneDisplay: '(35) 3743-3647',

  email: 'vendas@podiumbrindes.com.br',
  emailAlt: 'contato@podiumbrindes.com.br',

  instagram: 'https://www.instagram.com/podium_brindes/',

  address: {
    street: 'Rua Cândido Ribeiro da Silva, 148B',
    district: 'Nova Campestre',
    city: 'Campestre',
    state: 'MG',
    cep: '37730-000',
  },

  hours: [
    { days: 'Segunda a sexta', time: '07h às 18h' },
    { days: 'Sábado', time: '08h às 12h' },
    { days: 'Domingo', time: 'Fechado' },
  ],

  // Mensagem base para CTAs simples (hero/nav) que abrem o WhatsApp.
  quickMessage: 'Olá! Vim pelo site e gostaria de solicitar um orçamento de brindes personalizados.',

  // Quando o cliente entregar as FOTOS REAIS dos produtos (em assets/img/products/...),
  // trocar para `true`. Enquanto `false`, o catálogo mostra placeholders sem tentar
  // carregar as imagens (evita 404 no console).
  productImagesReady: false,
};

/**
 * Monta um link wa.me com mensagem pré-preenchida.
 * @param {string} message Texto (com quebras de linha reais).
 * @returns {string}
 */
export function waLink(message = CONFIG.quickMessage) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}
