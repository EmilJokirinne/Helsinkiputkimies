import Link from "next/link";
import type { Service } from "@/content/services";
import { ServiceIcon } from "./ServiceIcon";

export function ServiceGrid({ items }: { items: Service[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <li key={s.slug} className="bg-white">
          <Link
            href={s.href}
            className="group flex h-full gap-4 p-5 transition-colors hover:bg-teal-50 focus-visible:bg-teal-50 sm:p-6"
          >
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-navy-900 text-white group-hover:bg-teal-700">
              <ServiceIcon icon={s.icon} />
            </span>
            <span>
              <span className="block text-lg font-semibold text-navy-900 group-hover:text-teal-800" style={{ fontVariationSettings: '"wdth" 90' }}>
                {s.shortName}
              </span>
              <span className="mt-1 block text-[0.95rem] text-navy-700">{s.cardText}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
