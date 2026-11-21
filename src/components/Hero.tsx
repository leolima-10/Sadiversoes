import { Check, MapPin } from 'lucide-react';
import { hero } from '../content';
import { ClawMachine } from './ClawMachine';
import { ContainerScroll } from './ContainerScroll';
import { RollLabel, WhatsAppButton } from './ui';

export function Hero() {
  return (
    // overflow-clip: o cartão inclinado (escala 1.05 no início) não cria rolagem lateral, e a sombra dele
    // não invade a faixa azul seguinte. O clip não vira contêiner de rolagem.
    <section id="inicio" aria-labelledby="hero-title" className="overflow-clip bg-surface">
      <div className="container-page pb-14 pt-10 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
        <ContainerScroll
          titleComponent={
            <>
              <p className="eyebrow">{hero.badge}</p>
              <h1 id="hero-title" className="mt-5 text-h1 font-bold text-ink">
                {hero.titleBefore}
                <span className="mark">{hero.titleHighlight}</span>
                {hero.titleAfter}
              </h1>
              <p className="mx-auto mt-6 max-w-[560px] text-body-lg text-ink-muted">{hero.text}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <WhatsAppButton>{hero.primaryCta}</WhatsAppButton>
                <a href={hero.secondaryHref} className="btn btn-outline">
                  <RollLabel text={hero.secondaryCta} />
                </a>
              </div>

              {/* Grade fixa (e não flex-wrap): a quebra não muda quando a fonte troca, então nada pula. */}
              {/* No celular a lista é um bloco centralizado com os itens alinhados à esquerda (checks na mesma coluna). */}
              <ul className="mx-auto mt-8 grid w-fit gap-3 sm:w-auto sm:max-w-[600px] sm:grid-cols-3 sm:gap-4">
                {hero.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-label font-semibold text-ink sm:justify-center">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-sun text-on-sun">
                      <Check size={13} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mx-auto mt-6 flex max-w-[600px] items-center justify-center gap-2 border-t border-line pt-6 text-label font-medium text-ink-muted">
                <MapPin size={18} aria-hidden="true" className="shrink-0 text-navy" />
                {hero.note}
              </p>
            </>
          }
        >
          {/* Uma única máquina: os ids dos clipPath do SVG não podem se repetir na página. */}
          <div className="px-6 pb-5 pt-6 sm:px-10 sm:pt-8">
            <ClawMachine />
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}
