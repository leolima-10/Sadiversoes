import { clamp, hash, round } from './shapes';

/**
 * Letra cursiva de traço único (marcador grosso) para o letreiro do rodapé, desenhada em SVG.
 * Adaptada do "Sticker Slap Footer". Tudo aqui é puro: recebe o texto e devolve paths, tempos e posições.
 *
 * Unidades do alfabeto: altura-x 10, linha de base em y = 0, y cresce para baixo.
 */

type Glyph = [advance: number, main: string, lifts?: string, liftsAfter?: number];

/**
 * [avanço, traço principal, traços com a caneta levantada, levanta a caneta depois?].
 * O traço principal começa em (0, -1) e, se a letra não levanta a caneta, termina em (avanço, -1):
 * assim as letras se emendam num traço só. Só M / L / C absolutos, então os números alternam x e y.
 */
const SCRIPT: Record<string, Glyph> = {
  a: [10.2, 'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -10L7.8 -3C7.8 -0.8 8.8 -1 10.2 -1'],
  b: [9.4, 'M0 -1C2.8 -3 6.2 -12 6 -16.4C5.8 -19.8 1.8 -20 1.8 -16.4L1.8 -1L1.8 -6C2.4 -9 3.4 -10 4.8 -10C6.8 -10 8.2 -8 8.2 -5C8.2 -2 6.6 0 4.8 0C3.4 0 2.4 -0.6 1.8 -1.6C2.4 -0.6 3.4 0 4.8 0C6.6 0 7.8 -0.8 9.4 -1'],
  c: [8.8, 'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C5.6 -10 6.6 -9.6 7 -8.6C6.6 -9.6 5.6 -10 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6 0 7 -1 8.8 -1'],
  d: [10.2, 'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -19L7.8 -3C7.8 -0.8 8.8 -1 10.2 -1'],
  e: [9.4, 'M0 -1C3.4 -2.4 8 -4.4 8 -7.6C8 -9.4 6.6 -10.4 4.8 -10.4C2.2 -10.4 0.8 -7.8 0.8 -5C0.8 -1.8 2.6 0 5 0C6.8 0 8 -1 9.4 -1'],
  f: [7, 'M0 -1C2.8 -3 6.2 -12 6 -16.4C5.8 -19.8 1.8 -20 1.8 -16.4L1.8 7.2C1.8 9.6 3.2 9.6 3.8 7.6C4.4 5 4.8 -1 7 -1', 'M-0.4 -9.4L5.4 -9.4'],
  g: [9.6, 'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -10L7.8 4C7.8 8.6 5.8 9.6 4.2 9.6C2 9.6 1.4 7.6 2.8 6C4.6 4 7.4 1.4 9.6 -1'],
  h: [10, 'M0 -1C2.8 -3 6.2 -12 6 -16.4C5.8 -19.8 1.8 -20 1.8 -16.4L1.8 -1L1.8 -5.6C2.6 -8.6 4 -10 5.6 -10C7.2 -10 7.8 -8.8 7.8 -7L7.8 -3C7.8 -0.8 8.8 -1 10 -1'],
  i: [5, 'M0 -1C1.2 -1.4 2 -6 2.2 -10L2.2 -3C2.2 -0.8 3.4 -1 5 -1', 'M2.4 -15.2L2.5 -15.3'],
  j: [5.4, 'M0 -1C1.2 -1.4 2 -6 2.2 -10L2.2 4.6C2.2 9.6 -0.6 9.8 -0.2 7.4C0.2 5 3.4 1.4 5.4 -1', 'M2.4 -15.2L2.5 -15.3'],
  k: [9.6, 'M0 -1C2.8 -3 6.2 -12 6 -16.4C5.8 -19.8 1.8 -20 1.8 -16.4L1.8 -1L1.8 -4.6C3 -8 5.6 -10.4 7 -9.6C8.4 -8.6 7 -5.6 3.6 -5C5.6 -4.6 6.6 -1 9.6 -1'],
  l: [6.4, 'M0 -1C2.8 -3 6.2 -12 6 -16.4C5.8 -19.8 1.8 -20 1.8 -16.4L1.8 -3.2C1.8 -0.6 4 -1 6.4 -1'],
  m: [14.6, 'M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 -1L1.8 -5.6C2.4 -8.6 3.4 -10 4.8 -10C6.2 -10 7 -9 7 -7L7 -1L7 -5.6C7.6 -8.6 8.6 -10 10 -10C11.4 -10 12.2 -9 12.2 -7L12.2 -3C12.2 -0.8 13.2 -1 14.6 -1'],
  n: [9.6, 'M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 -1L1.8 -5.6C2.4 -8.6 3.4 -10 4.8 -10C6.4 -10 7.2 -9 7.2 -7L7.2 -3C7.2 -0.8 8.2 -1 9.6 -1'],
  o: [9, 'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5C7.6 -7.8 6.1 -10 4.3 -10C6 -10 7.4 -9.2 9 -9', '', 1],
  p: [9.6, 'M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 9L1.8 -5.6C2.4 -8.6 3.4 -10 5 -10C7 -10 8.2 -8 8.2 -5C8.2 -2 6.6 0 4.8 0C3.4 0 2.4 -0.6 1.8 -1.6C2.4 -0.6 3.4 0 4.8 0C6.6 0 7.8 -0.8 9.6 -1'],
  q: [10.4, 'M0 -1C1.4 -1.4 1.4 -9.6 4.3 -10C2.5 -10 1 -7.8 1 -5C1 -2.2 2.5 0 4.3 0C6.1 0 7.6 -2.2 7.6 -5L7.8 -10L7.8 9C8.8 6 9 0 10.4 -1'],
  r: [8.6, 'M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 -1L1.8 -5.6C2.6 -8.6 4.2 -10 5.8 -10C6.8 -10 7.6 -9.6 8.2 -8.8', '', 1],
  s: [8.4, 'M0 -1C1.6 -2 3 -7 4.4 -10.2C5.6 -8 7.4 -6 7.4 -3.6C7.4 -1.2 5.6 0 3.6 0C2 0 1 -0.6 0.6 -1.6C1 -0.6 2 0 3.6 0C5.6 0 6.8 -0.8 8.4 -1'],
  t: [6.6, 'M0 -1C1 -1.4 2.2 -8 2.4 -15L2.4 -3.2C2.4 -0.8 4 -1 6.6 -1', 'M-0.8 -9.6L6.2 -9.6'],
  u: [10, 'M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 -3.6C1.8 -1 3 0 4.6 0C6.2 0 7.4 -1.4 7.6 -4L7.6 -9.8L7.6 -3C7.6 -0.8 8.6 -1 10 -1'],
  v: [9, 'M0 -1C1.2 -1.6 1.6 -6 1.6 -9.6C1.6 -6 2.6 0 4.4 0C6.4 0 7.6 -6 7.6 -9.6C8 -9 8.4 -8.8 9 -8.8', '', 1],
  w: [12.6, 'M0 -1C1.2 -1.6 1.6 -6 1.6 -9.6L1.6 -3.6C1.6 -1 2.6 0 4 0C5.4 0 6.2 -1 6.2 -3.6L6.2 -8L6.2 -3.6C6.2 -1 7 0 8.4 0C9.8 0 10.8 -1 10.8 -3.6L10.8 -9.6C11.2 -9 11.8 -8.8 12.6 -8.8', '', 1],
  x: [9, 'M0 -1C1.6 -2 2 -8.6 3 -9.6L7 -1C7.6 -0.4 8.4 -1 9 -1', 'M7.4 -9.6L2.4 -0.4'],
  y: [9.6, 'M0 -1C1.2 -1.6 1.6 -6 1.8 -9.6L1.8 -3.6C1.8 -1 3 0 4.6 0C6.2 0 7.4 -1.4 7.6 -4L7.6 -9.8L7.6 4.4C7.6 9 5.6 9.6 4.2 9.6C2 9.6 1.4 7.6 2.8 6C4.6 4 7.4 1.6 9.6 -1'],
  z: [8.8, 'M0 -1C1 -2 1.4 -9.6 2.6 -9.6L7.4 -9.6L1.6 -0.2L6 -0.2C7 -0.2 7.8 -1 8.8 -1'],
  '!': [4, 'M2 -16L2 -4.4', 'M2 -0.6L2.1 -0.7', 1],
  '.': [3.6, 'M1.8 -0.6L1.9 -0.7', '', 1],
};

