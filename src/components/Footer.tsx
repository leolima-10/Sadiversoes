import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUp } from 'lucide-react';
import { contact, coverage, footer, header, nav } from '../content';
import { starPath } from '../lib/shapes';
import { whatsappLink } from '../lib/whatsapp';
import { Logo } from './Header';
import { InstagramIcon, WhatsAppButton, WhatsAppIcon } from './ui';
import './Footer.css';

// O letreiro com os adesivos (alfabeto, desenhos e o arrastar) vem num arquivo à parte, só quando o rodapé é montado.
const StickerStage = lazy(() => import('./StickerStage'));

/** Estrela recortada atrás da seta do "Topo". */
const BURST = starPath(11, 48, 31, 0.3, 7);
/** Rabisco embaixo do "Consultar minha cidade". */
const SQUIGGLE = 'M1 5C7 1 11 1 15 4S24 8 29 4S38 0 43 4S52 8 57 4S66 1 71 4S80 7 87 3';

/** Rótulo em pílula de cada coluna. */
const TAG = 'ft-tag mb-5 inline-block rounded-pill bg-surface px-3.5 py-1 text-label font-bold text-ink';

/** --c (coluna) e --i (linha) escalonam a entrada (Footer.css). */
const col = (c: number) => ({ '--c': c }) as CSSProperties;
const row = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Rodapé: moldura creme com o logo e o "Topo", painel azul com três colunas (contato, onde atuamos e seções)
 * e, no fim do painel, o letreiro escrito à mão com os adesivos de urso (StickerStage, carregado sob demanda).
 * Adaptado do "Sticker Slap Footer" para o conteúdo e os tokens da marca. A entrada toca uma vez,
 * quando 20% do rodapé aparece (classe .is-in), e não acontece com movimento reduzido.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cities = coverage.places.filter((place) => !place.note);
  const others = coverage.places.filter((place) => place.note);

  return (
    <footer ref={ref} className={`ft bg-surface px-2 pb-2 sm:px-3 sm:pb-3${seen ? ' is-in' : ''}`}>
      <div className="container-page flex items-center justify-between gap-6 py-6 sm:py-8">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Logo className="h-12" />
          <p className="max-w-[300px] text-label font-semibold text-ink-muted">{footer.tagline}</p>
        </div>
        <a href="#inicio" className="ft-top" aria-label={footer.backToTopLabel}>
          <span>{footer.backToTop}</span>
          <span className="ft-burst" aria-hidden="true">
            <svg viewBox="-50 -50 100 100" focusable="false">
              <path d={BURST} className="fill-sun" />
            </svg>
            <ArrowUp size={20} strokeWidth={2.75} className="ft-arrow" />
          </span>
        </a>
      </div>

      <div className="ft-panel band-navy relative overflow-clip rounded-lg">
        <div className="container-page grid gap-x-10 gap-y-12 pt-12 md:grid-cols-2 md:pt-14 lg:grid-cols-3 lg:pt-16">
          {/* Contato primeiro: é a conversão. */}
          <div style={col(0)}>
            <h2 className={TAG}>{footer.contactTitle}</h2>
            <ul className="ft-big">
              <li className="ft-line" style={row(0)}>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="ft-link">
                  <WhatsAppIcon size={24} className="shrink-0" />
                  <span className="ft-u">{contact.whatsappDisplay}</span>
                  <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
                </a>
              </li>
              <li className="ft-line" style={row(1)}>
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="ft-link">
                  <InstagramIcon size={24} className="shrink-0" />
                  <span className="ft-u">{contact.instagramHandle}</span>
                  <span className="sr-only"> (Instagram, abre em nova aba)</span>
                </a>
              </li>
            </ul>
            <div className="ft-fade mt-7">
              <WhatsAppButton className="w-full sm:w-auto">{header.cta}</WhatsAppButton>
            </div>
          </div>

          <div style={col(1)}>
            <h2 className={TAG}>{coverage.eyebrow}</h2>
            <ul className="ft-big">
              {cities.map((place, i) => (
                <li key={place.name} className="ft-line" style={row(i)}>
                  <span className="inline-block">{place.name}</span>
                </li>
              ))}
            </ul>
            {others.map((place) => (
              <p key={place.name} className="ft-fade mt-4 max-w-[34ch] text-label">
                {place.name}. {place.note}.
              </p>
            ))}
            <a
              href={whatsappLink(coverage.ctaMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-squiggle ft-fade mt-5"
            >
              {coverage.cta}
              <svg viewBox="0 0 88 8" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d={SQUIGGLE} pathLength={100} />
              </svg>
              <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
            </a>
          </div>

          <div style={col(2)}>
            <h2 className={TAG}>{footer.navTitle}</h2>
            <nav aria-label={footer.navLabel}>
              <ul className="ft-big">
                {nav.map((item, i) => (
                  <li key={item.href} className="ft-line" style={row(i)}>
                    <a href={item.href} className="ft-link">
                      <span className="ft-u">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <Suspense fallback={null}>
          <StickerStage />
        </Suspense>
      </div>

      <p className="container-page py-5 text-caption text-ink-muted">
        © {year} {footer.rights}
      </p>
    </footer>
  );
}
