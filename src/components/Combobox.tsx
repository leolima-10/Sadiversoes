import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Command } from 'cmdk';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

/**
 * Lista com busca (Popover do Radix + cmdk), adaptada do combobox do shadcn/ui.
 * Usa só os tokens da marca e o visual `.field` dos outros campos, então troca de tema sozinha.
 */

type Option = { value: string; label: string };

type ComboboxProps = {
  /** Vai no botão; o `<label htmlFor>` do formulário dá o nome acessível. */
  id: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
};

/** Minúsculas e sem acento: assim "acai" encontra "Açaiteria". */
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/** Compara a busca com o label (que vai em `keywords`), não com o `value`. */
function filter(_value: string, search: string, keywords?: string[]) {
  const q = normalize(search);
  if (!q) return 1;
  return (keywords ?? []).some((k) => normalize(k).includes(q)) ? 1 : 0;
}

export function Combobox({ id, options, value, onChange, placeholder, searchPlaceholder, emptyText }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          className="field flex items-center justify-between gap-3 text-left"
        >
          <span className={selected ? 'truncate' : 'truncate text-ink-muted'}>{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown aria-hidden="true" size={20} className="shrink-0 text-ink" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={10}
          // Acima do header fixo (z-50).
          className="combobox-pop z-[60] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-sm border-[1.5px] border-ink bg-surface-raised text-ink"
          style={{ boxShadow: '4px 4px 0 rgb(var(--ink))' }}
        >
          <Command loop filter={filter} label={placeholder}>
            <div className="flex items-center gap-2 border-b border-line px-4">
              <Search aria-hidden="true" size={18} className="shrink-0 text-ink-muted" />
              {/* 16px: o iOS não dá zoom ao focar. */}
              <Command.Input
                placeholder={searchPlaceholder}
                className="h-12 w-full bg-transparent text-body text-ink outline-none placeholder:text-ink-muted"
              />
            </div>
            {/* A lista rola por dentro: sem isto o Lenis rolaria a página com a roda do mouse. */}
            <Command.List data-lenis-prevent className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1.5">
              <Command.Empty className="px-3 py-6 text-center text-label text-ink-muted">{emptyText}</Command.Empty>
              {options.map((o) => (
                <Command.Item
                  key={o.value}
                  value={o.value}
                  keywords={[o.label]}
                  onSelect={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className="flex min-h-[44px] cursor-pointer select-none items-center gap-3 rounded-sm px-3 text-body outline-none data-[selected=true]:bg-navy/10"
                >
                  <span className={o.value === value ? 'font-bold' : undefined}>{o.label}</span>
                  <Check
                    aria-hidden="true"
                    size={18}
                    className={`ml-auto shrink-0 text-navy ${o.value === value ? 'opacity-100' : 'opacity-0'}`}
                  />
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