/**
 * Acentos do português, centrados em x = 0 (depois vão para o centro da vogal).
 * As chaves são as marcas combinantes do Unicode: o NFD separa "õ" em "o" + til.
 */
const MARKS: Record<string, string> = {
  '̀': 'M-1.4 -16.6L1 -13.2', // grave (à)
  '́': 'M-1 -13.2L1.4 -16.6', // agudo (á, é, í, ó, ú)
  '̂': 'M-2.4 -13.2L0 -16.4L2.4 -13.2', // circunflexo (â, ê, ô)
  '̃': 'M-3 -14.2C-2 -16.8 -1 -16.8 0 -15.4C1 -14 2 -14 3 -16.6', // til (ã, õ)
  '̈': 'M-1.8 -14.8L-1.7 -14.9M1.8 -14.8L1.9 -14.9', // trema (ü)
  '̧': 'M0 0.6C0.6 2 2.6 2.4 2.2 4.2C1.8 5.8 -0.4 5.6 -1.2 4.8', // cedilha (ç)
};

/** Centro de cada letra (em x, antes de esticar), onde o acento fica. */
const MARK_X: Record<string, number> = { a: 4.4, c: 4.3, e: 4.6, i: 2.3, o: 4.3, u: 4.7 };

/** Esticamento horizontal da letra, espaço entre letras e entre palavras. */
const SX = 1.22;
const TRACK = 1;
const WORD_GAP = 6;
/** Distância entre as linhas de base e o recuo de cada linha seguinte, como numa assinatura. */
const LINE_GAP = 27;
const INDENT = 14;

