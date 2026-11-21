import { Gamepad2, Hand, Sparkles } from 'lucide-react';
import { forPlayers } from '../content';
import { InstagramButton } from './ui';

const stepIcons = [Sparkles, Gamepad2, Hand];

/** Faixa compacta para quem joga (público secundário). */
export function ForPlayers() {
  return (
    <section id="quero-jogar" aria-labelledby="quero-jogar-title" className="band-soft py-12 md:py-16">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow">{forPlayers.eyebrow}</p>
          <h2 id="quero-jogar-title" className="mt-4 text-h2 font-bold">
            {forPlayers.title}
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted">{forPlayers.intro}</p>
          <InstagramButton className="btn-outline mt-6">{forPlayers.panelCta}</InstagramButton>
        </div>

        <ol className="grid gap-6 sm:grid-cols-3">
          {forPlayers.steps.map((step, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            return (
              <li key={step.title} className="rounded-lg border border-line bg-surface-raised p-5">
                <div className="flex items-center justify-between">
                  <Icon size={22} aria-hidden="true" className="text-navy" />
                  <span className="text-label font-bold tabular-nums text-ink-muted">
                    <span className="sr-only">{forPlayers.stepLabel} </span>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 text-[17px] font-bold leading-snug">{step.title}</h3>
                <p className="mt-1 text-label text-ink-muted">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
