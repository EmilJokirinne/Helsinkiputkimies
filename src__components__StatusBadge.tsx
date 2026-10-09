import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { DataStatus } from "@/data/types";
import { STATUS_LABEL } from "@/lib/listing-display";

const style: Record<DataStatus, string> = {
  confirmed: "bg-teal-50 text-teal-800 ring-teal-700/20",
  conflicting: "bg-amber-50 text-amber-800 ring-amber-800/25",
  estimate: "bg-mist text-navy-700 ring-navy-700/20",
  unavailable: "bg-white text-navy-600 ring-navy-600/20",
};

export function StatusBadge({ status, title }: { status: DataStatus; title?: string }) {
  const Icon = status === "confirmed" ? CircleCheck : status === "conflicting" ? TriangleAlert : Info;
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style[status]}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}
