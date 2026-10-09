import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { Container } from "./ui";
import type { Crumb } from "@/lib/seo";

/** Alasivujen otsikkoalue: murupolku, H1 ja ingressi. */
export function PageHeader({
  crumbs,
  title,
  lead,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-rule bg-mist">
      <Container className="pb-12 pt-8 sm:pb-14">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-6 max-w-3xl text-[2.35rem] sm:text-5xl">{title}</h1>
        {lead ? <p className="mt-4 max-w-2xl text-lg text-navy-700 sm:text-xl">{lead}</p> : null}
        {children ? <div className="mt-7">{children}</div> : null}
      </Container>
    </div>
  );
}
