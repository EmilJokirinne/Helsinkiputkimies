import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "./site";

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

/** Yhtenäiset metatiedot: title, description, canonical, Open Graph. */
export function buildMetadata({ title, description, path, noindex }: PageMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "fi_FI",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630, alt: `${SITE_NAME} – putkitöiden hinnat ja vertailu Helsingissä` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/og.png")] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export interface Crumb {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
