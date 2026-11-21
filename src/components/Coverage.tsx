import { MapPin } from 'lucide-react';
import { coverage } from '../content';
import { SectionHeading, WhatsAppButton } from './ui';

/** Leve inclinação de cada bilhete, como fichas soltas sobre o balcão. */
const tilts = ['-rotate-2', 'rotate-[1.5deg]', '-rotate-1'];

/** Bilhete de fliperama: canhoto amarelo com o pino, picote tracejado e o nome da cidade. */
function CityTicket({ name, tilt }: { name: string; tilt: string }) {
  return (
    <div className={`relative flex min-h-[140px] overflow-hidden rounded-[16px] bg-navy text-on-navy ${tilt}`}>
      <span aria-hidden="true" className="flex w-[72px] shrink-0 items-center justify-center bg-sun text-on-sun sm:w-[88px]">
        <MapPin size={30} strokeWidth={2.2} />
      </span>
      <span aria-hidden="true" className="w-0 shrink-0 border-l-[3px] border-dashed border-on-sun" />
      <span className="flex flex-col justify-center gap-1.5 px-5 py-6 sm:px-6">
        <span className="text-caption font-bold uppercase tracking-[0.14em] text-on-navy/80">{coverage.ticketLabel}</span>
        <span className="text-[24px] font-extrabold leading-tight tracking-[-0.02em] xl:text-[28px]">{name}</span>
      </span>
      {/* Recortes do picote: círculos na cor do fundo da seção. */}
      <span aria-hidden="true" className="absolute -top-3 left-[60px] h-6 w-6 rounded-pill bg-surface sm:left-[76px]" />
      <span aria-hidden="true" className="absolute -bottom-3 left-[60px] h-6 w-6 rounded-pill bg-surface sm:left-[76px]" />
    </div>
  );
}

export function Coverage() {
  const cities = coverage.places.filter((place) => !place.note);
  const others = coverage.places.filter((place) => place.note);

  return (
    <section id="onde-atuamos" aria-labelledby="onde-atuamos-title" className="section bg-surface">
      <div className="container-page">
        <SectionHeading
          id="onde-atuamos-title"
          eyebrow={coverage.eyebrow}
          title={coverage.title}
          intro={coverage.intro}
          align="center"
        />

        <ul className="mx-auto mt-12 grid max-w-[420px] gap-6 md:max-w-none md:grid-cols-2 xl:grid-cols-3">
          {cities.map((place, i) => (
            <li key={place.name}>
              <CityTicket name={place.name} tilt={tilts[i % tilts.length]} />
            </li>
          ))}
          {others.map((place) => (
            <li key={place.name} className="md:col-span-2 xl:col-span-1">
              <div
                className={`flex h-full min-h-[140px] flex-col justify-center gap-1.5 rounded-[16px] border-[3px] border-dashed border-navy px-6 py-6 ${tilts[2]}`}
              >
                <span className="text-[24px] font-extrabold leading-tight tracking-[-0.02em]">{coverage.otherTitle}</span>
                <span className="text-label font-medium text-ink-muted">
                  {place.name}: {place.note.charAt(0).toLowerCase() + place.note.slice(1)}.
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <WhatsAppButton message={coverage.ctaMessage}>{coverage.cta}</WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
