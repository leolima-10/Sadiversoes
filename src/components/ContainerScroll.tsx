import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { LazyMotion, m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';

const loadMotionFeatures = () => import('../lib/motion-features').then((mod) => mod.default);

/**
 * Cartão que começa inclinado e fica reto conforme a página rola, com o título subindo um pouco.
 * Adaptado do ContainerScroll da Aceternity para os tokens da marca.
 * Com prefers-reduced-motion, tudo fica parado: cartão reto, título no lugar.
 */

const MOBILE_QUERY = '(max-width: 768px)';

/** Lê a media query já no primeiro render (não há SSR), para o celular não começar com a escala do desktop. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(query.matches);
    onChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

/** Distância mínima de scroll para o efeito: em telas altas o cartão já aparece inteiro logo no início. */
const MIN_DISTANCE = 450;

/**
 * Até onde (em px de scroll da página) o efeito vai: o ponto em que o fim do cartão chega ao fim da tela,
 * ou seja, o cartão aparece inteiro. Remede quando o bloco muda de tamanho (troca de fonte, largura) e
 * quando a janela muda de altura.
 */
function useScrollEnd(ref: RefObject<HTMLDivElement>) {
  const [end, setEnd] = useState(MIN_DISTANCE);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // A raiz não é transformada (só os filhos), então a caixa dela é a posição real no layout.
    const measure = () => {
      const bottom = el.getBoundingClientRect().bottom + window.scrollY;
      setEnd(Math.max(Math.round(bottom - window.innerHeight), MIN_DISTANCE));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [ref]);

  return end;
}

export function ContainerScroll({ titleComponent, children }: { titleComponent: ReactNode; children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const end = useScrollEnd(containerRef);

  // Scroll da página em px: o hero é a primeira seção, então o efeito começa no primeiro movimento (0)
  // e termina quando o cartão aparece inteiro (end).
  const { scrollY } = useScroll();

  const rotate = useTransform(scrollY, [0, end], reduceMotion ? [0, 0] : [20, 0]);
  const scale = useTransform(scrollY, [0, end], reduceMotion ? [1, 1] : isMobile ? [0.85, 1] : [1.05, 1]);
  const translate = useTransform(scrollY, [0, end], reduceMotion ? [0, 0] : [0, -100]);

  return (
    // LazyMotion + m: o renderizador do framer-motion (domMin) chega num arquivo à parte, fora do JS inicial.
    <LazyMotion features={loadMotionFeatures} strict>
      <div ref={containerRef} className="relative" style={{ perspective: '1000px' }}>
        <ScrollTitle translate={translate}>{titleComponent}</ScrollTitle>
        <ScrollCard rotate={rotate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </LazyMotion>
  );
}

function ScrollTitle({ translate, children }: { translate: MotionValue<number>; children: ReactNode }) {
  return (
    <m.div style={{ translateY: translate }} className="mx-auto max-w-[760px] text-center">
      {children}
    </m.div>
  );
}

function ScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    // mt positivo: o cartão nunca cobre os botões do título (um elemento transformado por cima roubaria o toque).
    <m.div
      style={{ rotateX: rotate, scale }}
      className="mx-auto mt-10 w-full max-w-[400px] rounded-lg bg-navy p-3 shadow-lift sm:p-4 md:mt-14 lg:max-w-[480px]"
    >
      <div className="overflow-hidden rounded-md bg-surface-alt">{children}</div>
    </m.div>
  );
}
