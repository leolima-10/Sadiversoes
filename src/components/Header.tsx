import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { brand, header, nav } from '../content';
import { whatsappLink } from '../lib/whatsapp';
import { SlideTabs } from './SlideTabs';
import { RollLabel, WhatsAppIcon } from './ui';

/** Padrão: 48px no celular e tablet; 40px a partir de xl, onde o menu em pílula ocupa a largura toda. */
export function Logo({ className = 'h-12 xl:h-10' }: { className?: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-chip px-3 py-1.5 ring-1 ring-line">
      <img
        src={brand.logo.src}
        width={brand.logo.width}
        height={brand.logo.height}
        alt={brand.logo.alt}
        className={`${className} w-auto`}
      />
    </span>
  );
}

const sectionIds = nav.map((item) => item.href.slice(1));

/**
 * Índice (em `nav`) da seção que cruza uma linha a 35% da altura da tela; -1 quando nenhuma cruza
 * (hero, formulário, rodapé). Recalcula no scroll (o Lenis rola a janela de verdade) uma vez por quadro.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      setActive(
        ids.findIndex((id) => {
          const rect = document.getElementById(id)?.getBoundingClientRect();
          return rect ? rect.top <= line && rect.bottom > line : false;
        }),
      );
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ids]);

  return active;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia('(min-width: 1280px)').matches) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-surface/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <a href="#inicio" className="shrink-0" aria-label={`${brand.name}, voltar ao início`}>
          <Logo />
        </a>

        <nav aria-label="Principal" className="hidden xl:block">
          <SlideTabs items={nav} activeIndex={activeSection} />
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp min-h-[48px] px-4 sm:px-5"
          >
            <WhatsAppIcon size={20} />
            {/* A partir de sm o rótulo aparece (e rola); no celular o botão é só o ícone, com o nome em sr-only. */}
            <span className="hidden sm:inline-flex">
              <RollLabel text={header.cta} />
            </span>
            <span className="sr-only sm:hidden">{header.cta}</span>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <button
            id="menu-toggle"
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-pill border-[1.5px] border-ink text-ink xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? header.menuClose : header.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="menu-mobile"
        aria-label="Principal (celular)"
        hidden={!open}
        className="border-t border-line bg-surface xl:hidden"
      >
        <ul className="container-page flex flex-col py-3">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center border-b border-line px-1 text-[18px] font-semibold text-ink last:border-b-0 hover:text-navy"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
