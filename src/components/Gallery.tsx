import { gallery, type GalleryPhoto } from '../content';
import { STAR } from './ClawMachine';
import { InstagramButton, WhatsAppButton } from './ui';

/**
 * As fotos saem de public/assets/<arquivo> e são convertidas por `npm run images`
 * para public/assets/otimizadas/<nome>-640.webp, -1200.webp e -1200.jpg (recorte 4:5).
 */
export const PHOTO_W = 1200;
export const PHOTO_H = 1500;

export function photoSources(file: string) {
  const base = file.replace(/\.[^.]+$/, '');
  const dir = '/assets/otimizadas';
  return {
    webp: `${dir}/${base}-640.webp 640w, ${dir}/${base}-1200.webp 1200w`,
    jpg: `${dir}/${base}-1200.jpg`,
  };
}

function Photo({ photo, sizes, className }: { photo: GalleryPhoto; sizes: string; className: string }) {
  const src = photoSources(photo.file);
  return (
    <figure className={`overflow-hidden rounded-md border-[3px] border-ink bg-surface-raised ${className}`}>
      <picture>
        <source type="image/webp" srcSet={src.webp} sizes={sizes} />
        <img
          src={src.jpg}
          alt={photo.alt}
          width={PHOTO_W}
          height={PHOTO_H}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>
    </figure>
  );
}

/** Layout de 1 a 6 fotos. A primeira ganha destaque quando sobra espaço. */
function layout(count: number): { grid: string; item: (i: number) => string } {
  switch (count) {
    case 1:
      return { grid: 'grid-cols-1', item: () => 'aspect-[4/5] max-h-[620px] w-full' };
    case 2:
      return { grid: 'grid-cols-2', item: () => 'aspect-[4/5]' };
    case 3:
      return {
        grid: 'grid-cols-2',
        item: (i) => (i === 0 ? 'col-span-2 aspect-[4/3] sm:col-span-1 sm:row-span-2 sm:aspect-auto' : 'aspect-[4/5]'),
      };
    case 4:
      return { grid: 'grid-cols-2', item: () => 'aspect-[4/5]' };
    case 5:
      return { grid: 'grid-cols-2', item: (i) => (i === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/5]') };
    default:
      return { grid: 'grid-cols-2 sm:grid-cols-3', item: () => 'aspect-[4/5]' };
  }
}

/** Estrela de quatro pontas do letreiro (a mesma da máquina do Hero). */
function MarqueeStar() {
  return (
    <svg viewBox="-10 -10 20 20" width={22} height={22} aria-hidden="true" focusable="false" className="fill-current">
      <path d={STAR} />
    </svg>
  );
}

/**
 * Máquinas: as fotos ficam no "vidro" de um gabinete de máquina de urso (navy, letreiro amarelo em cima,
 * painel com botõezinhos embaixo, sombra sólida). Letreiro e painel são só decoração (aria-hidden).
 */
export function Gallery() {
  const photos = gallery.photos.slice(0, 6);
  const { grid, item } = layout(photos.length);
  const single = photos.length === 1;

  // A última palavra do título ganha o sublinhado amarelo (.mark).
  const words = gallery.title.trim().split(/\s+/);
  const lastWord = words.pop();

  return (
    <section id="maquinas" aria-labelledby="maquinas-title" className="band-soft section">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div
          className={`mx-auto flex w-full flex-col gap-3 rounded-[28px] border-[3px] border-ink bg-navy p-4 shadow-[10px_10px_0_rgb(var(--ink))] sm:gap-4 sm:p-5 ${single ? 'max-w-[460px]' : 'max-w-[560px]'}`}
        >
          <div
            aria-hidden="true"
            className="flex h-14 items-center justify-center gap-3 rounded-md border-[3px] border-ink bg-sun text-on-sun"
          >
            <MarqueeStar />
            <span className="text-[15px] font-extrabold uppercase tracking-[0.12em]">{gallery.eyebrow}</span>
            <MarqueeStar />
          </div>

          <div className={`grid gap-3 ${grid}`}>
            {photos.map((photo, i) => (
              <Photo
                key={photo.file}
                photo={photo}
                className={item(i)}
                sizes={single ? '(min-width: 1024px) 420px, 88vw' : '(min-width: 1024px) 260px, 44vw'}
              />
            ))}
          </div>

          <div aria-hidden="true" className="flex h-14 items-center justify-between rounded-md border-[3px] border-ink bg-sun px-4">
            <span className="h-2.5 w-16 rounded-pill bg-ink" />
            <span className="flex gap-2.5">
              <span className="h-6 w-6 rounded-pill border-[3px] border-ink bg-navy" />
              <span className="h-6 w-6 rounded-pill border-[3px] border-ink bg-surface-raised" />
            </span>
          </div>
        </div>

        <div>
          <p className="eyebrow">{gallery.eyebrow}</p>
          <h2 id="maquinas-title" className="mt-4 text-h2 font-bold">
            {words.join(' ')} <span className="mark">{lastWord}</span>
          </h2>
          <p className="mt-4 max-w-[520px] text-body-lg text-ink-muted">{gallery.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <WhatsAppButton>{gallery.whatsappCta}</WhatsAppButton>
            <InstagramButton className="btn-outline">{gallery.instagramCta}</InstagramButton>
          </div>
        </div>
      </div>
    </section>
  );
}
