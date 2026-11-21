import { contact, whatsappDefaultMessage } from '../content';

/** Monta um link wa.me com a mensagem já codificada. */
export function whatsappLink(message: string = whatsappDefaultMessage): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