/** Espessura do traço, inclinação da letra (graus) e onde a borda do painel corta a última linha. */
export const STROKE = 3.3;
export const SKEW = 9;
export const SLANT = Math.tan((SKEW * Math.PI) / 180);
export const CUT = -1.2;

const NUM = /-?\d*\.?\d+/g;

/** Estica (sx) e desloca os x de um path absoluto M/L/C, e desloca os y. */
const place = (d: string, dx: number, dy: number, sx = SX): string => {
  let k = 0;
  return d.replace(NUM, (n) => String(round(k++ % 2 === 0 ? +n * sx + dx : +n + dy)));
};

/** Os y de um path (os números nas posições ímpares). */
const ysOf = (d: string): number[] => (d.match(NUM) ?? []).map(Number).filter((_, i) => i % 2 === 1);

/** Comprimento aproximado de um path absoluto M/L/C; cada curva vira 16 segmentos. */
const pathLength = (d: string): number => {
  const tokens = d.match(/[MLC]|-?\d*\.?\d+/g) ?? [];
  let len = 0;
  let x = 0;
  let y = 0;
  let cmd = 'M';
  let i = 0;
  const next = () => Number(tokens[i++]);
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === 'M' || token === 'L' || token === 'C') {
      cmd = token;
      i++;
    } else if (cmd === 'C') {
      const [x1, y1, x2, y2, x3, y3] = [next(), next(), next(), next(), next(), next()];
      let px = x;
      let py = y;
      for (let k = 1; k <= 16; k++) {
        const s = k / 16;
        const u = 1 - s;
        const qx = u * u * u * x + 3 * u * u * s * x1 + 3 * u * s * s * x2 + s * s * s * x3;
        const qy = u * u * u * y + 3 * u * u * s * y1 + 3 * u * s * s * y2 + s * s * s * y3;
        len += Math.hypot(qx - px, qy - py);
        px = qx;
        py = qy;
      }
      x = x3;
      y = y3;
    } else {
      const nx = next();
      const ny = next();
      if (cmd === 'L') len += Math.hypot(nx - x, ny - y);
      else cmd = 'L'; // pares depois do M são retas
      x = nx;
      y = ny;
    }
  }
  return len;
};

