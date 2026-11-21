import { Coins, Gift, Handshake, Smile, Users, Wrench, type LucideIcon } from 'lucide-react';
import { benefits, header, type BenefitIcon } from '../content';
import { SectionHeading, WhatsAppButton } from './ui';

const icons: Record<BenefitIcon, LucideIcon> = {
  coins: Coins,
  wrench: Wrench,
  gift: Gift,
  smile: Smile,
  users: Users,
  handshake: Handshake,
};

/** Inclinações leves e alternadas das fichas (classes completas, para o Tailwind encontrar). */
const tilts = ['-rotate-[1.5deg]', 'rotate-1', '-rotate-[0.6deg]', 'rotate-[1.2deg]', '-rotate-1', 'rotate-[1.6deg]'];

/** Furo da picotagem: um círculo da cor da faixa sobre a borda, centrado na linha tracejada. */
const hole = 'absolute left-[61px] h-5 w-5 rounded-pill border-[1.5px] border-ink bg-navy sm:left-[69px]';

/**
 * Parceria: cada benefício é uma "ficha de fliperama" creme sobre a faixa navy, com canhoto,
 * picotagem tracejada e sombra sólida deslocada (a mesma linguagem dos campos do formulário).
 */
export function Benefits() {
  return (
    <section id="parceria" aria-labelledby="parceria-title" className="band-navy section overflow-x-clip">
      <div className="container-page">
        <SectionHeading
          id="parceria-title"
          eyebrow={benefits.eyebrow}
          title={benefits.title}
          intro={benefits.intro}
          tone="navy"
          align="center"
        />

        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.items.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <li
                key={item.title}
                className={`relative flex rounded-md border-[1.5px] border-ink bg-surface text-ink shadow-[6px_6px_0_rgb(0_0_0/0.35)] ${tilts[i % tilts.length]}`}
              >
                <div className="flex w-[72px] shrink-0 items-center justify-center border-r-2 border-dashed border-ink/35 sm:w-20">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-pill border-[1.5px] border-ink bg-sun text-on-sun">
                    <Icon size={24} strokeWidth={2} aria-hidden="true" />
                  </span>
                </div>
                <div className="flex-1 px-5 py-5 sm:py-6">
                  <h3 className="text-heading font-bold">{item.title}</h3>
                  <p className="mt-1.5 text-ink-muted">{item.text}</p>
                </div>
                <span aria-hidden="true" className={`${hole} -top-[11px]`} />
                <span aria-hidden="true" className={`${hole} -bottom-[11px]`} />
              </li>
            );
          })}
        </ul>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-5">
          <p className="text-body-lg font-medium">{benefits.ctaText}</p>
          <WhatsAppButton variant="sun">{header.cta}</WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
