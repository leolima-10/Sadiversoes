import { Benefits } from './components/Benefits';
import { Coverage } from './components/Coverage';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { ForPlayers } from './components/ForPlayers';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { LeadForm } from './components/LeadForm';
import { SmoothScroll } from './components/SmoothScroll';

export default function App() {
  return (
    <>
      <SmoothScroll />
      <a
        href="#conteudo"
        className="btn btn-sun sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1} className="pt-[72px] focus:outline-none">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Gallery />
        <Coverage />
        <ForPlayers />
        <LeadForm />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
