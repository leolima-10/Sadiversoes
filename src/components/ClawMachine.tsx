import { hero } from '../content';
import './ClawMachine.css';

export type BearFill = 'fill-pink' | 'fill-sky' | 'fill-honey';

/**
 * Cabeça de urso genérica (não é o urso do logo). Centro em (0,0), raio ~22.
 * Também desenha os ursos dos adesivos do rodapé (StickerArt.tsx). Sem ids: pode repetir na página.
 */
export function BearHead({ fill, x = 0, y = 0, scale = 1 }: { fill: BearFill; x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx={-16} cy={-16} r={9} className={fill} />
      <circle cx={16} cy={-16} r={9} className={fill} />
      <circle cx={-16} cy={-16} r={4.5} className="fill-chip opacity-70" />
      <circle cx={16} cy={-16} r={4.5} className="fill-chip opacity-70" />
      <circle r={22} className={fill} />
      <ellipse cx={0} cy={8} rx={10.5} ry={7.5} className="fill-chip" />
      <ellipse cx={0} cy={5} rx={3.6} ry={2.6} className="fill-on-sun" />
      <path d="M0 7.5v3" className="stroke-on-sun" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={-8} cy={-4} r={2.7} className="fill-on-sun" />
      <circle cx={8} cy={-4} r={2.7} className="fill-on-sun" />
    </g>
  );
}

function Ball({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className={fill} />
      <path
        d={`M${x - r * 0.55} ${y - r * 0.2}a${r * 0.6} ${r * 0.6} 0 0 1 ${r * 0.5} -${r * 0.4}`}
        className="stroke-chip opacity-70"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/** Estrela do letreiro da máquina (também na ficha dos adesivos do rodapé). */
export const STAR = 'M0-10C.4-3 3-.4 10 0 3 .4.4 3 0 10-.4 3-3 .4-10 0-3-.4-.4-3 0-10Z';

/**
 * Máquina de garra em SVG. A garra desce, pega um prêmio, leva até a saída e volta (9s, em loop).
 * Com prefers-reduced-motion, fica parada (ver ClawMachine.css).
 */
export function ClawMachine() {
  return (
    <svg
      viewBox="0 0 400 548"
      role="img"
      aria-label={hero.machineLabel}
      className="claw-anim h-auto w-full"
    >
      <defs>
        <clipPath id="claw-glass">
          <rect x={64} y={124} width={272} height={248} rx={16} />
        </clipPath>
        {/* Usado dentro do grupo que anda na horizontal: só o corte vertical importa. */}
        <clipPath id="claw-cable">
          <rect x={-400} y={146} width={800} height={226} />
        </clipPath>
      </defs>

      {/* Pés e sombra no chão */}
      <ellipse cx={200} cy={540} rx={150} ry={8} className="fill-ink opacity-15" />
      <rect x={70} y={516} width={40} height={22} rx={8} className="fill-on-sun" />
      <rect x={290} y={516} width={40} height={22} rx={8} className="fill-on-sun" />

      {/* Corpo */}
      <rect x={40} y={24} width={320} height={500} rx={32} className="fill-navy" />

      {/* Letreiro */}
      <rect x={56} y={40} width={288} height={72} rx={20} className="fill-sun" />
      <path d={STAR} transform="translate(200 76) scale(2)" className="fill-navy" />

      {/* Vitrine */}
      <rect x={64} y={124} width={272} height={248} rx={16} className="fill-surface" />

      <g clipPath="url(#claw-glass)">
        {/* Pilha de prêmios */}
        <Ball x={176} y={360} r={16} fill="fill-sun" />
        <BearHead fill="fill-sky" x={206} y={348} />
        <BearHead fill="fill-honey" x={314} y={344} />
        <Ball x={292} y={364} r={14} fill="fill-sky" />
        <BearHead fill="fill-honey" x={238} y={366} scale={0.85} />
        <Ball x={322} y={372} r={12} fill="fill-sun" />

        {/* Prêmio que a garra pega */}
        <g className="prize">
          <BearHead fill="fill-pink" x={260} y={330} />
        </g>

        {/* Saída de prêmios (caixa de acrílico) */}
        <rect x={76} y={292} width={72} height={84} rx={8} className="fill-sky opacity-30" />
        <rect
          x={76}
          y={292}
          width={72}
          height={84}
          rx={8}
          className="fill-none stroke-sky"
          strokeWidth={3}
        />

        {/* Trilho */}
        <rect x={64} y={136} width={272} height={8} className="fill-ink opacity-70" />

        {/* Garra */}
        <g className="claw-x">
          <g transform="translate(110 0)">
            <g clipPath="url(#claw-cable)">
              <g className="claw-y">
                <rect x={-1.5} y={-60} width={3} height={228} className="fill-ink" />
                <g transform="translate(0 168)">
                  <g className="finger-l">
                    <path
                      d="M-8 10L-22 32Q-26 44-13 52"
                      className="fill-none stroke-ink"
                      strokeWidth={6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <g className="finger-r">
                    <path
                      d="M8 10L22 32Q26 44 13 52"
                      className="fill-none stroke-ink"
                      strokeWidth={6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <rect x={-15} y={-6} width={30} height={18} rx={7} className="fill-navy" />
                  <circle cx={0} cy={13} r={5} className="fill-ink" />
                </g>
              </g>
            </g>
            <rect x={-18} y={131} width={36} height={18} rx={9} className="fill-navy" />
            <circle cx={0} cy={140} r={3.5} className="fill-chip" />
          </g>
        </g>

        {/* Reflexos do vidro */}
        <path d="M250 124L290 124L180 372L140 372Z" className="fill-chip opacity-20" />
        <path d="M304 124L318 124L208 372L194 372Z" className="fill-chip opacity-20" />
      </g>

      {/* Painel de controle */}
      <rect x={56} y={386} width={288} height={52} rx={16} className="fill-sun" />
      <rect x={96} y={404} width={56} height={16} rx={8} className="fill-on-sun opacity-80" />
      <rect x={208} y={402} width={8} height={22} rx={4} className="fill-on-sun" />
      <circle cx={212} cy={402} r={10} className="fill-navy" />
      <circle cx={262} cy={412} r={12} className="fill-navy" />
      <circle cx={298} cy={412} r={12} className="fill-chip stroke-on-sun" strokeWidth={3} />

      {/* Porta de prêmios e moedeiro */}
      <rect x={72} y={452} width={110} height={52} rx={14} className="fill-on-sun" />
      <rect x={72} y={452} width={110} height={52} rx={14} className="fill-none stroke-sun" strokeWidth={3} />
      <rect x={232} y={452} width={96} height={52} rx={14} className="fill-sun" />
      <rect x={276} y={464} width={8} height={28} rx={4} className="fill-on-sun" />
    </svg>
  );
}
