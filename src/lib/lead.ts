/**
 * Lógica do formulário de contato, separada da interface.
 * Hoje: monta a mensagem e abre o WhatsApp. Nada é gravado em servidor.
 * Para trocar por uma API depois, reescreva só `sendLead` (a interface de entrada e saída fica igual).
 */
import { leadForm } from '../content';
import { whatsappLink } from './whatsapp';

export type LeadData = {
  name: string;
  establishmentType: string; // `value` de leadForm.establishmentTypes, ou ''
  neighborhood: string;
  city: string;
  notes: string;
};

export type LeadResult = { ok: true } | { ok: false; field: keyof LeadData; message: string };

export function validateLead(data: LeadData): LeadResult {
  if (!data.name.trim()) {
    return { ok: false, field: 'name', message: leadForm.fields.nameError };
  }
  return { ok: true };
}

/** "Olá! Meu nome é Ana. Tenho uma padaria em Pituba, Salvador e quero uma máquina de urso no meu ponto." */
export function buildLeadMessage(data: LeadData): string {
  const name = data.name.trim();
  const type = leadForm.establishmentTypes.find((t) => t.value === data.establishmentType);
  const place = [data.neighborhood.trim(), data.city.trim()].filter(Boolean).join(', ');
  const notes = data.notes.trim();

  const business = type ? type.phrase : 'um estabelecimento';
  const where = place ? ` em ${place}` : '';

  const lines = [
    `Olá! Meu nome é ${name}. Tenho ${business}${where} e quero uma máquina de urso no meu ponto.`,
  ];
  if (notes) lines.push(`Observação: ${notes}`);
  return lines.join('\n');
}

/**
 * Envia o contato. Precisa ser chamada direto do clique/submit,
 * senão o navegador pode bloquear a nova aba.
 */
export function sendLead(data: LeadData): LeadResult {
  const check = validateLead(data);
  if (!check.ok) return check;

  const url = whatsappLink(buildLeadMessage(data));
  // Sem 'noopener' para saber se a aba abriu (com ele, window.open sempre devolve null).
  const win = window.open(url, '_blank');
  if (win) {
    win.opener = null;
  } else {
    // Navegadores dentro do Instagram/WhatsApp costumam bloquear a nova aba: abre na mesma.
    window.location.href = url;
  }
  return { ok: true };
}
