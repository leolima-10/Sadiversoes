/**
 * Contas pequenas e determinísticas para os desenhos do rodapé: todo render desenha igual.
 */

/** Número "sorteado" fixo em [0, 1) a partir de uma semente. */
export const hash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Arredonda para duas casas (paths SVG mais curtos). */
export const round = (v: number): number => Math.round(v * 100) / 100;

/** Prende v entre lo e hi; NaN e infinito viram lo. */
export const clamp = (v: number, lo: number, hi: number): number =>
  Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : lo;

/**
 * Estrela fechada, centrada em (0, 0), com `points` pontas alternando os dois raios.
 * `wobble` deixa as pontas desiguais, como um recorte feito à mão.
 */
export const starPath = (points: number, outer: number, inner: number, wobble = 0, seed = 0): string => {
  const n = Math.max(3, Math.floor(points) || 3);
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? inner : outer * (1 + (hash(i * 9.7 + seed) - 0.5) * wobble);
    pts.push(`${round(Math.cos(a) * r)} ${round(Math.sin(a) * r)}`);
  }
  return `M${pts.join('L')}Z`;
};
