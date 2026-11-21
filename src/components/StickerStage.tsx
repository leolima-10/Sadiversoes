import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { footer } from '../content';
import { CUT, SKEW, SLANT, STROKE, layoutScript, penTimeline, stickerSpots } from '../lib/script';
import { clamp, round } from '../lib/shapes';
import { Claw, StickerArt } from './StickerArt';
import './StickerStage.css';

/**
 * Letreiro do rodapé: o nome escrito à mão em traço de marcador, com a última linha cortada pela borda do painel,
 * e os adesivos de urso por cima. Este arquivo é carregado sob demanda (React.lazy no Footer).
 * - Quando 40% do letreiro aparece, ele se escreve e cada adesivo cai quando a caneta passa embaixo dele.
 * - Mouse ou caneta arrastam: a garra desce, pega e carrega o adesivo. Clique, toque ou Enter: a garra tenta pegar
 *   e o urso escapa. Setas movem; Home e Esc devolvem ao lugar. Clicar no letreiro escreve de novo e devolve tudo.
 * - Toque não arrasta: o dedo sobre um adesivo continua rolando a página (como o globo do formulário).
 * - Com movimento reduzido nada anima; arrastar e as setas continuam funcionando.
 */

// Tudo o que depende só do texto é calculado uma vez, quando este arquivo carrega.
const WORD = layoutScript(footer.wordmark);
const PAD = STROKE / 2 + 0.6;
const VB_X = -1.4 - PAD;
const VB_Y = WORD.top - PAD;
const VB_W = WORD.width + 2.8 + PAD * 2 - WORD.top * SLANT;
const VB_H = WORD.bottom + PAD - VB_Y;
/** Altura que aparece: do alto do letreiro até a borda do painel. O resto do desenho fica cortado. */
const CUT_H = CUT - VB_Y;
const PEN = penTimeline(WORD, 0.15, 260, 2.4);

/** Ponto do alfabeto → % da caixa visível do letreiro (contando a inclinação da letra). */
const toPct = (x: number, y: number) => ({
  x: round(((x - y * SLANT - VB_X) / VB_W) * 100),
  y: round(((y - VB_Y) / CUT_H) * 100),
});

const STICKERS = stickerSpots(WORD, footer.stickers.length, 3).map((spot, i) => ({
  i,
  sticker: footer.stickers[i],
  home: toPct(spot.x, spot.y),
  /** Largura em % do letreiro. */
  size: round((spot.size / VB_W) * 100),
  rotate: spot.rotate,
  /** Cai quando a caneta passa embaixo dele. */
  delay: round(PEN.boxAt[spot.box] + 0.04),
}));

type Placed = { x: number; y: number };

type Drag = {
  i: number;
  id: number;
  /** Posição inicial (%), ponto inicial e último x do ponteiro, para a inclinação pela velocidade. */
  sx: number;
  sy: number;
  px: number;
  py: number;
  lx: number;
  t: number;
  tilt: number;
  w: number;
  h: number;
  went: boolean;
};

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** "Tum": o adesivo achata ao bater e volta. */
const THUD: Keyframe[] = [
  { transform: 'scale(1.1)' },
  { transform: 'scale(.94, 1.05)', offset: 0.4 },
  { transform: 'scale(1.02, .98)', offset: 0.7 },
  { transform: 'none' },
];

function thud(el: Element | null) {
  if (!reducedMotion()) el?.animate(THUD, { duration: 420, easing: 'cubic-bezier(.3,1.4,.4,1)' });
}

/** Dedos da garra na tentativa: abertos, fecham quando ela chega e abrem para soltar. */
const grip = (open: number): Keyframe[] => [
  { offset: 0, transform: `rotate(${open}deg)` },
  { offset: 0.2, transform: `rotate(${open}deg)`, easing: 'cubic-bezier(.3,0,.2,1)' },
  { offset: 0.32, transform: 'rotate(0deg)' },
  { offset: 0.62, transform: 'rotate(0deg)', easing: 'cubic-bezier(.3,0,.2,1)' },
  { offset: 0.7, transform: `rotate(${open}deg)` },
  { offset: 1, transform: `rotate(${open}deg)` },
];

/**
 * Uma tentativa de máquina de urso (1,1 s): a garra desce, fecha, puxa o adesivo um pouco e abre;
 * o adesivo escapa e cai de volta com um "tum". Devolve a animação do adesivo, para saber quando acaba.
 */
