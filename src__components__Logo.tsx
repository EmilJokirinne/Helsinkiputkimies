import Link from "next/link";

/** Tekstilogo: putken kulmaliitos ja pisara. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="10" fill="#0F2A44" />
      <path
        d="M10 12h9a6 6 0 0 1 6 6v10"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <rect x="7.5" y="9" width="4" height="6" rx="1.2" fill="#5FC2B6" />
      <rect x="22" y="23.5" width="6" height="4" rx="1.2" fill="#5FC2B6" />
      <path d="M25 30.5c1.6 2.1 2.4 3.4 2.4 4.3a2.4 2.4 0 0 1-4.8 0c0-.9.8-2.2 2.4-4.3Z" fill="#5FC2B6" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="group inline-flex shrink-0 items-center gap-2 rounded-md sm:gap-2.5"
      aria-label="HelsinkiPutkimies.fi – etusivulle"
    >
      <LogoMark className={inverted ? "h-9 w-9" : "hidden h-9 w-9 min-[400px]:block"} />
      <span
        className={`text-[1.02rem] sm:text-[1.15rem] font-bold tracking-[-0.01em] ${inverted ? "text-white" : "text-navy-900"}`}
        style={{ fontVariationSettings: '"wdth" 86' }}
      >
        HelsinkiPutkimies
        <span className={inverted ? "text-teal-100" : "text-teal-700"}>.fi</span>
      </span>
    </Link>
  );
}
