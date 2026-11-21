import type { ReactNode } from 'react';
import { forPlayers } from '../content';
import { BearHead } from './ClawMachine';
import { InstagramButton } from './ui';

/**
 * Quero jogar (público secundário): faixa azul com um painel de máquina de garra.
 * Cada passo é uma peça do painel: vitrine com pelúcias, joystick e botão.
 *
 * O painel é um objeto físico, não segue o tema: as cores dele são fixas (como a máquina do hero).
 * Só a cor dos ursos e da bola do joystick vem dos tokens de ilustração.
 */

const PANEL = '#11183a';
const PANEL_DARK = '#0c1130';
const TILE = '#1a2150';
const CREAM = '#fff9e8';
const SOFT = '#c9d3f7';

/** Moldura comum das três ilustrações: 188 × 150. */
function Tile({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="w-[120px] shrink-0 overflow-hidden rounded-[20px] sm:w-full" style={{ background: TILE }}>
      <svg viewBox="0 0 188 150" className="block h-auto w-full">
        {children}
      </svg>
    </div>
  );
}

/** Passo 1: a vitrine com três pelúcias e um aro tracejado na escolhida. */
function ShowcaseArt() {
  return (
    <Tile>
      <rect x={24} y={22} width={140} height={106} rx={14} fill={CREAM} stroke="#fff" strokeWidth={3} />
      <path d="M24 44V36a14 14 0 0 1 14-14h112a14 14 0 0 1 14 14v8z" className="fill-sun" />
      <BearHead fill="fill-pink" x={58} y={92} scale={0.95} />
      <BearHead fill="fill-sky" x={100} y={96} scale={1.05} />
      <BearHead fill="fill-honey" x={138} y={96} scale={0.9} />
      <circle
        cx={100}
        cy={96}
        r={34}
        fill="none"
        stroke="#1b3a8c"
        strokeWidth={3}
        strokeDasharray="3 7"
        strokeLinecap="round"
      />
    </Tile>
  );
}

/** Passo 2: o joystick, com setas amarelas nas quatro direções. */
function JoystickArt() {
  return (
    <Tile>
      <rect x={44} y={104} width={100} height={28} rx={10} fill={CREAM} stroke="#fff" strokeWidth={3} />
      <ellipse cx={94} cy={104} rx={24} ry={7} fill={SOFT} />
      <rect x={89} y={52} width={10} height={54} rx={4} fill={SOFT} />
      <circle cx={94} cy={44} r={23} className="fill-cap-red" stroke="#fff" strokeWidth={3} />
      <path d="M81 38a14 14 0 0 1 10-9" stroke="#fff" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.75} />
      <g className="fill-sun">
        <path d="M40 54l-14 9 14 9z" />
        <path d="M148 54l14 9-14 9z" />
        <path d="M94 6l9 11H85z" />
      </g>
    </Tile>
  );
}

/** Passo 3: o botão grande, com riscos de "toque" em cima. */
function ButtonArt() {
  return (
    <Tile>
      <ellipse cx={94} cy={104} rx={58} ry={18} fill={PANEL_DARK} />
      <rect x={36} y={88} width={116} height={16} fill={PANEL_DARK} />
      <ellipse cx={94} cy={88} rx={58} ry={18} fill={CREAM} />
      <ellipse cx={94} cy={80} rx={46} ry={14} fill="#e0a800" />
      <rect x={48} y={52} width={92} height={28} fill="#e0a800" />
      <ellipse cx={94} cy={52} rx={46} ry={14} className="fill-sun" />
      <path d="M68 52a30 9 0 0 1 22-6" stroke="#fff" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.7} />
      <path d="M94 14v12M62 22l7 9M126 22l-7 9" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />
    </Tile>
  );
}

const arts = [ShowcaseArt, JoystickArt, ButtonArt];

/** Fileira de luzes do letreiro do painel: pontos amarelos grandes com pontos creme entre eles. */
function Lights() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-between px-5 py-4 sm:px-7"
      style={{ background: TILE }}
    >
      {Array.from({ length: 23 }, (_, i) =>
        i % 2 === 0 ? (
          <span key={i} className="h-2.5 w-2.5 rounded-pill bg-sun" />
        ) : (
          <span key={i} className="h-1.5 w-1.5 rounded-pill opacity-90" style={{ background: CREAM }} />
        ),
      )}
    </div>
  );
}

export function ForPlayers() {
  return (
    <section id="quero-jogar" aria-labelledby="quero-jogar-title" className="band-navy py-16 md:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[440px_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow">{forPlayers.eyebrow}</p>
          <h2 id="quero-jogar-title" className="mt-5 text-h1 font-extrabold tracking-[-0.035em]">
            {forPlayers.title}
          </h2>
          <p className="mt-5 text-body-lg text-on-navy/90">{forPlayers.intro}</p>
          <InstagramButton className="btn-sun mt-8">{forPlayers.panelCta}</InstagramButton>
        </div>

        <div
          className="mb-3 overflow-hidden rounded-[36px] border-[3px]"
          style={{ background: PANEL, borderColor: PANEL_DARK, boxShadow: `0 12px 0 ${PANEL_DARK}` }}
        >
          <Lights />
          <ol className="grid gap-6 px-5 pb-9 pt-8 sm:grid-cols-3 sm:gap-4">
            {forPlayers.steps.map((step, i) => {
              const Art = arts[i % arts.length];
              return (
                <li key={step.title} className="flex items-center gap-4 sm:flex-col sm:items-stretch">
                  <Art />
                  <div className="flex flex-col gap-1.5">
                    <span className="text-caption font-bold tracking-[0.12em] text-sun">
                      <span className="sr-only">{forPlayers.stepLabel} </span>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-[21px] font-extrabold leading-[26px] tracking-[-0.015em]" style={{ color: CREAM }}>
                      {step.title}
                    </h3>
                    <p className="text-[15px] leading-[23px]" style={{ color: SOFT }}>
                      {step.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