/** Cada letra com os acentos que vêm logo depois dela. */
const clusters = (text: string) => {
  const out: { ch: string; marks: string[] }[] = [];
  for (const c of text.normalize('NFD').toLowerCase()) {
    if (c >= '̀' && c <= 'ͯ') out[out.length - 1]?.marks.push(c);
    else out.push({ ch: c, marks: [] });
  }
  return out;
};

/** Um traço contínuo (vira um <path>): só termina onde a caneta levanta. */
export type ScriptStroke = { d: string; len: number; line: number };

/** Cada letra: onde está, o alto dela, a linha e o trecho do traço (em comprimento) que a desenha. */
export type ScriptBox = { x0: number; x1: number; top: number; line: number; stroke: number; from: number; to: number };

export type ScriptLine = { x0: number; x1: number; base: number; top: number };

export type ScriptWord = {
  strokes: ScriptStroke[];
  /** Pingos do i, cortes do t e acentos: desenhados no fim, com a caneta levantada. */
  marks: string[];
  boxes: ScriptBox[];
  lines: ScriptLine[];
  width: number;
  top: number;
  bottom: number;
};

/**
 * Monta o letreiro, uma linha por item: a última fica na base (y = 0), as de cima a LINE_GAP uma da outra,
 * e cada linha seguinte com um recuo maior. Maiúsculas viram minúsculas, os acentos do português viram
 * traços extras e qualquer caractere fora do alfabeto vira espaço.
 */
export const layoutScript = (rows: readonly string[]): ScriptWord => {
  const strokes: ScriptStroke[] = [];
  const marks: string[] = [];
  const boxes: ScriptBox[] = [];
  const lines: ScriptLine[] = [];
  let top = 0;
  let bottom = 0;
  let width = 0;

  rows.forEach((row, r) => {
    const line = lines.length;
    const base = -(rows.length - 1 - r) * LINE_GAP;
    const x0 = r * INDENT;
    let x = x0;
    let lift = true;
    let lineTop = base;
    let current: ScriptStroke | undefined;

    for (const { ch, marks: accents } of clusters(String(row ?? ''))) {
      const glyph = SCRIPT[ch];
      if (!glyph) {
        if (x > x0) x += WORD_GAP;
        lift = true;
        continue;
      }
      const [advance, main, extra, liftsAfter] = glyph;
      const d = place(main, x, base);
      const len = pathLength(d);
      let from = 0;
      // "!" e "." não começam na linha de emenda: a caneta levanta antes deles.
      if (lift || !current || !main.startsWith('M0 -1')) {
        current = { d, len, line };
        strokes.push(current);
      } else {
        from = current.len + TRACK;
        current.d += `L${d.slice(1)}`;
        current.len = from + len;
      }

      const ys = ysOf(main);
      // No "í" o acento toma o lugar do pingo.
      if (extra && !(accents.length && (ch === 'i' || ch === 'j'))) {
        marks.push(place(extra, x, base));
        ys.push(...ysOf(extra));
      }
      for (const accent of accents) {
        const mark = MARKS[accent];
        if (!mark) continue;
        const local = place(mark, MARK_X[ch] ?? advance * 0.45, 0, 1);
        marks.push(place(local, x, base));
        ys.push(...ysOf(local));
      }

      const letterTop = base + Math.min(...ys);
      lineTop = Math.min(lineTop, letterTop);
      top = Math.min(top, letterTop);
      bottom = Math.max(bottom, base + Math.max(...ys));
      boxes.push({
        x0: round(x),
        x1: round(x + advance * SX),
        top: round(letterTop),
        line,
        stroke: strokes.length - 1,
        from: round(from),
        to: round(current.len),
      });
      lift = Boolean(liftsAfter);
      x += advance * SX + TRACK;
    }

    if (x > x0) {
      lines.push({ x0, x1: round(x - TRACK), base, top: round(lineTop) });
      width = Math.max(width, x - TRACK);
    }
  });

  return { strokes, marks, boxes, lines, width: round(width), top: round(top), bottom: round(bottom) };
};

