import { header, howItWorks } from '../content';
import { SectionHeading, WhatsAppButton } from './ui';

/** Cor da "face" de cada botão de arcade: navy e amarelo alternados. */
const faces = ['bg-navy text-on-navy', 'bg-sun text-on-sun'];

/**
 * Como funciona: cada passo é um "botão de arcade" (anel creme, face colorida e sombra sólida embaixo).
 * Os tipos de negócio fecham a seção num letreiro navy de ponta a ponta, separados por estrelas.
 */
export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="band-soft pt-14 md:pt-20 lg:pt-24">
      <div className="container-page">
        <SectionHeading
          id="como-funciona-title"
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.title}
          intro={howItWorks.intro}
          align="center"
        />

        <ol className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {howItWorks.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className="flex h-28 w-28 items-center justify-center rounded-pill border-[3px] border-ink bg-surface shadow-[0_8px_0_rgb(var(--ink))]"
              >
                <span
                  className={`flex h-[84px] w-[84px] items-center justify-center rounded-pill border-[3px] border-ink text-[36px] font-extrabold leading-none tracking-[-0.02em] ${faces[i % faces.length]}`}
                >
                  {i + 1}
                </span>
              </span>
              <h3 className="mt-7 text-heading font-bold">{step.title}</h3>
              <p className="mt-2 max-w-[300px] text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="band-navy mt-16 border-t-[3px] border-ink py-12 lg:mt-20">
        <div className="container-page flex flex-col items-center gap-7 text-center">
          <h3 className="text-label font-bold uppercase tracking-[0.08em]">{howItWorks.placesTitle}</h3>
          <ul className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-[20px] font-extrabold leading-snug md:text-[23px]">
            {howItWorks.places.map((place, i) => (
              <li key={place}>
                {i > 0 ? (
                  <span aria-hidden="true" className="mr-2.5 text-sun">
                    ★
                  </span>
                ) : null}
                {place}
              </li>
            ))}
          </ul>
          <WhatsAppButton variant="sun">{header.cta}</WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
