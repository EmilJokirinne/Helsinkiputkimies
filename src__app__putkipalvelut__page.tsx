import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { ServiceGrid } from "@/components/ServiceGrid";
import { Container } from "@/components/ui";
import { services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Putkipalvelut Helsingissä – putkityöt hanoista putkiremontteihin",
  description:
    "Putkityöt Helsingissä hanan vaihdosta viemärin avaukseen, kodinkoneiden asennukseen ja putkiremontteihin. Lue, mistä kunkin työn hinta muodostuu.",
  path: "/putkipalvelut",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Putkipalvelut", href: "/putkipalvelut" }]}
        title="Putkipalvelut Helsingissä"
        lead="Valitse putkityö, niin näet mitä työhön yleensä kuuluu, mistä sen hinta muodostuu ja mitkä vertailun yritykset kertovat tekevänsä sitä."
      />
      <Container className="mt-12">
        <ServiceGrid items={services} />

        <div className="prose-fi mt-16 max-w-[68ch] text-[1.06rem]">
          <h2>Pienet korjaukset vai laaja remontti?</h2>
          <p>
            Hanan vaihto, WC-istuimen korjaus tai viemärin avaus ovat tyypillisesti tuntityönä laskutettavia
            käyntejä, joiden hinta koostuu työajasta, lähtömaksusta ja tarvikkeista. Niihin sopii hyvin
            yritysten julkaisemien tuntihintojen vertailu ja <Link href="/putkimiehen-hinnat#laskuri">hinta-arviolaskuri</Link>.
          </p>
          <p>
            Käyttövesiputkien uusiminen ja putkiremontit ovat urakoita, joihin pyydetään kirjalliset tarjoukset
            samasta suunnitelmasta. Niissä tuntihinta kertoo hinnasta vain vähän – vertaa kokonaishintaa,
            sisältöä ja aikataulua.
          </p>
          <p>
            Akuutissa vuototilanteessa lue ensin ohjeet <Link href="/putkipalvelut/vesivuodon-korjaus">vesivuodon varalle</Link> ja
            {" "}<Link href="/paivystava-putkimies">päivystyshinnoista</Link>.
          </p>
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