export type Timed = { d: string; at: number; dur: number };

/**
 * Linha do tempo da caneta, em segundos a partir de `start`. Os traços saem em ordem, numa velocidade constante
 * (`speed` unidades por segundo, no máximo `maxDuration` para o letreiro inteiro), com uma pausa curta onde a
 * caneta levanta e uma maior na troca de linha; depois vêm os pingos e acentos.
 * `boxAt` é quando a caneta passa no meio de cada letra: a hora de o adesivo em cima dela cair.
 */
export const penTimeline = (word: ScriptWord, start: number, speed: number, maxDuration: number) => {
  const total = word.strokes.reduce((sum, s) => sum + s.len, 0) || 1;
  const rate = Math.min(total / speed, maxDuration) / total;
  let t = start;
  const strokes: Timed[] = word.strokes.map((s, i) => {
    if (i > 0) t += s.line !== word.strokes[i - 1].line ? 0.22 : 0.06;
    const at = t;
    t += s.len * rate;
    return { d: s.d, at: round(at), dur: round(Math.max(s.len * rate, 0.05)) };
  });
  const marks: Timed[] = word.marks.map((d, i) => ({ d, at: round(t + 0.1 + i * 0.14), dur: 0.26 }));
  const boxAt = word.boxes.map((b) => round(strokes[b.stroke].at + ((b.from + b.to) / 2) * rate));
  return { strokes, marks, boxAt };
};

export type Spot = { x: number; y: number; size: number; rotate: number; box: number };

/**
 * Onde os n adesivos caem, em unidades do alfabeto. Eles se dividem entre as linhas na proporção da largura
 * de cada uma e ficam espaçados por igual, cada um pousado no alto da letra embaixo (cobrindo só o topo dela,
 * para o nome continuar legível), com tamanho e giro sorteados de forma fixa. `box` é a letra embaixo do adesivo.
 */
export const stickerSpots = (word: ScriptWord, n: number, seed = 0): Spot[] => {
  const count = Math.max(0, Math.floor(n) || 0);
  const widths = word.lines.map((l) => l.x1 - l.x0);
  const total = widths.reduce((a, b) => a + b, 0);
  if (!count || !total) return [];

  // Quantos em cada linha: a parte inteira da proporção e, para o que sobra, os maiores restos.
  const share = widths.map((w) => (w / total) * count);
  const per = share.map((s) => Math.floor(s));
  let left = count - per.reduce((a, b) => a + b, 0);
  share
    .map((s, i) => ({ i, rest: s - per[i] }))
    .sort((a, b) => b.rest - a.rest)
    .forEach(({ i }) => {
      if (left-- > 0) per[i]++;
    });

  const spots: Spot[] = [];
  word.lines.forEach((ln, li) => {
    const inLine = word.boxes.map((b, k) => ({ b, k })).filter(({ b }) => b.line === li);
    for (let j = 0; j < per[li]; j++) {
      const i = spots.length;
      const x = ln.x0 + ((j + 0.5) / per[li]) * (ln.x1 - ln.x0);
      const hit = inLine.find(({ b }) => x >= b.x0 && x <= b.x1 + TRACK) ?? inLine[inLine.length - 1];
      const lift = [-1, -5, -2.5, -6.5, -1.5, -4, -3][i % 7];
      spots.push({
        x: round(x + (hash(i * 4.1 + seed) - 0.5) * 3),
        y: round(clamp(hit.b.top + lift, ln.top - 4, ln.base - 4)),
        size: round(12 + hash(i * 2.3 + seed + 1) * 3.5),
        rotate: round((hash(i * 7.7 + seed + 2) - 0.5) * 30),
        box: hit.k,
      });
    }
  });
  return spots;
};
