/**
 * Todo o texto do site mora aqui.
 * Edite à vontade: os componentes só leem este arquivo.
 */

export const contact = {
  whatsappNumber: '5571991779936',
  whatsappDisplay: '(71) 99177-9936',
  whatsappUrl: 'https://wa.me/5571991779936',
  instagramHandle: '@sadiversoesoficial',
  instagramUrl: 'https://www.instagram.com/sadiversoesoficial/',
};

/** Mensagem pronta para os botões de WhatsApp que não passam pelo formulário. */
export const whatsappDefaultMessage =
  'Olá! Vi o site da Salvador Diversões e quero saber mais sobre a máquina de urso no meu estabelecimento.';

export const brand = {
  name: 'Salvador Diversões',
  /** Logo oficial (urso de boné no círculo amarelo + "Salvador" e a pílula "diversões"). Proporção 10:3. */
  /** O `?v=` força o navegador a baixar de novo quando o arquivo muda (mesmo nome). Some 1 ao trocar o logo. */
  logo: { src: '/assets/logo.png?v=2', width: 600, height: 180, alt: 'Salvador Diversões' },
  tagline: 'Leve diversão para todas as idades ao seu estabelecimento.',
};

export const nav = [
  { label: 'Parceria', href: '#parceria' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Máquinas', href: '#maquinas' },
  { label: 'Onde atuamos', href: '#onde-atuamos' },
  { label: 'Quero jogar', href: '#quero-jogar' },
  { label: 'Dúvidas', href: '#duvidas' },
];

export const header = {
  cta: 'Chamar no WhatsApp',
  menuOpen: 'Abrir menu',
  menuClose: 'Fechar menu',
};

export const hero = {
  badge: 'Máquinas de urso em Salvador e região',
  /** O título é montado assim: antes + [destaque] + depois. */
  titleBefore: 'Transforme seu espaço em ',
  titleHighlight: 'mais movimento',
  titleAfter: ' e mais clientes',
  text: 'Instalamos máquinas de urso no seu estabelecimento e cuidamos de tudo: manutenção, brindes e operação. Você ganha renda extra, e seus clientes ganham diversão.',
  primaryCta: 'Quero uma máquina no meu ponto',
  secondaryCta: 'Ver como funciona',
  secondaryHref: '#como-funciona',
  note: 'Atendemos Salvador e região metropolitana',
  /** Garantias curtas abaixo dos botões (promessas já aprovadas pela marca). */
  highlights: ['Manutenção inclusa', 'Brindes sempre novos', 'Zero trabalho para você'],
  machineLabel:
    'Ilustração de uma máquina de urso: a garra desce, pega uma pelúcia e leva até a saída de prêmios.',
};

export type BenefitIcon = 'coins' | 'wrench' | 'gift' | 'smile' | 'users' | 'handshake';

export const benefits: {
  eyebrow: string;
  title: string;
  intro: string;
  /** Frase ao lado do botão de WhatsApp, no fim da seção. */
  ctaText: string;
  items: { title: string; text: string; icon: BenefitIcon }[];
} = {
  eyebrow: 'Parceria',
  title: 'Você cede o espaço. A gente cuida do resto.',
  intro: 'Você recebe a máquina de urso no seu ponto, e a gente cuida da operação e dos detalhes.',
  ctaText: 'Tem um ponto em Salvador ou Lauro de Freitas?',
  items: [
    {
      title: 'Renda extra',
      text: 'Uma nova fonte de receita para o seu negócio, sem mexer no que você já faz.',
      icon: 'coins',
    },
    {
      title: 'Manutenção inclusa',
      text: 'Cuidamos de toda a manutenção para você ficar tranquilo.',
      icon: 'wrench',
    },
    {
      title: 'Abastecimento completo',
      text: 'Brindes sempre novos e atrativos, que prendem a atenção do público.',
      icon: 'gift',
    },
    {
      title: 'Zero trabalho para você',
      text: 'Nós cuidamos da operação e dos detalhes. Você não se preocupa com nada.',
      icon: 'smile',
    },
    {
      title: 'Mais movimento',
      text: 'Atrai mais pessoas, aumenta o tempo de permanência e impulsiona suas vendas.',
      icon: 'users',
    },
    {
      title: 'Receita compartilhada',
      text: 'Uma parceria justa, que gera resultado para os dois lados.',
      icon: 'handshake',
    },
  ],
};

/** PENDENTE: confirme se estes 4 passos refletem o processo real. */
export const howItWorks = {
  eyebrow: 'Como funciona',
  title: 'Do primeiro contato à máquina funcionando',
  intro: 'Simples assim. Você fala com a gente, e a gente resolve o resto.',
  steps: [
    {
      title: 'Você chama',
      text: 'Mande uma mensagem no WhatsApp contando sobre o seu estabelecimento.',
    },
    {
      title: 'Escolhemos o lugar',
      text: 'Vemos juntos o melhor cantinho do seu espaço, onde a máquina chama atenção.',
    },
    {
      title: 'Instalamos',
      text: 'Levamos a máquina, instalamos e deixamos tudo pronto para jogar.',
    },
    {
      title: 'Cuidamos de tudo',
      text: 'Manutenção, brindes e operação ficam com a gente. Você só acompanha a diversão.',
    },
  ],
  placesTitle: 'Combina com o seu tipo de negócio',
  places: [
    'Farmácias',
    'Padarias',
    'Restaurantes',
    'Lanchonetes',
    'Açaiterias',
    'Barzinhos',
    'Delicatessens',
  ],
};

export type GalleryPhoto = {
  /** Nome do arquivo em public/assets (ex.: 'maquina-1.jpg'). Rode `npm run images` depois de trocar. */
  file: string;
  alt: string;
};

export const gallery: {
  eyebrow: string;
  title: string;
  text: string;
  whatsappCta: string;
  instagramCta: string;
  /** De 1 a 6 fotos. A primeira aparece em destaque. */
  photos: GalleryPhoto[];
} = {
  eyebrow: 'Máquinas',
  title: 'O próximo ponto pode ser o seu',
  text: 'Nossas máquinas já estão alegrando estabelecimentos em Salvador. Chame a gente e leve uma para o seu.',
  whatsappCta: 'Quero uma máquina',
  instagramCta: 'Ver no Instagram',
  photos: [
    {
      file: 'maquina-1.jpg',
      alt: 'Máquina de urso da Salvador Diversões instalada em um estabelecimento, cheia de pelúcias.',
    },
  ],
};

/** PENDENTE: lista final de municípios. Não inclua cidades sem confirmar. */
export const coverage = {
  eyebrow: 'Onde atuamos',
  title: 'Salvador e região metropolitana',
  intro: 'Levamos nossas máquinas para estabelecimentos destas áreas:',
  places: [
    { name: 'Salvador', note: '' },
    { name: 'Lauro de Freitas', note: '' },
    {
      name: 'Outros municípios da região metropolitana',
      note: 'Consulte pelo WhatsApp',
    },
  ],
  /** Rótulo pequeno nos bilhetes das cidades atendidas. */
  ticketLabel: 'Atendemos',
  /** Título do bilhete tracejado, para quem é de outra cidade. */
  otherTitle: 'Sua cidade?',
  cta: 'Consultar minha cidade',
  ctaMessage: 'Olá! Quero saber se a Salvador Diversões atende a minha cidade.',
};

export const forPlayers = {
  eyebrow: 'Quero jogar',
  title: 'Brincadeira e prêmios para todas as idades',
  intro: 'Viu uma máquina da Salvador Diversões por aí? É fácil jogar:',
  steps: [
    { title: 'Escolha o prêmio', text: 'Olhe bem e escolha a pelúcia que você quer levar.' },
    { title: 'Posicione a garra', text: 'Use a alavanca para deixar a garra bem em cima do prêmio.' },
    { title: 'Aperte e torça', text: 'Aperte o botão, a garra desce e é só torcer.' },
  ],
  stepLabel: 'Passo',
  panelCta: 'Seguir @sadiversoesoficial',
};

export type EstablishmentOption = {
  value: string;
  label: string;
  /** Como aparece na mensagem: "Tenho {phrase} em ..." */
  phrase: string;
};

export const leadForm: {
  eyebrow: string;
  title: string;
  intro: string;
  fields: {
    name: string;
    namePlaceholder: string;
    nameError: string;
    type: string;
    typePlaceholder: string;
    /** Placeholder da busca dentro da lista de tipos. */
    typeSearchPlaceholder: string;
    /** Texto quando a busca não encontra nenhum tipo. */
    typeEmpty: string;
    neighborhood: string;
    neighborhoodPlaceholder: string;
    city: string;
    cityPlaceholder: string;
    notes: string;
    notesPlaceholder: string;
    optional: string;
  };
  establishmentTypes: EstablishmentOption[];
  submit: string;
  privacy: string;
  success: string;
  /** Coluna de canais diretos, ao lado do formulário. */
  channelsTitle: string;
  channelsText: string;
  /** Cabeçalho do cartão do formulário. */
  formTitle: string;
  formText: string;
  /** Texto do pino no globo. */
  globeLabel: string;
} = {
  eyebrow: 'Fale com a gente',
  title: 'Quero uma máquina no meu ponto',
  intro: 'Preencha e envie pelo WhatsApp. A mensagem já vai pronta.',
  fields: {
    name: 'Seu nome',
    namePlaceholder: 'Como podemos te chamar?',
    nameError: 'Digite seu nome para a gente saber com quem está falando.',
    type: 'Tipo de estabelecimento',
    typePlaceholder: 'Escolha uma opção',
    typeSearchPlaceholder: 'Buscar tipo…',
    typeEmpty: 'Nada encontrado. Escolha "Outro".',
    neighborhood: 'Bairro',
    neighborhoodPlaceholder: 'Ex.: Pituba',
    city: 'Cidade',
    cityPlaceholder: 'Ex.: Salvador',
    notes: 'Observação',
    notesPlaceholder: 'Conte algo sobre o seu espaço, se quiser.',
    optional: '(opcional)',
  },
  establishmentTypes: [
    { value: 'farmacia', label: 'Farmácia', phrase: 'uma farmácia' },
    { value: 'padaria', label: 'Padaria', phrase: 'uma padaria' },
    { value: 'restaurante', label: 'Restaurante', phrase: 'um restaurante' },
    { value: 'lanchonete', label: 'Lanchonete', phrase: 'uma lanchonete' },
    { value: 'acaiteria', label: 'Açaiteria', phrase: 'uma açaiteria' },
    { value: 'barzinho', label: 'Barzinho', phrase: 'um barzinho' },
    { value: 'delicatessen', label: 'Delicatessen', phrase: 'uma delicatessen' },
    { value: 'outro', label: 'Outro', phrase: 'um estabelecimento' },
  ],
  submit: 'Enviar pelo WhatsApp',
  privacy: 'Nada é gravado no site. Seus dados vão só na mensagem do WhatsApp.',
  success: 'Abrimos o WhatsApp em uma nova aba. É só enviar a mensagem!',
  channelsTitle: 'Prefere chamar direto?',
  channelsText: 'Fale com a gente no WhatsApp ou acompanhe as novidades no Instagram.',
  formTitle: 'Envie seus dados',
  formText: 'Só o nome é obrigatório. O resto ajuda a gente a preparar a conversa.',
  globeLabel: 'Salvador',
};

export const faq = {
  eyebrow: 'Dúvidas',
  title: 'Perguntas frequentes',
  intro: 'Respostas diretas sobre a parceria. Se faltar alguma coisa, a gente explica pelo WhatsApp.',
  items: [
    {
      q: 'Quem cuida da manutenção?',
      a: 'A gente. Toda a manutenção da máquina é por conta da Salvador Diversões, para você ficar tranquilo.',
    },
    {
      q: 'Quem abastece a máquina?',
      a: 'Também somos nós. Repomos os brindes com frequência, sempre com novidades que chamam a atenção do público.',
    },
    {
      q: 'Preciso trabalhar na operação?',
      a: 'Não. Nós cuidamos da operação e dos detalhes. Você só cede o espaço.',
    },
    {
      q: 'Como funciona o ganho?',
      a: 'É uma receita compartilhada: a máquina gera resultado para os dois lados. Os detalhes da parceria a gente combina com você pelo WhatsApp.',
    },
    {
      q: 'Que tipos de estabelecimento vocês atendem?',
      a: 'Farmácias, padarias, restaurantes, lanchonetes, açaiterias, barzinhos, delicatessens e outros pontos com movimento de público. Se o seu é diferente, chama a gente para conversar.',
    },
    {
      q: 'Vocês atendem a minha cidade?',
      a: 'Atendemos Salvador e Lauro de Freitas. Para outros municípios da região metropolitana, consulte pelo WhatsApp.',
    },
  ],
  cta: 'Ficou com outra dúvida? Fale com a gente',
};

/** Adesivo do letreiro do rodapé: ursinho (com a cor da pelúcia), ficha ou alavanca da máquina. */
export type FooterSticker =
  | { kind: 'bear'; color: 'honey' | 'pink' | 'sky'; label: string }
  | { kind: 'token' | 'joystick'; label: string };

/**
 * Rodapé. As cidades e o botão "Consultar minha cidade" vêm de `coverage`;
 * os links de seção vêm de `nav`; o número e o Instagram vêm de `contact`.
 */
export const footer: {
  tagline: string;
  rights: string;
  backToTop: string;
  backToTopLabel: string;
  contactTitle: string;
  navTitle: string;
  navLabel: string;
  wordmark: string[];
  wordmarkLabel: string;
  stickersLabel: string;
  stickerHint: string;
  stickers: FooterSticker[];
} = {
  tagline: brand.tagline,
  rights: 'Salvador Diversões. Todos os direitos reservados.',
  backToTop: 'Topo',
  backToTopLabel: 'Voltar ao topo',
  contactTitle: 'Fale com a gente',
  navTitle: 'Navegue',
  navLabel: 'Seções do site',
  /**
   * Letreiro escrito à mão no fim do rodapé, uma linha por item.
   * Aceita letras de a a z, os acentos do português (á, â, ã, à, é, ê, í, ó, ô, õ, ú, ç), "!" e ".".
   * Maiúsculas viram minúsculas; outros caracteres viram espaço.
   */
  wordmark: ['salvador', 'diversões'],
  wordmarkLabel: 'Escrever o letreiro de novo',
  stickersLabel: 'Adesivos de enfeite',
  stickerHint: 'Adesivo de enfeite. Arraste com o mouse ou mova com as setas do teclado; Esc devolve ao lugar.',
  /** De 1 a 6 adesivos, na ordem em que caem no letreiro. */
  stickers: [
    { kind: 'bear', color: 'honey', label: 'Ursinho de pelúcia caramelo' },
    { kind: 'token', label: 'Ficha de fliperama com estrela' },
    { kind: 'bear', color: 'pink', label: 'Ursinho de pelúcia rosa' },
    { kind: 'joystick', label: 'Alavanca da máquina de urso' },
    { kind: 'bear', color: 'sky', label: 'Ursinho de pelúcia azul' },
  ],
};
