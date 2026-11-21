import { Minus, Plus } from 'lucide-react';
import { faq } from '../content';
import { SectionHeading, WhatsAppButton } from './ui';

/**
 * Perguntas frequentes, com um toque arcade: numeração em fonte pixelada e linhas tracejadas grossas.
 * <details> nativo, sem JS: o mesmo `name` em todos deixa só uma pergunta aberta por vez.
 * A animação de abrir e fechar fica em index.css (.faq-item) e some com movimento reduzido.
 */
export function Faq() {
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="section border-t border-line bg-surface">
      <div className="container-page">
        <div className="mx-auto max-w-[760px]">
          <SectionHeading id="duvidas-title" eyebrow={faq.eyebrow} title={faq.title} intro={faq.intro} align="center" />

          <div className="mt-10 border-t-4 border-dashed border-navy/30">
            {faq.items.map((item, i) => (
              <details key={item.q} name="faq" className="faq-item group border-b-4 border-dashed border-navy/30">
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
                  {/* items-baseline: o número fica na linha de base da 1ª linha da pergunta, com 1 ou 2 linhas. */}
                  <span className="flex flex-1 items-baseline gap-4">
                    <span aria-hidden="true" className="w-6 shrink-0 font-pixel text-[12px] leading-none text-navy">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[18px] font-bold leading-snug">{item.q}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-navy text-navy"
                  >
                    <Plus size={18} strokeWidth={2.5} className="group-open:hidden" />
                    <Minus size={18} strokeWidth={2.5} className="hidden group-open:block" />
                  </span>
                </summary>
                {/* pl-10: alinha a resposta ao texto da pergunta (número de 24px + 16px de espaço). */}
                <p className="pb-6 pl-10 pr-12 text-ink-muted">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <WhatsAppButton>{faq.cta}</WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