function tryToGrab(btn: HTMLButtonElement): Animation | undefined {
  const host = btn.parentElement;
  const claw = host?.querySelector('.st-claw');
  const lift = btn.querySelector('.st-lift');
  if (!host || !claw || !lift) return undefined;
  const timing: KeyframeAnimationOptions = { duration: 1100 };
  const up = `translateY(${-Math.round(btn.offsetWidth * 0.22)}px)`;
  claw.animate(
    [
      { offset: 0, opacity: 0, transform: 'translateY(-45%)', easing: 'cubic-bezier(.25,.8,.35,1)' },
      { offset: 0.2, opacity: 1, transform: 'translateY(0)' },
      { offset: 0.34, transform: 'translateY(0)', easing: 'cubic-bezier(.45,0,.3,1)' },
      { offset: 0.58, transform: up },
      { offset: 0.7, transform: up, easing: 'cubic-bezier(.5,0,.75,0)' },
      { offset: 0.88, opacity: 1 },
      { offset: 1, opacity: 0, transform: 'translateY(-45%)' },
    ],
    timing,
  );
  host.querySelector('.st-finger-l')?.animate(grip(24), timing);
  host.querySelector('.st-finger-r')?.animate(grip(-24), timing);
  return lift.animate(
    [
      { offset: 0, transform: 'translateY(0) scale(1, 1)' },
      { offset: 0.34, transform: 'translateY(0) scale(1, 1)', easing: 'cubic-bezier(.45,0,.3,1)' },
      { offset: 0.58, transform: `${up} scale(1, 1)` },
      { offset: 0.7, transform: `${up} scale(1, 1)`, easing: 'cubic-bezier(.55,0,.9,.45)' },
      { offset: 0.82, transform: 'translateY(0) scale(1.06, .92)' },
      { offset: 0.91, transform: 'translateY(0) scale(.98, 1.03)' },
      { offset: 1, transform: 'translateY(0) scale(1, 1)' },
    ],
    timing,
  );
}

