/**
 * Gera a foto provisória da máquina em public/assets.
 * O logo (logo.png) e a imagem de compartilhamento (og.jpg) são oficiais, feitos no Paper,
 * e não são gerados aqui.
 * NÃO sobrescreve arquivos que já existem, para não apagar as fotos reais.
 * Use `npm run placeholders -- --force` para regerar.
 */
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const dir = join(process.cwd(), 'public', 'assets');
mkdirSync(dir, { recursive: true });
const force = process.argv.includes('--force');

const C = {
  surface: '#fff9e8',
  ink: '#1a2150',
  muted: '#4a5380',
  sun: '#ffc400',
  navy: '#1b3a8c',
  sky: '#2f7fe0',
  red: '#d32f2f',
  honey: '#e8903a',
  leaf: '#3e9f3a',
  pink: '#d81b60',
  grape: '#6a3cb5',
  line: '#e5dab8',
};

const star = (x, y, s, fill) =>
  `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" d="M0-10C.4-3 3-.4 10 0 3 .4.4 3 0 10-.4 3-3 .4-10 0-3-.4-.4-3 0-10Z"/>`;

const bear = (x, y, s, fill) => `<g transform="translate(${x} ${y}) scale(${s})">
  <circle cx="-16" cy="-16" r="9" fill="${fill}"/><circle cx="16" cy="-16" r="9" fill="${fill}"/>
  <circle r="22" fill="${fill}"/><ellipse cy="8" rx="10.5" ry="7.5" fill="#fff"/>
  <ellipse cy="5" rx="3.6" ry="2.6" fill="${C.ink}"/>
  <circle cx="-8" cy="-4" r="2.7" fill="${C.ink}"/><circle cx="8" cy="-4" r="2.7" fill="${C.ink}"/></g>`;

// Foto provisória: ilustração de uma máquina num estabelecimento (troque pela foto real).
const machine = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
  <rect width="1200" height="1500" fill="${C.surface}"/>
  <rect y="1180" width="1200" height="320" fill="${C.line}"/>
  <ellipse cx="600" cy="1290" rx="330" ry="30" fill="${C.ink}" opacity=".15"/>
  <g transform="translate(330 170)">
    <rect width="540" height="1100" rx="56" fill="${C.navy}"/>
    <rect x="28" y="28" width="484" height="130" rx="36" fill="${C.sun}"/>
    ${star(270, 93, 4, C.navy)}
    <rect x="40" y="186" width="460" height="520" rx="28" fill="#fff"/>
    <rect x="40" y="230" width="460" height="14" fill="${C.ink}" opacity=".8"/>
    <rect x="248" y="244" width="6" height="150" fill="${C.ink}"/>
    <rect x="226" y="386" width="50" height="30" rx="12" fill="${C.navy}"/>
    <path d="M238 414l-26 42q-6 22 16 34M264 414l26 42q6 22-16 34" stroke="${C.ink}" stroke-width="10" fill="none" stroke-linecap="round"/>
    ${bear(110, 640, 2, C.sky)}${bear(230, 660, 2, C.pink)}${bear(360, 640, 2, C.honey)}${bear(170, 560, 1.6, C.honey)}${bear(300, 570, 1.6, C.sky)}
    <path d="M330 186h70L250 706h-70Z" fill="#fff" opacity=".25"/>
    <rect x="28" y="734" width="484" height="110" rx="32" fill="${C.sun}"/>
    <circle cx="360" cy="789" r="26" fill="${C.navy}"/><circle cx="430" cy="789" r="22" fill="#fff" stroke="${C.ink}" stroke-width="6"/>
    <rect x="132" y="740" width="16" height="44" rx="8" fill="${C.ink}"/><circle cx="140" cy="736" r="26" fill="${C.navy}"/>
    <rect x="60" y="880" width="220" height="120" rx="28" fill="${C.ink}"/>
    <rect x="330" y="880" width="160" height="120" rx="28" fill="${C.sun}"/>
  </g>
</svg>`;

async function write(name, svg, fmt) {
  const out = join(dir, name);
  if (existsSync(out) && !force) {
    console.log(`= ${name} já existe, mantido`);
    return;
  }
  const img = sharp(Buffer.from(svg));
  await (fmt === 'png' ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 82, mozjpeg: true })).toFile(out);
  console.log(`+ ${name}`);
}

await write('maquina-1.jpg', machine, 'jpg');
