import {
  Construction,
  Droplets,
  Gauge,
  Siren,
  Toilet,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wrench,
  Pipette,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIcon as IconKey } from "@/content/services";

const map: Record<IconKey, LucideIcon> = {
  faucet: Pipette,
  toilet: Toilet,
  leak: Droplets,
  drain: Waves,
  washer: WashingMachine,
  dishwasher: UtensilsCrossed,
  maintenance: Gauge,
  pipes: Wrench,
  renovation: Construction,
  emergency: Siren,
};

export function ServiceIcon({ icon, className = "h-5 w-5" }: { icon: IconKey; className?: string }) {
  const Icon = map[icon];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.9} />;
}
