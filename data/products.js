/* ============================================================
   products.js — Catálogo (data-driven, escalável)
   Adicionar produto = 1 objeto. `category` deve casar com
   um `id` de categories.js. `image` aponta para a foto real
   (quando não existir, o card mostra um placeholder gerado).
   Campos: { id, category, name, description, image, imageAlt, featured? }
   ============================================================ */

const IMG = 'assets/img/products';

export const PRODUCTS = [
  /* ---- Canecas ---- */
  {
    id: 'caneca-ceramica',
    category: 'canecas',
    name: 'Caneca de Cerâmica',
    description: 'Cerâmica premium com impressão colorida de alta durabilidade.',
    image: `${IMG}/canecas/caneca-ceramica.webp`,
    imageAlt: 'Caneca de cerâmica personalizada com logo',
    featured: true,
  },
  {
    id: 'caneca-magica',
    category: 'canecas',
    name: 'Caneca Mágica',
    description: 'Revela a arte com o calor da bebida. Efeito surpresa garantido.',
    image: `${IMG}/canecas/caneca-magica.webp`,
    imageAlt: 'Caneca mágica que muda com o calor',
  },
  {
    id: 'caneca-metal',
    category: 'canecas',
    name: 'Caneca de Metal',
    description: 'Inox resistente com acabamento fosco e gravação a laser.',
    image: `${IMG}/canecas/caneca-metal.webp`,
    imageAlt: 'Caneca de metal inox personalizada',
  },

  /* ---- Garrafas ---- */
  {
    id: 'garrafa-termica',
    category: 'garrafas',
    name: 'Garrafa Térmica Inox',
    description: 'Mantém a temperatura por horas. Parede dupla à vácuo.',
    image: `${IMG}/garrafas/garrafa-termica.webp`,
    imageAlt: 'Garrafa térmica de inox personalizada',
    featured: true,
  },
  {
    id: 'squeeze-aluminio',
    category: 'garrafas',
    name: 'Squeeze de Alumínio',
    description: 'Leve e resistente, ideal para academia e eventos.',
    image: `${IMG}/garrafas/squeeze-aluminio.webp`,
    imageAlt: 'Squeeze de alumínio personalizado',
  },
  {
    id: 'garrafa-tritan',
    category: 'garrafas',
    name: 'Garrafa Tritan',
    description: 'Livre de BPA, transparente e ultrarresistente a impactos.',
    image: `${IMG}/garrafas/garrafa-tritan.webp`,
    imageAlt: 'Garrafa de plástico Tritan personalizada',
  },

  /* ---- Copos ---- */
  {
    id: 'copo-termico',
    category: 'copos',
    name: 'Copo Térmico',
    description: 'Parede dupla com tampa. Perfeito para café e drinks.',
    image: `${IMG}/copos/copo-termico.webp`,
    imageAlt: 'Copo térmico personalizado com tampa',
  },
  {
    id: 'copo-long-drink',
    category: 'copos',
    name: 'Copo Long Drink',
    description: 'Clássico para festas e ativações. Cores vibrantes.',
    image: `${IMG}/copos/copo-long-drink.webp`,
    imageAlt: 'Copo long drink personalizado',
  },
  {
    id: 'copo-stanley',
    category: 'copos',
    name: 'Copo Estilo Stanley',
    description: 'Inox com tampa e canudo. Tendência e alto valor percebido.',
    image: `${IMG}/copos/copo-stanley.webp`,
    imageAlt: 'Copo de inox estilo Stanley personalizado',
    featured: true,
  },

  /* ---- Canetas ---- */
  {
    id: 'caneta-metal',
    category: 'canetas',
    name: 'Caneta de Metal',
    description: 'Escrita macia e toque premium com gravação a laser.',
    image: `${IMG}/canetas/caneta-metal.webp`,
    imageAlt: 'Caneta de metal personalizada',
  },
  {
    id: 'caneta-ecologica',
    category: 'canetas',
    name: 'Caneta Ecológica',
    description: 'Feita com materiais reciclados. Sustentável e elegante.',
    image: `${IMG}/canetas/caneta-ecologica.webp`,
    imageAlt: 'Caneta ecológica de material reciclado',
  },
  {
    id: 'caneta-touch',
    category: 'canetas',
    name: 'Caneta Touch',
    description: 'Ponta para telas sensíveis. Funcional no dia a dia.',
    image: `${IMG}/canetas/caneta-touch.webp`,
    imageAlt: 'Caneta touch para telas',
  },

  /* ---- Chaveiros ---- */
  {
    id: 'chaveiro-metal',
    category: 'chaveiros',
    name: 'Chaveiro de Metal',
    description: 'Acabamento sofisticado e gravação em relevo.',
    image: `${IMG}/chaveiros/chaveiro-metal.webp`,
    imageAlt: 'Chaveiro de metal personalizado',
  },
  {
    id: 'chaveiro-couro',
    category: 'chaveiros',
    name: 'Chaveiro de Couro',
    description: 'Couro sintético com costura, toque premium.',
    image: `${IMG}/chaveiros/chaveiro-couro.webp`,
    imageAlt: 'Chaveiro de couro personalizado',
  },
  {
    id: 'chaveiro-led',
    category: 'chaveiros',
    name: 'Chaveiro com LED',
    description: 'Lanterna embutida. Utilidade que mantém a marca por perto.',
    image: `${IMG}/chaveiros/chaveiro-led.webp`,
    imageAlt: 'Chaveiro com lanterna LED',
  },

  /* ---- Kits Executivos ---- */
  {
    id: 'kit-executivo-3-pecas',
    category: 'kits-executivos',
    name: 'Kit Executivo 3 Peças',
    description:
      'Chaveiro de metal fosco, porta-cartão de couro sintético e caneta de metal fosco em estojo com placa para gravação.',
    image: `${IMG}/kits-executivos/kit-executivo-3-pecas.jpg`,
    imageAlt: 'Kit executivo 3 peças: chaveiro, porta-cartão e caneta em estojo preto',
    hasImage: true, // foto real disponível (carrega mesmo com productImagesReady=false)
    featured: true,
    // Especificações (para orçamento/ficha técnica)
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
  {
    id: 'kit-executivo-premium',
    category: 'kits-executivos',
    name: 'Kit Executivo Premium',
    description: 'Caneta, caderno e cartão em estojo elegante.',
    image: `${IMG}/kits-executivos/kit-premium.webp`,
    imageAlt: 'Kit executivo premium em estojo',
  },
  {
    id: 'kit-caderno-caneta',
    category: 'kits-executivos',
    name: 'Kit Caderno + Caneta',
    description: 'Combinação clássica para brindes corporativos de impacto.',
    image: `${IMG}/kits-executivos/kit-caderno-caneta.webp`,
    imageAlt: 'Kit com caderno e caneta personalizados',
  },
  {
    id: 'kit-boas-vindas',
    category: 'kits-executivos',
    name: 'Kit Boas-Vindas',
    description: 'Ideal para onboarding de novos colaboradores.',
    image: `${IMG}/kits-executivos/kit-boas-vindas.webp`,
    imageAlt: 'Kit de boas-vindas para colaboradores',
  },

  /* ---- Kits Faca ---- */
  {
    id: 'kit-churrasco-3',
    category: 'kits-faca',
    name: 'Kit Churrasco 3 Peças',
    description: 'Faca, garfo e chaira em estojo de madeira.',
    image: `${IMG}/kits-faca/kit-churrasco-3.webp`,
    imageAlt: 'Kit churrasco de 3 peças em estojo de madeira',
    featured: true,
  },
  {
    id: 'kit-faca-tabua',
    category: 'kits-faca',
    name: 'Kit Faca + Tábua',
    description: 'Faca profissional acompanhada de tábua para servir.',
    image: `${IMG}/kits-faca/kit-faca-tabua.webp`,
    imageAlt: 'Kit com faca e tábua',
  },
  {
    id: 'kit-queijo',
    category: 'kits-faca',
    name: 'Kit Queijo & Vinho',
    description: 'Utensílios para tábua de frios em conjunto sofisticado.',
    image: `${IMG}/kits-faca/kit-queijo.webp`,
    imageAlt: 'Kit queijo e vinho personalizado',
  },

  /* ---- Abridores ---- */
  {
    id: 'abridor-imã',
    category: 'abridores',
    name: 'Abridor com Imã',
    description: 'Fixa na geladeira. Marca presente todos os dias.',
    image: `${IMG}/abridores/abridor-ima.webp`,
    imageAlt: 'Abridor de garrafa com imã',
  },
  {
    id: 'abridor-madeira',
    category: 'abridores',
    name: 'Abridor de Madeira',
    description: 'Base de madeira com gravação a laser, visual artesanal.',
    image: `${IMG}/abridores/abridor-madeira.webp`,
    imageAlt: 'Abridor de garrafa com base de madeira',
  },
  {
    id: 'abridor-chaveiro',
    category: 'abridores',
    name: 'Abridor Chaveiro',
    description: 'Dois em um: abridor prático que anda junto das chaves.',
    image: `${IMG}/abridores/abridor-chaveiro.webp`,
    imageAlt: 'Abridor de garrafa em formato chaveiro',
  },

  /* ---- Tábuas ---- */
  {
    id: 'tabua-bambu',
    category: 'tabuas',
    name: 'Tábua de Bambu',
    description: 'Sustentável e resistente, com gravação personalizada.',
    image: `${IMG}/tabuas/tabua-bambu.webp`,
    imageAlt: 'Tábua de bambu personalizada',
    featured: true,
  },
  {
    id: 'tabua-vidro',
    category: 'tabuas',
    name: 'Tábua de Vidro',
    description: 'Superfície de vidro temperado, fácil de higienizar.',
    image: `${IMG}/tabuas/tabua-vidro.webp`,
    imageAlt: 'Tábua de vidro temperado personalizada',
  },
  {
    id: 'tabua-gourmet',
    category: 'tabuas',
    name: 'Tábua Gourmet',
    description: 'Formato especial para servir frios e petiscos com estilo.',
    image: `${IMG}/tabuas/tabua-gourmet.webp`,
    imageAlt: 'Tábua gourmet para servir',
  },
];
