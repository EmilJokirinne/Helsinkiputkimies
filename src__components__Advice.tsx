import Link from "next/link";
import { ClipboardCheck, Clock, Receipt } from "lucide-react";

const blocks = [
  {
    icon: ClipboardCheck,
    title: "Ennen kuin tilaat putkimiehen",
    items: [
      "Ota kuva viasta ja liitännöistä – moni yritys osaa arvioida työn kuvasta.",
      "Kerrostalossa selvitä huoltoyhtiöltä, kuuluuko korjaus taloyhtiölle.",
      "Tarkista, saako vettä suljettua asunnon tai kalusteen omista venttiileistä.",
      "Kysy yrityksen Y-tunnus ja tarkista se tarvittaessa YTJ:stä.",
    ],
  },
  {
    icon: Clock,
    title: "Näin päivystyshinnat toimivat",
    items: [
      "Ilta-, yö-, viikonloppu- ja pyhäkäynnit maksavat selvästi arkipäivää enemmän.",
      "Osa yrityksistä veloittaa kiinteän päivystysmaksun, joka sisältää esimerkiksi kaksi tuntia työtä.",
      "Osa käyttää korotettua tuntihintaa ilman kiinteää maksua.",
      "Jos vesi saadaan poikki, korjaus voi usein odottaa arkiaamuun.",
    ],
    link: { href: "/paivystava-putkimies", label: "Lue lisää päivystyksestä" },
  },
  {
    icon: Receipt,
    title: "Vältä yllätyskulut",
    items: [
      "Kysy lähtömaksu, laskutusjakso ja mahdollinen minimiveloitus etukäteen.",
      "Selvitä, laskutetaanko tarvikkeet, kilometrit ja erikoislaitteet erikseen.",
      "Pyydä erittely, jossa työn osuus näkyy – se tarvitaan kotitalousvähennykseen.",
      "Sovi, että asentaja kysyy luvan ennen sovitun hinnan ylittäviä lisätöitä.",
    ],
  },
];

export function Advice() {
  return (
    <div className="grid gap-x-10 gap-y-10 md:grid-cols-3">
      {blocks.map((b, i) => (
        <section key={b.title} aria-labelledby={`advice-${i}`}>
          <b.icon className="h-7 w-7 text-teal-700" aria-hidden="true" strokeWidth={1.7} />
          <h3 id={`advice-${i}`} className="mt-3 text-xl">{b.title}</h3>
          <ul className="prose-fi mt-4 text-[0.98rem] text-navy-800">
            {b.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {b.link ? (
            <Link href={b.link.href} className="mt-4 inline-block font-semibold text-teal-800 underline underline-offset-4 hover:text-navy-900">
              {b.link.label}
            </Link>
          ) : null}
        </section>
      ))}
    </div>
  );
}
