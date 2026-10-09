import Link from "next/link";

const steps = [
  {
    title: "Kerro, mitä putkityötä tarvitset.",
    body: "Valitse palvelu ja lue, mistä työn hinta muodostuu ja mitä kannattaa tarkistaa etukäteen.",
    link: { href: "/putkipalvelut", label: "Putkipalvelut" },
  },
  {
    title: "Vertaile hintoja ja palveluntarjoajia.",
    body: "Näet yritysten julkaisemat tuntihinnat, lähtömaksut ja päivystyshinnat lähteineen. Laskuri arvioi saman työn hinnan eri yrityksillä.",
    link: { href: "/putkimiehen-hinnat#laskuri", label: "Hinta-arviolaskuri" },
  },
  {
    title: "Pyydä tarjous ja sovi työstä suoraan valitsemasi yrityksen kanssa.",
    body: "Laadimme tiedoistasi valmiin tarjouspyynnön, jonka lähetät yritykselle. Sopimus syntyy sinun ja yrityksen välille.",
    link: { href: "/tarjouspyynto", label: "Laadi tarjouspyyntö" },
  },
];

/** Kolme vaihetta, joita yhdistää putkilinja. */
export function HowItWorks() {
  return (
    <ol className="relative mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
      {/* Putki: vaakasuora leveällä näytöllä, mobiilissa pystysuorat osat vaiheiden välissä */}
      <span aria-hidden="true" className="absolute left-[1.4rem] right-[calc((100%-4rem)/3-1.4rem)] top-[calc(1.4rem-2.5px)] hidden h-[5px] rounded-full bg-teal-700/80 md:block" />
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 md:block">
          {i < steps.length - 1 ? (
            <span aria-hidden="true" className="absolute -bottom-10 left-[calc(1.4rem-2.5px)] top-[2.8rem] w-[5px] bg-teal-700/80 md:hidden" />
          ) : null}
          <span
            aria-hidden="true"
            className="relative z-10 flex h-[2.8rem] w-[2.8rem] shrink-0 items-center justify-center rounded-full border-[5px] border-teal-700 bg-white text-lg font-bold text-navy-900"
          >
            {i + 1}
          </span>
          <div className="md:mt-5">
            <h3 className="text-xl">
              <span className="sr-only">Vaihe {i + 1}: </span>
              {s.title}
            </h3>
            <p className="mt-2 text-navy-700">{s.body}</p>
            <Link href={s.link.href} className="mt-3 inline-block font-semibold text-teal-800 underline underline-offset-4 hover:text-navy-900">
              {s.link.label}
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