export default function StickerStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const hintId = useId();
  const [on, setOn] = useState(false);
  const [run, setRun] = useState(0);
  const [moved, setMoved] = useState<Record<number, Placed>>({});
  const [order, setOrder] = useState<number[]>([]);
  const drag = useRef<Drag | null>(null);
  /** Depois de arrastar, o navegador ainda dispara um clique: ele não pode virar uma tentativa da garra. */
  const skipClick = useRef(false);
  /** Adesivos no meio de uma tentativa da garra. */
  const busy = useRef(new Set<number>());

  // Escreve uma vez, quando 40% do letreiro aparece na tela.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setOn(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setOn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // O comprimento real de cada traço vai em --l: o desenho anima o tracejado. Medido antes da pintura.
  useLayoutEffect(() => {
    rootRef.current?.querySelectorAll<SVGPathElement>('path[data-draw]').forEach((path) => {
      path.style.setProperty('--l', `${Math.ceil(path.getTotalLength()) + 1}px`);
    });
  }, [run]);

  const items = STICKERS.map((s) => ({ ...s, at: moved[s.i] ?? s.home }));

  const raise = (i: number) => setOrder((o) => [...o.filter((k) => k !== i), i]);
  const putAt = (i: number, p: Placed) => setMoved((m) => ({ ...m, [i]: p }));
  const goHome = (i: number, btn: HTMLElement) => {
    setMoved((m) => {
      const next = { ...m };
      delete next[i];
      return next;
    });
    thud(btn.querySelector('.st-lift'));
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>, i: number) => {
    skipClick.current = false;
    // Toque não arrasta: o dedo continua rolando a página. O toque vira clique (tentativa da garra).
    if (e.pointerType === 'touch' || e.button !== 0 || busy.current.has(i) || !boxRef.current) return;
    const box = boxRef.current.getBoundingClientRect();
    const at = items[i].at;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      i,
      id: e.pointerId,
      sx: at.x,
      sy: at.y,
      px: e.clientX,
      py: e.clientY,
      lx: e.clientX,
      t: performance.now(),
      tilt: 0,
      w: box.width,
      h: box.height,
      went: false,
    };
    raise(i);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.px;
    const dy = e.clientY - d.py;
    if (!d.went && Math.hypot(dx, dy) < 4) return;
    const host = e.currentTarget.parentElement;
    if (!host) return;
    // Daqui em diante o arrasto é direto no DOM (sem render a cada movimento); o estado só muda ao soltar.
    if (!d.went) host.classList.add('is-drag');
    d.went = true;
    host.style.left = `${clamp(d.sx + (dx / d.w) * 100, 1, 99)}%`;
    host.style.top = `${clamp(d.sy + (dy / d.h) * 100, -80, 96)}%`;
    // Pendurado na garra, balança com a velocidade do arrasto (suavizada).
    const now = performance.now();
    const v = (e.clientX - d.lx) / Math.max(1, now - d.t);
    d.tilt = d.tilt * 0.75 + clamp(v * 22, -24, 24) * 0.25;
    d.lx = e.clientX;
    d.t = now;
    host.style.setProperty('--tilt', `${d.tilt.toFixed(2)}deg`);
  };

  const onPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const host = e.currentTarget.parentElement;
    if (!d.went || !host) return;
    skipClick.current = true;
    host.classList.remove('is-drag');
    host.style.setProperty('--tilt', '0deg');
    putAt(d.i, { x: parseFloat(host.style.left), y: parseFloat(host.style.top) });
    thud(e.currentTarget.querySelector('.st-lift'));
  };

  const onClick = (i: number, btn: HTMLButtonElement) => {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    if (reducedMotion() || busy.current.has(i)) return;
    raise(i);
    const animation = tryToGrab(btn);
    if (!animation) return;
    busy.current.add(i);
    const done = () => busy.current.delete(i);
    animation.finished.then(done, done);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.shiftKey ? 6 : 2;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      const at = items[i].at;
      raise(i);
      putAt(i, { x: clamp(at.x + move[0], 1, 99), y: clamp(at.y + move[1], -80, 96) });
    } else if (e.key === 'Home' || e.key === 'Escape') {
      e.preventDefault();
      goHome(i, e.currentTarget);
    }
  };

  // Escreve de novo: o letreiro se redesenha e todos os adesivos voltam para o lugar, caindo outra vez.
  const replay = () => {
    setMoved({});
    setOrder([]);
    setRun((r) => r + 1);
  };

  const timed = (at: number, dur: number) => ({ '--at': `${at}s`, '--dur': `${dur}s` }) as CSSProperties;

  return (
    <div ref={rootRef} className={`wm-stage${on ? ' is-on' : ''}`} style={{ '--wm-ar': String(round(VB_W / CUT_H)) } as CSSProperties}>
      <div ref={boxRef} className="wm-in">
        <button type="button" className="wm-btn" onClick={replay} aria-label={footer.wordmarkLabel}>
          <svg
            key={run}
            className="wm"
            viewBox={[VB_X, VB_Y, VB_W, VB_H].map(round).join(' ')}
            aria-hidden="true"
            focusable="false"
          >
            <g transform={`skewX(${-SKEW})`}>
              {PEN.strokes.map((s, k) => (
                <path key={k} d={s.d} data-draw="" style={timed(s.at, s.dur)} />
              ))}
              {PEN.marks.map((s, k) => (
                <path key={`m${k}`} d={s.d} data-draw="" style={timed(s.at, s.dur)} />
              ))}
            </g>
          </svg>
        </button>

        <div className="st-layer" role="group" aria-label={footer.stickersLabel}>
          {items.map((s) => (
            <div
              key={s.i}
              className="st"
              style={
                {
                  left: `${s.at.x}%`,
                  top: `${s.at.y}%`,
                  width: `max(${s.size}cqw, 40px)`,
                  zIndex: 4 + order.indexOf(s.i),
                  '--r': `${s.rotate}deg`,
                  '--at': `${s.delay}s`,
                } as CSSProperties
              }
            >
              <Claw />
              <button
                type="button"
                className="st-btn"
                aria-label={s.sticker.label}
                aria-describedby={hintId}
                onPointerDown={(e) => onPointerDown(e, s.i)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={(e) => onClick(s.i, e.currentTarget)}
                onKeyDown={(e) => onKeyDown(e, s.i)}
              >
                <span key={run} className="st-slap">
                  <span className="st-lift">
                    <StickerArt sticker={s.sticker} />
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
        <p id={hintId} className="sr-only">
          {footer.stickerHint}
        </p>
      </div>
    </div>
  );
}
