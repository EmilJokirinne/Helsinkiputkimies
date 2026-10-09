import { TIME_SLOT_LABELS, type Listing, type TimeSlot } from "@/data/types";
import { formatDateFi, formatEur } from "@/lib/format";
import { hourlyText } from "@/lib/listing-display";

const OFF_HOURS: TimeSlot[] = ["evening", "weekend", "holiday"];

function cell(l: Listing, slot: TimeSlot): string {
  const fee = l.emergency.status === "confirmed" ? l.emergency.value?.find((f) => f.slot === slot) : undefined;
  if (fee) {
    return `${fee.amountIsFrom ? "alkaen " : ""}${formatEur(fee.amount)} (sis. ${fee.includedHours} h), sitten ${formatEur(fee.extraHourly)}/h`;
  }
  return hourlyText(l, slot) ?? "Pyydä tarjous";
}

/** Päivystyshinnat ajankohdittain. Mobiilissa jokainen yritys omana listanaan. */
export function EmergencyPrices({ rows }: { rows: Listing[] }) {
  const companies = rows.filter((r) => r.kind === "company");
  return (
    <section>
      <h2>Julkaistut päivystyshinnat</h2>
      <p>
        Alla ovat vertailun yritysten julkaisemat hinnat arkipäivän ulkopuolella. Päivystysmaksun lisäksi voidaan
        veloittaa lähtömaksu, kilometrit ja tarvikkeet.
      </p>
      <div className="not-prose mt-4 space-y-4">
        {companies.map((c) => (
          <div key={c.id} className="rounded-xl border border-rule bg-white p-4">
            <h3 className="!mt-0 text-lg">{c.name}</h3>
            <dl className="mt-2 grid gap-x-4 gap-y-1.5 text-[0.95rem] sm:grid-cols-[10rem_1fr]">
              {OFF_HOURS.map((slot) => (
                <div key={slot} className="contents">
                  <dt className="text-navy-600">{TIME_SLOT_LABELS[slot]}</dt>
                  <dd className="num">{cell(c, slot)}</dd>
                </div>
              ))}
            </dl>
            {c.emergency.status === "confirmed" && c.emergency.value?.length ? (
              <p className="mt-2 text-sm text-navy-600">
                Ajankohdat yrityksen hinnastossa: {c.emergency.value.map((f) => f.definition).join("; ")}.
              </p>
            ) : c.hourly.note ? (
              <p className="mt-2 text-sm text-navy-600">{c.hourly.note}</p>
            ) : null}
            <p className="mt-1 text-sm text-navy-600">
              Lähde:{" "}
              {c.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 ? ", " : ""}
                  <a href={s.url} target="_blank" rel="noopener noreferrer nofollow">{s.label}</a>
                </span>
              ))}
              . Tarkistettu {formatDateFi(c.lastVerified)}.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
