import type { CSSProperties, SVGProps } from 'react';
import { contact } from '../content';
import { whatsappLink } from '../lib/whatsapp';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** Cascata máxima do efeito: rótulos longos não podem demorar mais que isto para começar a última letra. */
const ROLL_MAX_STAGGER_MS = 250;
const ROLL_STEP_MS = 20;

/**
 * Rótulo de botão com letras que rolam no hover e no foco do teclado (.btn, ver index.css):
 * cada letra desce e sai, e uma cópia entra por cima, em cascata.
 * - O leitor de tela lê o texto inteiro uma vez (sr-only); as letras soltas ficam escondidas dele.
 * - A quebra é por palavra, então rótulos longos ainda quebram em linhas no celular.
 * - A cascata é limitada (ROLL_MAX_STAGGER_MS); não rola com movimento reduzido nem em telas de toque.
 */
export function RollLabel({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  const letters = words.reduce((sum, word) => sum + Array.from(word).length, 0);
  const step = Math.min(ROLL_STEP_MS, ROLL_MAX_STAGGER_MS / Math.max(letters - 1, 1));
  let index = 0;

  return (
    <span className="roll" style={{ '--roll-step': `${step.toFixed(2)}ms` } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="roll-text select-none">
        {words.map((word, w) => (
          <span key={w} className="roll-word">
            {Array.from(word).map((char) => {
              const i = index++;
              return (
                <span key={i} className="roll-char" style={{ '--i': i } as CSSProperties}>
                  <span>{char}</span>
                  <span>{char}</span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Ícone de WhatsApp desenhado no traço do lucide (o lucide não tem ícones de marca). */
export function WhatsAppIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path
        d="M9 8.6c.2-.6.7-.9 1.1-.9l1 2.2-.8.9a5.4 5.4 0 0 0 2.9 2.9l.9-.8 2.2 1c0 .4-.3.9-.9 1.1-3.6.7-7.1-2.8-6.4-6.4Z"
        fill="currentColor"
        strokeWidth={1.2}
      />
    </svg>
  );
}

export function InstagramIcon({ size = 22, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type LinkButtonProps = {
  /** Texto do botão (vem do content.ts); vira um RollLabel. */
  children: string;
  className?: string;
  message?: string;
};

/**
 * Botão primário de ação: abre o WhatsApp em nova aba.
 * `variant="sun"` deixa o botão amarelo, para faixas navy onde o verde perde contraste com o fundo.
 */
export function WhatsAppButton({
  children,
  className = '',
  message,
  variant = 'whatsapp',
}: LinkButtonProps & { variant?: 'whatsapp' | 'sun' }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${variant === 'sun' ? 'btn-sun' : 'btn-whatsapp'} ${className}`}
    >
      <WhatsAppIcon />
      <RollLabel text={children} />
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}

export function InstagramButton({ children, className = '' }: Omit<LinkButtonProps, 'message'>) {
  return (
    <a
      href={contact.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${className}`}
    >
      <InstagramIcon />
      <RollLabel text={children} />
      <span className="sr-only"> (abre o Instagram em nova aba)</span>
    </a>
  );
}

type Tone = 'surface' | 'navy';

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  tone = 'surface',
  align = 'left',
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: Tone;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'mx-auto max-w-[720px] text-center' : 'max-w-[720px]'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-h2 font-bold">
        {title}
      </h2>
      {intro ? (
        <p className={`mt-4 text-body-lg ${tone === 'navy' ? 'text-on-navy' : 'text-ink-muted'}`}>{intro}</p>
      ) : null}
    </div>
  );
}
