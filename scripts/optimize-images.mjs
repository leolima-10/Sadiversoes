/**
 * Converte as fotos da galeria (as listadas em src/content.ts) para WebP + JPG otimizado.
 * Saída: public/assets/otimizadas/<nome>-640.webp, <nome>-1200.webp e <nome>-1200.jpg
 * Recorte fixo 4:5 (retrato), centralizado.
 * Roda sozinho antes de `npm run dev` e `npm run build`.
 * Reprocessa uma foto quando ela muda (tamanho ou data diferentes do registrado em
 * otimizadas/manifest.json) ou quando falta alguma versão.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const src = join(root, 'public', 'assets');
const out = join(src, 'otimizadas');
mkdirSync(out, { recursive: true });

// Lê os nomes de arquivo da galeria direto do content.ts (campo `file: '...'`, com ' " ou `).
const content = readFileSync(join(root, 'src', 'content.ts'), 'utf8');
const files = [...content.matchAll(/file:\s*(['"`])(.+?)\1/g)].map((m) => m[2]);

const manifestPath = join(out, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

const RATIO = 5 / 4;
let failed = false;

for (const file of files) {
  const input = join(src, file);
  if (!existsSync(input)) {
    console.error(`! Foto não encontrada: public/assets/${file} (listada em src/content.ts)`);
    failed = true;
    continue;
  }
  const base = file.replace(/\.[^.]+$/, '');
  const targets = [
    { name: `${base}-640.webp`, w: 640, fmt: 'webp' },
    { name: `${base}-1200.webp`, w: 1200, fmt: 'webp' },
    { name: `${base}-1200.jpg`, w: 1200, fmt: 'jpg' },
  ];
  const st = statSync(input);
  const signature = `${st.size}-${Math.round(st.mtimeMs)}`;
  const changed = manifest[file] !== signature;

  for (const t of targets) {
    const dest = join(out, t.name);
    if (!changed && existsSync(dest)) continue;
    const img = sharp(input)
      .rotate()
      .resize(t.w, Math.round(t.w * RATIO), { fit: 'cover', position: 'centre' });
    await (t.fmt === 'webp' ? img.webp({ quality: 78 }) : img.jpeg({ quality: 80, mozjpeg: true })).toFile(dest);
    console.log(`+ otimizadas/${t.name}`);
  }
  manifest[file] = signature;
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
if (failed) process.exit(1);
