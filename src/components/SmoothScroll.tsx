import { useEffect, useRef } from 'react';
import { cancelFrame, frame } from 'framer-motion';
import { ReactLenis, type LenisRef } from 'lenis/react';
import 'lenis/dist/lenis.css';

/**
 * Rolagem suave (Lenis) na página inteira.
 * - Roda no laço de quadros do framer-motion (autoRaf: false), o mesmo que anima o hero: um laço só.
 * - Suaviza só a roda do mouse e o trackpad. No celular o toque continua nativo (syncTouch desligado).
 * - Links internos (#parceria etc.) também deslizam e respeitam o scroll-padding-top do <html> (header fixo).
 *   O Lenis não cancela o clique, então o navegador ainda atualiza o #hash e move o foco (link de pular conteúdo).
 * - Com prefers-reduced-motion, o próprio Lenis desliga a suavização e os saltos ficam instantâneos.
 * - Um elemento com rolagem própria precisa de `data-lenis-prevent`, ou a roda rola a página em vez dele.
 */
export function SmoothScroll() {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const update = ({ timestamp }: { timestamp: number }) => lenisRef.current?.lenis?.raf(timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return <ReactLenis root ref={lenisRef} options={{ autoRaf: false, anchors: true }} />;
}
