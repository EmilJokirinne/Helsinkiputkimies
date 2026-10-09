import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-[0.98rem] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-soft",
  secondary: "border border-navy-900/20 bg-white text-navy-900 hover:border-navy-900/40 hover:bg-mist",
  inverted: "bg-white text-navy-900 hover:bg-teal-50",
  ghostInverted: "border border-white/35 text-white hover:bg-white/10",
} as const;

export type ButtonVariant = keyof typeof variants;

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function buttonClass(variant: ButtonVariant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

/** Ulkoinen linkki uuteen välilehteen, rel-suojauksilla */
export function ExternalLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={className}>
      {children}
      <span className="sr-only"> (avautuu uuteen välilehteen)</span>
    </a>
  );
}

export function SectionHeading({
  title,
  lead,
  id,
  as: Tag = "h2",
}: {
  title: string;
  lead?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-2xl">
      <Tag id={id} className={Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-[2.35rem]"}>
        {title}
      </Tag>
      {lead ? <p className="mt-3 text-lg text-navy-700">{lead}</p> : null}
    </div>
  );
}
