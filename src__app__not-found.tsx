import Link from "next/link";
import { ButtonLink, Container } from "@/components/ui";
import { services } from "@/content/services";

export default function NotFound() {
  return (
    <Container className="py-20">
      <h1 className="text-4xl sm:text-5xl">Sivua ei löytynyt</h1>
      <p className="mt-4 max-w-xl text-lg text-navy-700">
        Osoite voi olla vanhentunut tai kirjoitettu väärin. Valitse alta, mitä olit etsimässä.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Etusivulle</ButtonLink>
        <ButtonLink href="/putkimiehen-hinnat" variant="secondary">Putkimiehen hinnat</ButtonLink>
      </div>
      <h2 className="mt-14 text-xl">Putkipalvelut</h2>
      <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={s.href} className="inline-flex min-h-10 items-center text-teal-800 underline underline-offset-2">{s.shortName}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
