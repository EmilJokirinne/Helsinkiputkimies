import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/content/services";

/** Natiivi <details> – toimii ilman JavaScriptiä ja näppäimistöllä. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-rule border-y border-rule">
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-[1.08rem] font-semibold hover:text-teal-800 [&::-webkit-details-marker]:hidden">
            <h3 className="text-[1.08rem]" style={{ fontVariationSettings: '"wdth" 95' }}>{f.q}</h3>
            <ChevronDown className="h-5 w-5 shrink-0 text-teal-700 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="max-w-3xl pb-5 text-navy-800">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
