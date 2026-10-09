import { EmergencyPrices } from "@/components/EmergencyPrices";
import { ServiceArticle } from "@/components/ServiceArticle";
import { serviceBySlug } from "@/content/services";
import { activeListings } from "@/data/companies";
import { buildMetadata } from "@/lib/seo";

const service = serviceBySlug("paivystava-putkimies")!;

export const metadata = buildMetadata({
  title: service.metaTitle,
  description: service.metaDescription,
  path: service.href,
});

export default function EmergencyPage() {
  return (
    <ServiceArticle
      service={service}
      crumbs={[{ name: "Päivystävä putkimies", href: service.href }]}
      extra={<EmergencyPrices rows={activeListings} />}
    />
  );
}
