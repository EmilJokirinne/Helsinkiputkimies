import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/ui";
import { generalFaq } from "@/content/faq";
import { services } from "@/content/services";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Usein kysytyt kysymykset putkitöistä | HelsinkiPutkimies.fi",
  description:
    "Vastaukset yleisimpiin kysymyksiin putkimiehen hinnasta, lähtömaksuista, kotitalousvähennyksestä, taloyhtiön ilmoituksista ja vesivuodoista Helsingissä.",
  path: "/usein-kysytyt-kysymykset",
});

export default function FaqPage() {
  const serviceFaqs = services.filter((s) => s.faq.length > 0);
  // FAQPage-rakenteinen data vain tällä sivulla, jossa kysymykset ovat pääsisältöä.
  const all = [...generalFaq, ...serviceFaqs.flatMap((s) => s.faq)];

  return (
    <>
      <JsonLd data={faqJsonLd(all)} />
      <PageHeader
        crumbs={[{ name: "Usein kysytyt kysymykset", href: "/usein-kysytyt-kysymykset" }]}
        title="Usein kysytyt kysymykset"
        lead="Lyhyet vastaukset putkitöiden hintoihin, vastuisiin ja käytäntöihin. Tarkemmat ohjeet löydät kunkin palvelun sivulta."
      />
      <Container className="mt-14 max-w-4xl">
        <section aria-labelledby="yleiset">
          <h2 id="yleiset" className="text-3xl">Hinnat ja käytännöt</h2>
          <div className="mt-6"><FaqList items={generalFaq} /></div>
        </section>
        {serviceFaqs.map((s) => (
          <section key={s.slug} aria-labelledby={`ukk-${s.slug}`} className="mt-14">
            <h2 id={`ukk-${s.slug}`} className="text-2xl">
              <Link href={s.href} className="hover:text-teal-800 hover:underline">{s.shortName}</Link>
            </h2>
            <div className="mt-4"><FaqList items={s.faq} /></div>
          </section>
        ))}
      </Container>
      <CtaBand />
    </>
  );
}
