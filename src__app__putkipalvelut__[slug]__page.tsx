import { notFound } from "next/navigation";
import { ServiceArticle } from "@/components/ServiceArticle";
import { nestedServices, serviceBySlug } from "@/content/services";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return nestedServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service || service.slug === "paivystava-putkimies") return {};
  return buildMetadata({ title: service.metaTitle, description: service.metaDescription, path: service.href });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service || service.slug === "paivystava-putkimies") notFound();
  return (
    <ServiceArticle
      service={service}
      crumbs={[
        { name: "Putkipalvelut", href: "/putkipalvelut" },
        { name: service.shortName, href: service.href },
      ]}
    />
  );
}
