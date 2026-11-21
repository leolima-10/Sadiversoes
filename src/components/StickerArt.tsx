import { useId, type ReactNode } from 'react';
import type { FooterSticker } from '../content';
import { BearHead, STAR, type BearFill } from './ClawMachine';

const BEAR_FILL: Record<'honey' | 'pink' | 'sky', BearFill> = {
  honey: 'fill-honey',
  pink: 'fill-pink',
  sky: 'fill-sky',
};

/** Silhueta (vira o recorte claro em volta do adesivo) e desenho por cima, numa caixa de 120 × 120. */
function drawing(sticker: FooterSticker): { shape: ReactNode; art: ReactNode } {
  switch (sticker.kind) {
    case 'bear':
      // A mesma cabeça de urso dos prêmios da máquina do hero, 1,95× maior.
      return {
        shape: (
          <>
            <circle cx={28.8} cy={32.8} r={17.6} />
            <circle cx={91.2} cy={32.8} r={17.6} />
            <circle cx={60} cy={64} r={42.9} />
          </>
        ),
        art: <BearHead fill={BEAR_FILL[sticker.color]} x={60} y={64} scale={1.95} />,
      };
    case 'token':
      // Ficha de fliperama com a estrela do letreiro da máquina.
      return {
        shape: <circle cx={60} cy={60} r={50} />,
        art: (
          <>
            <circle cx={60} cy={60} r={50} className="fill-sun" />
            <circle
              cx={60}
              cy={60}
              r={41}
              className="fill-none stroke-on-sun"
              strokeWidth={3.5}
              strokeDasharray="0.5 8"
              strokeLinecap="round"
              opacity={0.45}
            />
            <path d={STAR} transform="translate(60 60) scale(3)" className="fill-navy" />
            <path d="M27 47A34 34 0 0 1 45 27" className="fill-none stroke-chip" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
          </>
        ),
      };
    case 'joystick':
      // Alavanca do painel de controle da máquina: base amarela, haste e bola azul.
      return {
        shape: (
          <>
            <rect x={12} y={76} width={96} height={32} rx={16} />
            <rect x={54} y={40} width={12} height={46} rx={6} />
            <circle cx={60} cy={36} r={24} />
          </>
        ),
        art: (
          <>
            <rect x={12} y={76} width={96} height={32} rx={16} className="fill-sun" />
            <circle cx={30} cy={92} r={7} className="fill-chip stroke-on-sun" strokeWidth={3} />
            <circle cx={90} cy={92} r={7.5} className="fill-navy" />
            <ellipse cx={60} cy={84} rx={13} ry={4.5} className="fill-on-sun" opacity={0.3} />
            <rect x={54} y={40} width={12} height={46} rx={6} className="fill-on-sun" />
            <circle cx={60} cy={36} r={24} className="fill-navy" />
            <path d="M46 30A15 15 0 0 1 56 19" className="fill-none stroke-chip" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
          </>
        ),
      };
  }
}

/** Adesivo recortado: borda clara em volta da silhueta, o desenho e um brilho que passa no hover. */
export function StickerArt({ sticker }: { sticker: FooterSticker }) {
  const id = `st${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { shape, art } = drawing(sticker);
  return (
    <svg viewBox="-6 -6 132 132" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}c`}>{shape}</clipPath>
        <linearGradient id={`${id}g`} x1="0" x2="1" y1="0" y2="0">
          <stop offset=".35" className="st-shine" stopOpacity="0" />
          <stop offset=".5" className="st-shine" stopOpacity=".55" />
          <stop offset=".65" className="st-shine" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="fill-chip stroke-chip" strokeWidth={11} strokeLinejoin="round">
        {shape}
      </g>
      {art}
      <g clipPath={`url(#${id}c)`}>
        <g transform="rotate(20 60 60)">
          <rect className="st-sheen" x={-30} y={-30} width={180} height={180} fill={`url(#${id}g)`} />
        </g>
      </g>
    </svg>
  );
}

const FINGERS = {
  l: 'M-8 10L-22 32Q-26 44-13 52',
  r: 'M8 10L22 32Q26 44 13 52',
} as const;

/**
 * Garrinha que pega o adesivo: o mesmo desenho da garra da máquina do hero (cabo, cabeça e dois dedos),
 * em amarelo com contorno escuro para aparecer no painel azul nos dois temas.
 */
export function Claw() {
  return (
    <span className="st-claw" aria-hidden="true">
      <svg viewBox="-27 -8 54 64" focusable="false">
        <rect x={-1.5} y={-4000} width={3} height={3996} className="st-cable" />
        {(['l', 'r'] as const).map((side) => (
          <g key={side} className={`st-finger st-finger-${side}`}>
            <path d={FINGERS[side]} className="st-finger-edge" />
            <path d={FINGERS[side]} className="st-finger-core" />
          </g>
        ))}
        <rect x={-15} y={-6} width={30} height={18} rx={7} className="st-claw-head" />
        <circle cx={0} cy={13} r={5} className="st-claw-pivot" />
      </svg>
    </span>
  );
}
