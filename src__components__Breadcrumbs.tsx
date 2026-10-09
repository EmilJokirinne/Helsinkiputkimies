import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

/** Murupolku. Ensimmäinen taso on aina etusivu. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Etusivu", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Murupolku" className="text-sm text-navy-600">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 ? <ChevronRight className="h-3.5 w-3.5 text-navy-500" aria-hidden="true" /> : null}
                {last ? (
                  <span aria-current="page" className="font-medium text-navy-900">{c.name}</span>
                ) : (
                  <Link href={c.href} className="hover:text-navy-900 hover:underline">{c.name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
