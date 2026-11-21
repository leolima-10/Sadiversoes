# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Principal: dono ou gerente de estabelecimento comercial** em Salvador (BA) e região metropolitana: farmácias, padarias, restaurantes, lanchonetes, açaiterias, barzinhos, delicatessens e outros pontos com movimento de público. O trabalho dele no site: entender rápido o que é a parceria, sentir que é confiável e sem dor de cabeça, e chamar a empresa no WhatsApp para receber uma máquina no seu ponto. Ele avalia como empresário: quer renda extra, mais movimento e zero trabalho, e desconfia de promessa vaga.

**Secundário: quem joga.** Crianças, famílias e clientes dos pontos que viram uma máquina da marca e querem saber como jogar ou acompanhar novidades no Instagram.

## Product Purpose

A Salvador Diversões instala máquinas de urso (garra) em estabelecimentos e cuida de toda a operação: manutenção, abastecimento de brindes e detalhes do dia a dia. O dono cede o espaço e recebe uma parte da receita da máquina.

O site existe para captar novos pontos. Sucesso é um dono de estabelecimento iniciar a conversa no WhatsApp, pelo botão direto ou pelo formulário que monta a mensagem.

## Positioning

A combinação que a empresa afirma e que o site deve sustentar:

- **Cuidado completo:** manutenção, brindes e operação ficam 100% com a empresa; o dono não faz nada.
- **Atendimento local e rápido:** empresa de Salvador, perto do cliente, resolve problemas com rapidez.
- **Brindes e máquinas de qualidade:** pelúcias atrativas, máquinas bem conservadas, renovação frequente.
- **Parceria justa e transparente:** receita compartilhada com divisão clara, sem letras miúdas.

## Operating Context

- O primeiro contato e toda a negociação acontecem no **WhatsApp (71) 99177-9936** (`https://wa.me/5571991779936`). Os detalhes da parceria, inclusive a divisão da receita, são combinados ali, não no site.
- O **Instagram @sadiversoesoficial** mostra novidades, prêmios e máquinas, e serve aos dois públicos.
- O formulário do site não grava nada: monta a mensagem e abre o WhatsApp. A lógica está isolada (`src/lib/lead.ts`) para virar uma API no futuro.

## Capabilities and Constraints

- **Custo para o dono:** o único custo é a **energia elétrica** (a máquina fica ligada na tomada do estabelecimento). Máquina, instalação, manutenção e brindes são por conta da empresa. Nunca escrever "sem custo nenhum" ou "custo zero".
- **Modelo:** receita compartilhada. **Não publicar** números de faturamento, percentuais de ganho ou quantidade de máquinas instaladas sem confirmação da empresa.
- **Área atendida confirmada:** Salvador e Lauro de Freitas. Outros municípios da região metropolitana: "consulte pelo WhatsApp". Não citar outras cidades.
- **Em aberto (a empresa vai definir):**
  - lista final de municípios atendidos;
  - se os 4 passos do processo (Você chama → Escolhemos o lugar → Instalamos → Cuidamos de tudo) refletem o processo real;
  - requisitos mínimos do ponto (espaço, tomada, movimento), ainda não informados.
- **Terminologia:** "máquina de urso" (termo principal, como o público fala), "máquina de garra" como sinônimo; "ponto" ou "estabelecimento" para o local do parceiro; "brindes" ou "prêmios" para as pelúcias.

## Brand Commitments

- **Nome:** Salvador Diversões. Slogan: "Leve diversão para todas as idades ao seu estabelecimento."
- **Logo (aprovado em nov/2026):** emblema redondo amarelo com contorno azul-escuro e o urso de boné vermelho dentro, ao lado de "Salvador" em azul (fonte Fredoka) e da pílula azul "diversões" em amarelo. O emblema sozinho é o ícone (favicon, perfil). Arquivos: `public/assets/logo.png` e `public/favicon.svg`; fonte no Paper, "desing-sadiveroses" → "Logo · C Mascote". Não redesenhar, esticar nem trocar as cores.
- **Voz:** próxima, direta e confiável; segunda pessoa ("você", "seu estabelecimento"); frases curtas; português do Brasil. Toda peça termina com convite para o WhatsApp.
- **Tom confirmado (nov/2026):** sério e profissional, com um toque leve de diversão. A primeira versão, "animada demais", foi rejeitada pelo dono da marca.
- **Promessas aprovadas** (usar estas e não inventar outras): renda extra; manutenção inclusa; abastecimento completo com brindes sempre novos; zero trabalho para o dono; mais movimento e tempo de permanência; receita compartilhada justa.
- **Emoji:** no máximo um ou dois por peça, só 🧸 ou 🕹️, nunca em títulos.

## Evidence on Hand

- **Disponíveis, mas ainda não entregues:** fotos reais de máquinas instaladas, a colocar em `public/assets/` (hoje há só uma ilustração provisória em `maquina-1.jpg`), e **nomes de pontos atuais** que podem ser citados.
- **Não existem:** depoimentos de donos, números de resultado, prêmios ou matérias na imprensa. **Não fabricar** depoimentos, clientes, números ou selos.

## Product Principles

1. **Confiança antes de entusiasmo.** O dono decide como empresário; clareza e prova vencem euforia.
2. **Só prometer o que a empresa cumpre.** Usar as promessas aprovadas e os fatos confirmados; o que está em aberto fica em aberto.
3. **Um caminho de ação: o WhatsApp.** Toda seção leva à conversa; o site não substitui a negociação.
4. **Diversão na medida.** A brincadeira pertence ao produto (a máquina, os prêmios), não ao tom da empresa.
5. **Local de verdade.** Salvador e região são o território; a proximidade é parte da promessa.

## Accessibility & Inclusion

- **Alvo:** WCAG 2.1 AA.
  - Contraste mínimo de 4.5:1 para texto.
  - Foco visível.
  - HTML semântico e textos alternativos.
  - Erros de formulário anunciados.
  - `prefers-reduced-motion` respeitado: a animação da máquina para.
- **Uso principal no celular:** o dono costuma ver o site pelo link do WhatsApp ou do Instagram. Testar em 360px.
