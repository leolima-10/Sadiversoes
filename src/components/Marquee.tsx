import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type MarqueeProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Itens da lista: cada filho deve ser um `<li>`. */
  children: ReactNode;
  /** Pausa a rolagem com o mouse em cima (só em aparelhos com mouse) ou com o foco dentro. */
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  /** Segundos por volta completa. Maior = mais devagar. */
  speed?: number;
};

/**
 * Letreiro que rola em loop. O conteúdo aparece duas vezes e a faixa anda -50%, então a emenda não pula:
 * os itens precisam ter o espaçamento dentro de si (padding), não `gap` entre eles.
 *
 * A segunda cópia é `aria-hidden`, para o leitor de tela ler a lista uma vez só.
 * Com `prefers-reduced-motion: reduce` nada anda: a segunda cópia some e a lista fica parada, centralizada e quebrando linha.
 */
export function Marquee({
  children,
  pauseOnHover = false,
  direction = 'left',
  speed = 30,
  className = '',
  ...props
}: MarqueeProps) {
  const track = [
    'flex w-max',
    direction === 'right' ? 'motion-safe:animate-marquee-reverse' : 'motion-safe:animate-marquee',
    'motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center',
    pauseOnHover
      ? 'focus-within:[animation-play-state:paused] [@media(hover:hover)]:hover:[animation-play-state:paused]'
      : '',
  ].join(' ');

  return (
    <div
      className={`w-full overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[-webkit-mask-image:none] motion-reduce:[mask-image:none] ${className}`}
      {...props}
    >
      <div className={track} style={{ '--duration': `${speed}s` } as CSSProperties}>
        <ul className="flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center">{children}</ul>
        <ul
          aria-hidden="true"
          className="flex shrink-0 items-center motion-reduce:hidden"
        >
          {children}
        </ul>
      </div>
    </div>
  );
}
