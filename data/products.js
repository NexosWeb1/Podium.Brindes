/* ============================================================
   products.js — Produtos-semente (referência / fallback local).
   Em produção o catálogo vem do Supabase (nuvem). Esta lista é
   usada só no modo local e como base do INSERT inicial.
   Adicione produtos reais pelo painel (admin.html).
   Campos: { id, category, name, description, image, imageAlt, hasImage?, featured?, colors?, specs? }
   ============================================================ */

const IMG = 'assets/img/products';

export const PRODUCTS = [
  {
    id: 'kit-executivo-3-pecas',
    category: 'kits-executivos',
    name: 'Kit Executivo 3 Peças',
    description:
      'Chaveiro de metal fosco, porta-cartão de couro sintético e caneta de metal fosco em estojo com placa para gravação.',
    image: `${IMG}/kits-executivos/kit-executivo-3-pecas.jpg`,
    imageAlt: 'Kit executivo 3 peças: chaveiro, porta-cartão e caneta em estojo preto',
    hasImage: true,
    featured: true,
    specs: {
      conteudo:
        'Chaveiro metal fosco com detalhe emborrachado preto, porta-cartão de couro sintético (verso metálico liso) com placa de metal e caneta metal fosca com detalhe emborrachado preto. Acompanha placa metálica para gravação.',
      estojo: 'Estojo de papelão com tampa e interior revestido de espuma',
      altura: '14,1 cm',
      largura: '20,1 cm',
      gravacao:
        'Placa 5,8 x 1,9 cm · Estojo 13 x 19,5 cm · Chaveiro 4,8 x 1,1 cm · Porta-cartão 1,9 x 4,3 cm · Caneta 4 x 1 cm',
      peso: '224 g',
    },
  },
];
