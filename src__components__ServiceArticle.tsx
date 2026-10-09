import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { CtaBand } from "./CtaBand";
import { FaqList } from "./FaqList";
import { PageHeader } from "./PageHeader";
import { ServiceIcon } from "./ServiceIcon";
import { ButtonLink, Container } from "./ui";
import { serviceBySlug, type Service } from "@/content/services";
import { activeCompanies, latestVerification } from "@/data/companies";
import { formatDateFi } from "@/lib/format";
import { callOutText, hourlyText } from "@/lib/listing-display";

/** Yhteinen pohja palvelusivuille. Sisältö tulee content/services.ts-tiedostosta. */
export function ServiceArticle({ service, crumbs, extra }: { service: Service; crumbs: { name: string; href: string }[]; extra?: ReactNode }) {
  const offering = activeCompanies.filter((c) => c.services.includes(service.slug));
  const unspecified = activeCompanies.filter((c) => !c.services.includes(service.slug) && c.servicesNote);
  const related = service.related.map(serviceBySlug).filter((s): s is Service => !!s);
  const quoteHref = `/tarjouspyynto?tyo=${service.slug}`;

  return (
    <>
      <PageHeader crumbs={crumbs} title={service.name} lead={service.intro}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={quoteHref}>Pyydä tarjous</ButtonLink>
          <ButtonLink href="/putkimiehen-hinnat#laskuri" variant="secondary">Laske hinta-arvio</ButtonLink>
        </div>
      </PageHeader>

      <Container className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-16">
        <article className="prose-fi max-w-[68ch] text-[1.06rem] text-navy-900">
          {service.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.list ? (
                <ul>
                  {s.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              ) : null}
              {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}

          <section>
            <h2>Mistä hinta muodostuu</h2>
            <ul>
              {service.priceFactors.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <p>
              Useimmat putkiliikkeet laskuttavat tuntityönä, ja hintaan lisätään lähtömaksu ja tarvikkeet. Vertaa
              yritysten julkaisemia hintoja <Link href="/putkimiehen-hinnat">hintasivulla</Link> tai laske arvio{" "}
              <Link href="/putkimiehen-hinnat#laskuri">hintalaskurilla</Link>.
            </p>
          </section>

          <section>
            <h2>Tarkista ennen tilausta</h2>
            <ul>
              {service.beforeOrdering.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </section>

          {extra}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <section aria-labelledby="tarjoajat" className="rounded-2xl border border-rule bg-white p-5 shadow-soft">
            <h2 id="tarjoajat" className="text-lg">Yritykset, jotka mainitsevat tämän palvelun</h2>
            {offering.length === 0 && unspecified.length === 0 ? (
              <p className="mt-3 text-[0.95rem] text-navy-700">
                Vertailussa ei vielä ole yritystä, joka mainitsee tämän palvelun. Katso{" "}
                <Link href="/putkiliikkeiden-vertailu" className="font-semibold text-teal-800 underline">kaikki yritykset</Link>.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-rule">
                {[...offering, ...unspecified].map((c) => {
                  const h = hourlyText(c, "weekday");
                  const co = callOutText(c);
                  return (
                    <li key={c.id} className="py-3">
                      <a href={c.contactUrl ?? c.websiteUrl} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 font-semibold hover:text-teal-800 hover:underline">
                        {c.name}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only"> (avautuu uuteen välilehteen)</span>
                      </a>
                      <p className="num text-sm text-navy-700">
                        {h ? `Arkisin ${h}` : "Hinta: pyydä tarjous"}
                        {co ? `, lähtömaksu ${co}` : ""}
                      </p>
                      {!c.services.includes(service.slug) ? (
                        <p className="text-xs text-navy-600">Palveluita ei eritelty – varmista yritykseltä</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-2 text-xs text-navy-600">Yritysten oma ilmoitus, tarkistettu {formatDateFi(latestVerification)}.</p>
          </section>

          {related.length > 0 ? (
            <nav aria-labelledby="liittyvat" className="rounded-2xl bg-mist p-5">
              <h2 id="liittyvat" className="text-lg">Liittyvät palvelut</h2>
              <ul className="mt-3 space-y-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={r.href} className="flex min-h-11 items-center gap-3 rounded-md px-2 font-medium hover:bg-white hover:text-teal-800">
                      <ServiceIcon icon={r.icon} className="h-4 w-4 text-teal-700" />
                      {r.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </Container>

      {service.faq.length > 0 ? (
        <section aria-labelledby="palvelu-ukk" className="mt-20">
          <Container>
            <h2 id="palvelu-ukk" className="text-3xl">Kysymyksiä: {service.shortName.toLocaleLowerCase("fi")}</h2>
            <div className="mt-6 max-w-4xl">
              <FaqList items={service.faq} />
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand title={`Tarvitsetko apua: ${service.shortName.toLocaleLowerCase("fi")}?`} />
    </>
  );
}
