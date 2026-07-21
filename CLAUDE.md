# CLAUDE.md — Podium Brindes (Landing Page)

Contexto e convenções deste projeto para o Claude Code. Leia antes de editar.

## O que é
Landing page de conversão para a **Podium Brindes** (brindes corporativos personalizados, Campestre-MG), substituindo o site antigo (podiumbrindes.com.br). Single page, PT-BR.

## Stack (sem build step)
- **HTML + CSS + JavaScript puro.** Nada de framework/bundler (sem React/Vue/Webpack/Vite).
- **JS = ES modules nativos** (`<script type="module">`): usar `import`/`export`. Sem CommonJS.
- Libs externas (CDN, versão fixada; fallback local em `assets/vendor/`):
  - **Lenis** — scroll suave.
  - **GSAP + ScrollTrigger** — animações no scroll.
  - **Google Fonts** — Space Grotesk (títulos) + Inter (corpo).
- **Inspira-ui NÃO é usado** (é Vue, incompatível). Efeitos equivalentes (spotlight, marquee, gradiente animado, bento hover) recriados em CSS/JS puro.

## Estrutura
```
index.html
css/   reset · tokens · base · layout · components · sections · animations   (ordem do <link> importa)
js/    config · main · smooth-scroll · animations · catalog · form · nav      (ES modules)
data/  categories.js · products.js   (catálogo data-driven)
assets/ img · icons · favicon · vendor
img/   logo branca.jpeg · logo preta.jpeg   (assets originais do cliente)
```

## Regras de manutenção
- **Cores/tema:** só em `css/tokens.css` (design tokens em `:root`). Não hardcodar hex nos componentes.
- **Catálogo:** adicionar produto = 1 objeto em `data/products.js`; nova categoria = 1 entrada em `data/categories.js` + produtos. **Nunca** editar HTML/CSS por produto.
  - Todo `product.category` deve casar com um `id` de `categories.js`.
- **Contato/negócio:** número WhatsApp, endereço, horário, Instagram ficam em `js/config.js`. Trocar só ali.
- **Scroll:** toda âncora/navegação usa `lenis.scrollTo`, nunca `scrollIntoView`.
- **Animações:** só `transform`/`opacity`. Estado-base do CSS é visível; JS adiciona `.js-anim` para revelar. Sempre respeitar `prefers-reduced-motion`.
- **A11y:** semântica, 1 `<h1>` (hero), `:focus-visible` sempre visível, `<label>` reais, alt em imagens.

## Design
- **Tema híbrido:** hero e rodapé escuros/metálicos; conteúdo/catálogo em base clara.
- **Tipografia:** Space Grotesk (títulos) + Inter (corpo).
- **Paleta:** grafite `#0A0A0A/#141414`, cromado/prata, ouro CTA `#A16207` (WCAG-safe em fundo claro) e ouro metálico decorativo `#D4A72C`, bronze `#B06A3B`. Base clara `#FFFFFF/#F5F5F4`.

## Dados de negócio (confirmar com cliente)
- Tel/WhatsApp placeholder: **(35) 3743-3647** → E.164 `553537433647` (confirmar se tem WhatsApp).
- Endereço: **Rua Cândido Ribeiro da Silva, 148B — Nova Campestre, Campestre-MG, 37730-000** (Google; site antigo diz 160 — confirmar).
- E-mails: contato@ / vendas@podiumbrindes.com.br · Facebook: facebook.com/podiumbrindes · Instagram: **a obter**.
- Horário: Ter–Sex 07–18h · Sáb 08–12h · Dom fechado · Seg 07–18h.

## Pendências
- Logos são JPEG com fundo sólido → obter SVG/PNG transparente.
- Fotos reais dos produtos → hoje são placeholders.
- Avaliar backend no-build do formulário (Formspree/Web3Forms) para capturar e-mail além do WhatsApp.

## Verificar antes de entregar
- 7 seções na ordem do brief; responsivo em 360/768/1280.
- Filtro do catálogo mostra só a categoria certa; form abre `wa.me` pré-preenchido (testar fallback de popup bloqueado).
- Lenis ativo; animações desligam sob `prefers-reduced-motion`; nav vira hamburger e trava scroll aberto.
- Lighthouse mobile: Perf ≥90, A11y ≥95, BP/SEO ≥95; console sem erros.
- Rodar a limpeza de copy (skill `remove-IAs-signal`) e a varredura `publish-in-git` antes de commit/push.
