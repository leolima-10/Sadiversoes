import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent } from 'react';

type Item = { label: string; href: string };
type Rect = { left: number; width: number };

/**
 * Menu em pílula com um cursor que desliza até o item sob o mouse ou o foco do teclado
 * e volta para o item ativo (`activeIndex`, -1 = nenhum) quando o mouse ou o foco saem.
 * Adaptado do SlideTabs (21st.dev): links de verdade (<a>), cursor fora da lista para o leitor de tela
 * não contar um item vazio, e transição em CSS (o cursor e a cor do texto mudam no mesmo quadro).
 * Com prefers-reduced-motion, o cursor pula sem deslizar.
 */
export function SlideTabs({ items, activeIndex }: { items: Item[]; activeIndex: number }) {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  // Mede antes da pintura e de novo quando a lista muda de largura (troca da fonte, por exemplo).
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () =>
      setRects(itemRefs.current.map((el) => (el ? { left: el.offsetLeft, width: el.offsetWidth } : { left: 0, width: 0 })));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [items]);

  const target = hovered ?? activeIndex;
  // Texto claro e cursor visível dependem do mesmo índice: nunca há texto claro sem o cursor embaixo.
  const shown = target >= 0 && rects[target] ? target : -1;

  // Quando o cursor reaparece, ele surge no lugar certo em vez de deslizar da última posição.
  const wasShown = useRef(shown);
  const appearing = wasShown.current < 0 && shown >= 0;
  useEffect(() => {
    wasShown.current = shown;
  }, [shown]);

  const rect = shown >= 0 ? rects[shown] : rects[wasShown.current] ?? { left: 0, width: 0 };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(null);
  };

  return (
    <div
      className="relative rounded-pill border border-line bg-surface-raised p-1"
      onMouseLeave={() => setHovered(null)}
      onBlur={onBlur}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-1 left-0 top-1 rounded-pill bg-navy motion-safe:duration-300 motion-safe:ease-out ${
          appearing ? 'motion-safe:transition-opacity' : 'motion-safe:transition-[transform,width,opacity]'
        }`}
        style={{ transform: `translateX(${rect.left}px)`, width: rect.width, opacity: shown >= 0 ? 1 : 0 }}
      />
      <ul ref={listRef} className="flex">
        {items.map((item, i) => (
          <li
            key={item.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="relative z-10"
            onMouseEnter={() => setHovered(i)}
          >
            <a
              href={item.href}
              aria-current={i === activeIndex ? 'true' : undefined}
              onFocus={() => setHovered(i)}
              className={`inline-flex h-10 items-center whitespace-nowrap rounded-pill px-4 text-[15px] font-semibold motion-safe:transition-colors motion-safe:duration-300 ${
                shown === i ? 'text-on-navy' : 'text-ink-muted'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
