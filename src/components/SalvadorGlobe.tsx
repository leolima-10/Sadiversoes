import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import landTopology from 'world-atlas/land-110m.json';

/**
 * Globo em linhas que gira uma vez e para em Salvador.
 * Decorativo (aria-hidden). Sem loop infinito; com movimento reduzido, já começa parado.
 * Este arquivo é carregado sob demanda (React.lazy em LeadForm), então o mapa não pesa no carregamento inicial.
 */

type Rotation = [number, number];

/** [longitude, latitude] de Salvador. */
const SALVADOR: [number, number] = [-38.5, -12.97];
/** Para em Salvador, com o centro do globo 30° ao sul: assim o pino fica na parte de cima, acima do degradê. */
const FINAL: Rotation = [38.5, 12.97 + 30];
const START: Rotation = [125, 5];
const DURATION = 2400;

/** Área do desenho (viewBox). O SVG escala por CSS. */
const SIZE = 400;
const RADIUS = 190;

const topology = landTopology as unknown as Topology<{ land: GeometryCollection }>;
const land = feature(topology, topology.objects.land);
const graticule = geoGraticule10();

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function SalvadorGlobe({ label }: { label: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [rotation, setRotation] = useState<Rotation>(() => (prefersReducedMotion() ? FINAL : START));
  const frame = useRef<number | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  // Gira uma vez, na primeira vez que o globo aparece na tela.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / DURATION, 1);
          const k = ease(t);
          setRotation([START[0] + (FINAL[0] - START[0]) * k, START[1] + (FINAL[1] - START[1]) * k]);
          frame.current = t < 1 ? requestAnimationFrame(step) : null;
        };
        frame.current = requestAnimationFrame(step);
      },
      { threshold: 0.2 },
    );
    observer.observe(svg);

    return () => {
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const shapes = useMemo(() => {
    const projection = geoOrthographic()
      .scale(RADIUS)
      .translate([SIZE / 2, SIZE / 2])
      .rotate([rotation[0], rotation[1], 0])
      .precision(0.3);
    const path = geoPath(projection);
    const pin = projection(SALVADOR);
    // O pino só aparece quando Salvador está na face visível do globo.
    const pinVisible = pin !== null && geoDistance(SALVADOR, [-rotation[0], -rotation[1]]) < Math.PI / 2 - 0.08;
    return {
      sphere: path({ type: 'Sphere' }) ?? '',
      graticule: path(graticule) ?? '',
      land: path(land) ?? '',
      pin: pinVisible ? pin : null,
    };
  }, [rotation]);

  // Arrastar com mouse ou caneta. No toque, o dedo continua rolando a página.
  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'touch') return;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    drag.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const width = e.currentTarget.getBoundingClientRect().width || SIZE;
    const k = (0.4 * SIZE) / width;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    setRotation(([lon, lat]) => [lon + dx * k, Math.max(-90, Math.min(90, lat - dy * k))]);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="block h-auto w-full select-none"
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      aria-hidden="true"
      focusable="false"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <path d={shapes.graticule} className="fill-transparent stroke-ink-muted" strokeOpacity={0.18} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <path d={shapes.land} className="fill-navy/10 stroke-navy" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={shapes.sphere} className="fill-transparent stroke-navy" strokeOpacity={0.7} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />

      {shapes.pin ? (
        <g transform={`translate(${shapes.pin[0]} ${shapes.pin[1]})`}>
          <circle r={16} className="fill-sun" fillOpacity={0.28} />
          <circle r={7} className="fill-sun stroke-navy" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
          <text x={16} y={5} className="fill-ink font-sans font-bold" fontSize={16}>
            {label}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
