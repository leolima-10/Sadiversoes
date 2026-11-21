# Salvador Diversões: site

Landing page de uma página só. React 18 + Vite + TypeScript + Tailwind CSS 3.4. Sem backend.

```bash
npm install
npm run dev       # abre em http://localhost:5173
npm run build     # gera a pasta dist/ (verifica os tipos antes)
npm run preview   # serve o dist/ em http://localhost:4173
```

> Se o `npm install` avisar sobre scripts de instalação bloqueados, rode `npm install-scripts approve esbuild sharp` e `npm rebuild`.

## Editar textos: `src/content.ts`

Todo o texto do site está em `src/content.ts`: títulos, botões, benefícios, passos, perguntas frequentes, tipos de estabelecimento do formulário, número do WhatsApp e Instagram. Os componentes só leem esse arquivo. Mude o texto entre aspas e salve.

- **WhatsApp e Instagram:** `contact`, no topo. O número vai sem espaços e com o 55 na frente.
- **Mensagem dos botões de WhatsApp:** `whatsappDefaultMessage`.
- **Tipos de estabelecimento do formulário:** `leadForm.establishmentTypes`. O campo `phrase` é como o tipo aparece na mensagem ("Tenho **uma padaria** em ...").
- **Municípios atendidos:** `coverage.places`. Se incluir cidades, atualize também a resposta "Vocês atendem a minha cidade?" em `faq` e, se quiser, o mapa em `src/components/Coverage.tsx`. O rodapé lê a mesma lista.
- **Letreiro e adesivos do rodapé:** `footer.wordmark` (uma linha por item; letras de a a z, acentos do português, "!" e ".") e `footer.stickers` (de 1 a 6: ursinhos `honey`, `pink` ou `sky`, a ficha `token` e a alavanca `joystick`, cada um com um texto para leitor de tela).

## Trocar o logo

O logo oficial está em `public/assets/logo.png` (600 × 180, PNG com fundo transparente). O ícone da aba (`public/favicon.svg`) é o emblema do urso sozinho. Os dois foram desenhados no Paper, arquivo "desing-sadiveroses", artboard "Logo · C Mascote".

Para trocar:

1. Salve o arquivo novo em `public/assets/logo.png`, de preferência PNG com fundo transparente.
2. Em `src/content.ts`, ajuste `brand.logo.width` e `brand.logo.height` para a proporção do arquivo novo.

O logo aparece dentro de um "chip" claro, no cabeçalho e no rodapé.

## Trocar ou adicionar fotos das máquinas

1. Coloque as fotos em `public/assets/` (JPG, PNG ou WebP; pode ser a foto do celular).
2. Liste cada uma em `gallery.photos`, no `src/content.ts`, com um texto alternativo que descreva a foto:
   ```ts
   photos: [
     { file: 'maquina-1.jpg', alt: 'Máquina de urso instalada no balcão de uma padaria.' },
     { file: 'maquina-2.jpg', alt: 'Máquina de urso na entrada de uma farmácia.' },
   ],
   ```
   A galeria aceita de 1 a 6 fotos e muda o arranjo sozinha.
3. Rode `npm run images` (ou só `npm run dev`/`npm run build`, que já rodam esse passo). O script cria versões WebP e JPG otimizadas em `public/assets/otimizadas/`, recortadas em 4:5 (retrato, centralizado).

`maquina-1.jpg` hoje é uma ilustração provisória. Para trocar, substitua o arquivo, mantendo o nome, ou mude o nome em `content.ts`.

Para gerar de novo as imagens provisórias, rode `npm run placeholders -- --force`. Cuidado: isso sobrescreve `maquina-1.jpg`. O logo e a `og.jpg` (imagem de compartilhamento, feita no Paper, artboard "OG · 1200×630") não são tocados.

## Formulário

O botão "Enviar pelo WhatsApp" monta a mensagem e abre o `wa.me` em nova aba. Nada é gravado em servidor. A lógica fica em `src/lib/lead.ts`:

- `buildLeadMessage(data)` monta o texto;
- `sendLead(data)` valida e abre o WhatsApp.

Para usar uma API no futuro, reescreva só `sendLead` (por exemplo, um `fetch` para o seu endpoint). O componente não precisa mudar.

## Cores, fontes e tema

- Os tokens da marca estão em `src/index.css` (variáveis CSS, claro e escuro) e em `tailwind.config.ts` (classes `bg-surface`, `text-ink`, `bg-sun` etc.). A paleta padrão do Tailwind foi removida de propósito: `bg-white` ou `text-gray-500` nem compilam.
- O tema escuro segue o sistema (`prefers-color-scheme`). Para forçar, coloque `class="dark"` ou `class="light"` no `<html>` do `index.html`.
- **Uso das cores:** azul-marinho (`navy`) e creme (`surface`) dominam. O amarelo (`sun`) aparece só em destaques: o sublinhado do título, os ícones, o traço dos rótulos de seção. O fundo amarelo-claro suave (`surface-alt`) é usado nas faixas Máquinas e Quero jogar. As outras cores da marca (sky, honey, pink etc.) ficam só nas ilustrações: a máquina do topo e os adesivos do rodapé.
- **Fonte:** Plus Jakarta Sans (Google Fonts), em títulos e texto. Enquanto ela carrega, o site usa uma reserva com as mesmas medidas (`Jakarta Fallback`, em `src/index.css`), e por isso a página não pula na troca. Se trocar a fonte, recalcule esses valores ou apague as duas regras `@font-face`.
- **Formas:** cantos de 8, 12 e 20 px (`rounded-sm`, `rounded-md`, `rounded-lg`), sem sombra nos botões. O hover só muda a cor.
- A animação da máquina (`src/components/ClawMachine.css`) para sozinha quando o sistema pede movimento reduzido.

## Publicar

Antes de publicar, troque no `index.html` o `og:image` por uma URL absoluta do seu domínio (ex.: `https://seudominio.com.br/assets/og.jpg`). Sem isso, a prévia do link no WhatsApp e no Instagram pode não aparecer.

**Vercel:** importe o repositório em vercel.com/new. O framework é detectado como Vite. Build command `npm run build`, output `dist`.

**Netlify:** em app.netlify.com, "Add new site" → importe o repositório. Build command `npm run build`, publish directory `dist`. Ou arraste a pasta `dist/` para app.netlify.com/drop.

Nos dois, se a instalação falhar por causa do `sharp`, confira se a versão do Node é 18 ou mais nova (configure `NODE_VERSION=20` nas variáveis de ambiente).

## Pendências

- [x] Logo oficial em `public/assets/logo.png`
- [ ] Fotos reais das máquinas em `public/assets/`
- [ ] Lista final de municípios atendidos (`coverage` e `faq` em `content.ts`)
- [ ] Confirmar se os 4 passos de "Como funciona" refletem o processo real (`howItWorks`)
- [ ] URL absoluta do `og:image` no `index.html`
