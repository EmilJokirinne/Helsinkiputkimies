import Link from "next/link";
import { Logo } from "./Logo";
import { Container } from "./ui";
import { nestedServices } from "@/content/services";
import { getOperator } from "@/lib/site";
import { activeListings } from "@/data/companies";

export function Footer() {
  const operator = getOperator();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-navy-950 text-white/80">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed">
            HelsinkiPutkimies.fi on riippumaton tieto- ja vertailupalvelu. Emme tee putkitöitä emmekä
            työllistä putkiasentajia. Vertailun yritykset ovat itsenäisiä
            {activeListings.some((l) => l.sponsored)
              ? ", ja kaupallinen yhteistyö on merkitty vertailuun."
              : ", eikä mikään niistä ole maksanut näkyvyydestään."}
          </p>
          <p className="mt-4 text-[0.95rem]">
            <Link href="/tietoa-sivustosta" className="text-white underline underline-offset-4 hover:text-teal-100">
              Näin vertailu toimii
            </Link>
          </p>
        </div>

        <nav aria-label="Palvelut">
          <h2 className="text-base text-white">Palvelut</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            {nestedServices.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={s.href} className="hover:text-white hover:underline">
                  {s.shortName}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/putkipalvelut" className="hover:text-white hover:underline">
                Kaikki palvelut
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Hinnat ja vertailu">
          <h2 className="text-base text-white">Hinnat ja vertailu</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            <li><Link href="/putkimiehen-hinnat" className="hover:text-white hover:underline">Putkimiehen hinnat</Link></li>
            <li><Link href="/putkimiehen-hinnat#laskuri" className="hover:text-white hover:underline">Hinta-arviolaskuri</Link></li>
            <li><Link href="/putkiliikkeiden-vertailu" className="hover:text-white hover:underline">Putkiliikkeiden vertailu</Link></li>
            <li><Link href="/paivystava-putkimies" className="hover:text-white hover:underline">Päivystävä putkimies</Link></li>
            <li><Link href="/putkimies-helsinki" className="hover:text-white hover:underline">Putkimies Helsingissä</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-base text-white">Sivusto</h2>
          <ul className="mt-4 space-y-2.5 text-[0.95rem]">
            <li><Link href="/tarjouspyynto" className="hover:text-white hover:underline">Tarjouspyyntö ja yhteystiedot</Link></li>
            <li><Link href="/usein-kysytyt-kysymykset" className="hover:text-white hover:underline">Usein kysytyt kysymykset</Link></li>
            <li><Link href="/tietosuojaseloste" className="hover:text-white hover:underline">Tietosuojaseloste ja evästeet</Link></li>
            <li><Link href="/tietoa-sivustosta" className="hover:text-white hover:underline">Tietoa sivustosta</Link></li>
          </ul>
          {operator.email ? (
            <p className="mt-6 text-[0.95rem]">
              Ylläpitäjä: <a className="text-white underline underline-offset-4" href={`mailto:${operator.email}`}>{operator.email}</a>
            </p>
          ) : null}
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-white/60 sm:flex-row sm:justify-between">
          <p>© {year} {operator.name ?? "HelsinkiPutkimies.fi"}{operator.businessId ? `, Y-tunnus ${operator.businessId}` : ""}</p>
          <p>Hinnat ovat suuntaa-antavia. Lopullinen hinta sovitaan aina putkiliikkeen kanssa.</p>
        </Container>
      </div>
    </footer>
  );
}
