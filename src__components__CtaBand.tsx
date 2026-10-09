import { ButtonLink, Container } from "./ui";

export function CtaBand({
  title = "Tarvitsetko putkimiestä Helsingissä?",
  text = "Vertaa julkaistuja hintoja ja laadi tarjouspyyntö, jonka voit lähettää suoraan valitsemallesi yritykselle.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="mt-24">
      <Container>
        <div className="relative overflow-hidden rounded-[22px] bg-navy-900 px-6 py-12 text-white sm:px-12 sm:py-14">
          {/* Putkikulma koristeena */}
          <svg aria-hidden="true" viewBox="0 0 300 200" className="pointer-events-none absolute -right-10 -top-6 h-56 w-80 opacity-25 sm:opacity-40">
            <path d="M0 40h150a70 70 0 0 1 70 70v120" fill="none" stroke="#5FC2B6" strokeWidth="18" strokeLinecap="round" />
            <rect x="130" y="26" width="16" height="28" rx="4" fill="#5FC2B6" />
            <rect x="206" y="128" width="28" height="16" rx="4" fill="#5FC2B6" />
          </svg>
          <div className="relative max-w-2xl">
            <h2 id="cta-title" className="text-3xl sm:text-[2.4rem]">{title}</h2>
            <p className="mt-4 text-lg text-white/85">{text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/tarjouspyynto" variant="inverted">Pyydä tarjous</ButtonLink>
              <ButtonLink href="/putkiliikkeiden-vertailu" variant="ghostInverted">Vertaile putkiliikkeitä</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
