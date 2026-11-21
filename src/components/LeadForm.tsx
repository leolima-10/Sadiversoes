import { lazy, Suspense, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { contact, leadForm } from '../content';
import { Combobox } from './Combobox';
import { sendLead, type LeadData } from '../lib/lead';
import { whatsappLink } from '../lib/whatsapp';
import { InstagramIcon, RollLabel, SectionHeading, WhatsAppIcon } from './ui';

// O globo (d3-geo + mapa) vem num pedaço separado, só quando esta seção é montada.
const SalvadorGlobe = lazy(() => import('./SalvadorGlobe'));

/** Link de canal direto: ícone num quadrado + texto. Abre em nova aba. */
function ChannelLink({ href, icon, children, sr }: { href: string; icon: ReactNode; children: ReactNode; sr: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex min-h-[48px] items-center gap-4 rounded-sm text-body font-semibold text-ink-muted transition-colors duration-150 hover:text-ink"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-line bg-surface-raised text-ink transition-colors duration-150 group-hover:border-navy">
        {icon}
      </span>
      <span>{children}</span>
      <span className="sr-only"> {sr}</span>
    </a>
  );
}

const empty: LeadData = { name: '', establishmentType: '', neighborhood: '', city: '', notes: '' };

// Estilo dos campos em `.field` (index.css).
const fieldClass = 'field';

export function LeadForm() {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    nameError: `${uid}-name-error`,
    type: `${uid}-type`,
    neighborhood: `${uid}-neighborhood`,
    city: `${uid}-city`,
    notes: `${uid}-notes`,
  };
  const [data, setData] = useState<LeadData>(empty);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const f = leadForm.fields;

  const set = (key: keyof LeadData) => (value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    if (key === 'name' && error && value.trim()) setError('');
    setSent(false);
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = sendLead(data);
    if (!result.ok) {
      setError(result.message);
      setSent(false);
      nameRef.current?.focus();
      return;
    }
    setError('');
    setSent(true);
  }

  return (
    <section id="contato" aria-labelledby="contato-title" className="section bg-surface">
      <div className="container-page">
        <SectionHeading id="contato-title" eyebrow={leadForm.eyebrow} title={leadForm.title} intro={leadForm.intro} align="center" />

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <form
            noValidate
            onSubmit={onSubmit}
            aria-labelledby={`${uid}-form-title`}
            className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft sm:p-8"
          >
            <h3 id={`${uid}-form-title`} className="text-heading font-bold">
              {leadForm.formTitle}
            </h3>
            <p className="mt-1 text-label text-ink-muted">{leadForm.formText}</p>
            <div className="dots my-6" aria-hidden="true" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={ids.name} className="mb-2 block text-label font-bold">
                  {f.name} <span aria-hidden="true" className="text-cap-red">*</span>
                  <span className="sr-only">(obrigatório)</span>
                </label>
                <input
                  ref={nameRef}
                  id={ids.name}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? ids.nameError : undefined}
                  placeholder={f.namePlaceholder}
                  value={data.name}
                  onChange={(e) => set('name')(e.target.value)}
                  className={fieldClass}
                />
                <div id={ids.nameError} role="alert" className="mt-2 text-label font-bold text-cap-red empty:hidden">
                  {error}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={ids.type} className="mb-2 block text-label font-bold">
                  {f.type}
                </label>
                <Combobox
                  id={ids.type}
                  options={leadForm.establishmentTypes}
                  value={data.establishmentType}
                  onChange={set('establishmentType')}
                  placeholder={f.typePlaceholder}
                  searchPlaceholder={f.typeSearchPlaceholder}
                  emptyText={f.typeEmpty}
                />
              </div>

              <div>
                <label htmlFor={ids.neighborhood} className="mb-2 block text-label font-bold">
                  {f.neighborhood}
                </label>
                <input
                  id={ids.neighborhood}
                  name="neighborhood"
                  type="text"
                  placeholder={f.neighborhoodPlaceholder}
                  value={data.neighborhood}
                  onChange={(e) => set('neighborhood')(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor={ids.city} className="mb-2 block text-label font-bold">
                  {f.city}
                </label>
                <input
                  id={ids.city}
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder={f.cityPlaceholder}
                  value={data.city}
                  onChange={(e) => set('city')(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={ids.notes} className="mb-2 block text-label font-bold">
                  {f.notes} <span className="font-semibold text-ink-muted">{f.optional}</span>
                </label>
                <textarea
                  id={ids.notes}
                  name="notes"
                  rows={3}
                  placeholder={f.notesPlaceholder}
                  value={data.notes}
                  onChange={(e) => set('notes')(e.target.value)}
                  className={`${fieldClass} resize-y`}
                  // Com texto longo o campo rola por dentro: a roda do mouse rola o campo, não a página (Lenis).
                  data-lenis-prevent
                />
              </div>
            </div>

            <button type="submit" className="btn btn-whatsapp mt-6 w-full sm:w-auto">
              <WhatsAppIcon />
              <RollLabel text={leadForm.submit} />
              <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
            </button>

            <div role="status" className="mt-4 text-label font-bold empty:hidden">
              {sent ? (
                <span className="flex items-center gap-2 text-ink">
                  <CheckCircle2 size={20} aria-hidden="true" className="shrink-0 text-whatsapp" />
                  {leadForm.success}
                </span>
              ) : null}
            </div>
          </form>

          {/* No desktop fica à esquerda; no celular vem depois do formulário, que é o caminho principal. */}
          <div className="lg:order-first">
            <h3 className="text-heading font-bold">{leadForm.channelsTitle}</h3>
            <p className="mt-2 max-w-[440px] text-ink-muted">{leadForm.channelsText}</p>

            <ul className="mt-6 grid gap-3">
              <li>
                <ChannelLink href={whatsappLink()} icon={<WhatsAppIcon size={20} />} sr="(abre o WhatsApp em nova aba)">
                  WhatsApp {contact.whatsappDisplay}
                </ChannelLink>
              </li>
              <li>
                <ChannelLink href={contact.instagramUrl} icon={<InstagramIcon size={20} />} sr="(abre o Instagram em nova aba)">
                  Instagram {contact.instagramHandle}
                </ChannelLink>
              </li>
            </ul>

            <p className="mt-6 flex items-start gap-3 text-label text-ink-muted">
              <ShieldCheck size={20} aria-hidden="true" className="shrink-0 text-navy" />
              {leadForm.privacy}
            </p>

            <div className="relative mt-8 h-64 overflow-hidden sm:h-72">
              <div className="absolute inset-x-0 top-0 max-w-[520px]">
                <Suspense fallback={null}>
                  <SalvadorGlobe label={leadForm.globeLabel} />
                </Suspense>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
