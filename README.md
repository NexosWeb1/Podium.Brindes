# Podium Brindes — Landing Page

Landing page de conversão para a Podium Brindes (brindes corporativos personalizados, Campestre-MG). HTML + CSS + JavaScript puro, sem build step.

## Rodar localmente

O site usa ES modules, que **exigem HTTP** (não abrir via `file://`). Suba um servidor estático na pasta do projeto:

```bash
# Python
python -m http.server 8000

# ou Node
npx serve .
```

Depois acesse `http://localhost:8000`.

## Estrutura

```
index.html              Página única (7 seções na ordem do brief)
css/                    reset · tokens · base · layout · components · sections · animations
js/                     config · main · smooth-scroll · nav · catalog · form · animations
data/                   categories.js · products.js   (catálogo data-driven)
img/                    logos originais do cliente (JPEG)
assets/img/products/    fotos reais dos produtos (a receber)
```

A ordem dos `<link>` de CSS importa (tokens antes dos componentes; animations por último).

## Como manter

### Trocar contato / WhatsApp / endereço / horário
Tudo em [`js/config.js`](js/config.js). Fonte única. O WhatsApp fica em formato E.164 (só dígitos, com DDI 55).

### Adicionar um produto
Um objeto em [`data/products.js`](data/products.js):

```js
{
  id: 'caneca-nova',              // único
  category: 'canecas',            // deve casar com um id de categories.js
  name: 'Caneca Nova',
  description: 'Descrição curta.',
  image: 'assets/img/products/canecas/caneca-nova.webp',
  imageAlt: 'Caneca nova personalizada',
  featured: false,                // opcional
}
```

Não precisa mexer em HTML/CSS. O card, o filtro e o select do formulário se atualizam sozinhos.

### Adicionar uma categoria
Um objeto em [`data/categories.js`](data/categories.js) (`{ id, label }`) + os produtos dela. O chip de filtro aparece automaticamente.

### Colocar as fotos reais dos produtos
1. Salve as imagens em `assets/img/products/<categoria>/<id>.webp` (o caminho de cada uma já está em `product.image`; veja também `data-real-src` nos cards).
2. Em [`js/config.js`](js/config.js), mude `productImagesReady` para `true`.
   - Enquanto `false`, o catálogo mostra placeholders e **não** tenta carregar as fotos (evita 404).
3. Hero e "Quem é a Podium": troque o `src` de cada `<img>` pelo caminho em `data-real-src` no [`index.html`](index.html).

Recomendado: WebP/AVIF, ~800px de largura, comprimidas.

## Bibliotecas (via CDN, versão fixada)
- **Lenis** 1.1.13 — scroll suave.
- **GSAP + ScrollTrigger** 3.12.5 — animações no scroll.
- **Google Fonts** — Space Grotesk (títulos) + Inter (corpo).

Tudo degrada com elegância: sem as libs (ou com `prefers-reduced-motion`), o site funciona com scroll nativo e conteúdo visível.

## Integração do formulário (WhatsApp)
O formulário não tem backend: ao enviar, monta um link `wa.me` com a mensagem pré-preenchida e abre o WhatsApp. Se o popup for bloqueado, aparece um link de fallback. Há um hook `onQuoteSubmitted(payload)` em [`js/form.js`](js/form.js) para plugar analytics/backend no futuro.

## Pendências do cliente
- Confirmar se **(35) 3743-3647** tem WhatsApp; informar o **Instagram**; confirmar número do endereço (148B × 160).
- Enviar as **fotos reais** dos produtos e uma imagem para o hero e para o institucional.
- Fornecer os **logos em SVG/PNG transparente** (os atuais são JPEG com fundo sólido).

## Acessibilidade e performance
HTML semântico, um `<h1>`, foco visível, labels reais, `prefers-reduced-motion` respeitado, imagens com dimensões (sem CLS) e lazy-load no catálogo. Testado sem erros de console em desktop e mobile (375px), sem scroll horizontal.
