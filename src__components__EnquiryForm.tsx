"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, CircleAlert, Copy, ExternalLink, LoaderCircle } from "lucide-react";
import {
  JOB_OPTIONS,
  TIMING_OPTIONS,
  leadSchema,
  toFieldErrors,
  type FieldErrors,
  type LeadInput,
} from "@/lib/lead-schema";
import type { LeadResponse, LeadResponseOk } from "@/lib/lead-handler";
import { Button } from "./ui";

export interface CompanyLink {
  id: string;
  name: string;
  url: string;
}

interface Props {
  /** Toimitetaanko kopio ylläpitäjälle (sähköposti/webhook määritetty) */
  operatorDelivery: boolean;
  companies: CompanyLink[];
  defaultJob?: string;
}

type FormValues = Omit<LeadInput, "privacy" | "marketing"> & { privacy: boolean; marketing: boolean };

const EMPTY: FormValues = {
  name: "",
  phone: "",
  email: "",
  area: "",
  job: "",
  description: "",
  timing: "",
  privacy: false,
  marketing: false,
};

const inputCls =
  "mt-1.5 block w-full rounded-[10px] border border-rule bg-white px-3 text-base text-navy-900 placeholder:text-navy-500 focus:border-teal-700 aria-[invalid=true]:border-danger aria-[invalid=true]:bg-[#fff8f7]";

function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.95rem] font-semibold">
        {label}
        {optional ? <span className="font-normal text-navy-600"> (valinnainen)</span> : null}
      </label>
      {hint ? <p id={`${id}-hint`} className="text-sm text-navy-600">{hint}</p> : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger">
          <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function EnquiryForm({ operatorDelivery, companies, defaultJob = "" }: Props) {
  const [values, setValues] = useState<FormValues>({ ...EMPTY, job: defaultJob });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<LeadResponseOk | null>(null);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (result) successHeading.current?.focus();
  }, [result]);

  const validate = (v: FormValues) => {
    const parsed = leadSchema.safeParse(v);
    return parsed.success ? {} : toFieldErrors(parsed.error);
  };

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  const describedBy = (k: keyof FormValues, hint = false) =>
    [hint ? `${id(k)}-hint` : "", errors[k] ? `${id(k)}-error` : ""].filter(Boolean).join(" ") || undefined;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    setServerError(null);
    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      requestAnimationFrame(() => errorSummary.current?.focus());
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/tarjouspyynto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json()) as LeadResponse;
      if (data.ok) {
        setResult(data);
        setStatus("idle");
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors as FieldErrors);
      setServerError(data.error);
      setStatus("error");
    } catch {
      setServerError("Yhteys palvelimeen epäonnistui. Tarkista verkkoyhteys ja yritä uudelleen.");
      setStatus("error");
    }
  }

  async function copyText() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.enquiryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  // --- Onnistunut lähetys ---------------------------------------------------
  if (result) {
    return (
      <div className="rounded-2xl border border-teal-700/30 bg-teal-50 p-5 sm:p-7">
        <h2 ref={successHeading} tabIndex={-1} className="flex items-center gap-2 text-2xl focus:outline-none">
          <Check className="h-6 w-6 text-teal-700" aria-hidden="true" />
          {result.delivered ? "Tarjouspyyntö lähetetty" : "Tarjouspyyntösi on valmis"}
        </h2>
        <div className="mt-3 space-y-2 text-[0.98rem] text-navy-800">
          {result.delivered ? (
            <p>Kopio pyynnöstä toimitettiin HelsinkiPutkimies.fi:n ylläpitäjälle. Tietojasi ei välitetä putkiliikkeille.</p>
          ) : null}
          {result.devStored ? (
            <p className="rounded-md bg-white px-3 py-2 text-sm">
              <strong>Kehitystila:</strong> pyyntö tallennettiin paikalliseen tiedostoon <code>.data/leads.jsonl</code>. Sitä ei lähetetty kenellekään.
            </p>
          ) : null}
          <p>
            Lähetä alla oleva viesti valitsemallesi yritykselle sen omalla yhteydenottolomakkeella tai sähköpostilla ja sovi työstä suoraan yrityksen kanssa.
            Voit liittää viestiin myös kuvia ongelmasta.
          </p>
        </div>

        <label htmlFor={id("message")} className="mt-5 block text-sm font-semibold">Tarjouspyyntösi</label>
        <textarea
          id={id("message")}
          readOnly
          value={result.enquiryText}
          rows={12}
          className="mt-1.5 w-full rounded-[10px] border border-rule bg-white p-3 font-[inherit] text-[0.95rem]"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button type="button" onClick={copyText} variant="primary">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Kopioitu" : "Kopioi viesti"}
          </Button>
          <span className="sr-only" aria-live="polite">{copied ? "Viesti kopioitu leikepöydälle" : ""}</span>
        </div>

        <h3 className="mt-8 text-lg">Valitse yritys</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {companies.map((c) => (
            <li key={c.id}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex min-h-12 items-center justify-between gap-2 rounded-[10px] border border-rule bg-white px-4 py-2 font-semibold hover:border-teal-700 hover:text-teal-800"
              >
                {c.name}
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="sr-only"> – yhteydenotto (avautuu uuteen välilehteen)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-navy-700">
          Vertaa yritysten hintoja <Link href="/putkiliikkeiden-vertailu" className="font-semibold text-teal-800 underline underline-offset-2">vertailusivulla</Link> ennen kuin valitset.
        </p>
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setValues({ ...EMPTY });
            setAttempted(false);
            startedAt.current = Date.now();
          }}
          className="mt-6 text-sm font-semibold text-navy-800 underline underline-offset-4 hover:text-teal-800"
        >
          Tee uusi tarjouspyyntö
        </button>
      </div>
    );
  }

  // --- Lomake ---------------------------------------------------------------
  const errorCount = Object.keys(errors).length;

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5" aria-describedby={id("intro")}>
      <p id={id("intro")} className="text-[0.95rem] text-navy-700">
        {operatorDelivery
          ? "Täytä tiedot, niin muotoilemme niistä tarjouspyynnön, jonka voit lähettää valitsemillesi yrityksille. Kopio pyynnöstä toimitetaan sivuston ylläpitäjälle. Tietojasi ei välitetä putkiliikkeille."
          : "Täytä tiedot, niin muotoilemme niistä selkeän tarjouspyynnön, jonka voit lähettää valitsemillesi yrityksille. Tietojasi ei tallenneta eikä välitetä eteenpäin."}{" "}
        Kaikki kentät ovat pakollisia, ellei toisin mainita.
      </p>

      {attempted && errorCount > 0 ? (
        <div ref={errorSummary} tabIndex={-1} role="alert" className="rounded-[10px] border border-danger/40 bg-[#fff8f7] p-4 text-[0.95rem] focus:outline-none">
          <p className="font-semibold text-danger">Tarkista {errorCount === 1 ? "yksi kenttä" : `${errorCount} kenttää`}:</p>
          <ul className="mt-1 list-disc pl-5 text-navy-800">
            {Object.entries(errors).map(([k, msg]) => (
              <li key={k}><a href={`#${id(k)}`} className="underline underline-offset-2">{msg}</a></li>
            ))}
          </ul>
        </div>
      ) : null}

      {serverError && errorCount === 0 ? (
        <div role="alert" className="rounded-[10px] border border-danger/40 bg-[#fff8f7] p-4 text-[0.95rem] font-medium text-danger">
          {serverError}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Nimi" error={errors.name}>
          <input id={id("name")} name="name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name || undefined} aria-describedby={describedBy("name")} className={`${inputCls} h-12`} />
        </Field>
        <Field id={id("phone")} label="Puhelinnumero" error={errors.phone}>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="040 123 4567" value={values.phone}
            onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone || undefined} aria-describedby={describedBy("phone")} className={`${inputCls} h-12`} />
        </Field>
        <Field id={id("email")} label="Sähköposti" error={errors.email}>
          <input id={id("email")} name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email || undefined} aria-describedby={describedBy("email")} className={`${inputCls} h-12`} />
        </Field>
        <Field id={id("area")} label="Postinumero tai kaupunginosa" error={errors.area}>
          <input id={id("area")} name="area" autoComplete="postal-code" placeholder="00530 tai Kallio" value={values.area}
            onChange={(e) => set("area", e.target.value)} aria-invalid={!!errors.area || undefined} aria-describedby={describedBy("area")} className={`${inputCls} h-12`} />
        </Field>
        <Field id={id("job")} label="Tarvittava putkityö" error={errors.job}>
          <select id={id("job")} name="job" value={values.job} onChange={(e) => set("job", e.target.value)}
            aria-invalid={!!errors.job || undefined} aria-describedby={describedBy("job")} className={`${inputCls} h-12`}>
            <option value="">Valitse työ</option>
            {JOB_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field id={id("timing")} label="Toivottu ajankohta" error={errors.timing}>
          <select id={id("timing")} name="timing" value={values.timing} onChange={(e) => set("timing", e.target.value)}
            aria-invalid={!!errors.timing || undefined} aria-describedby={describedBy("timing")} className={`${inputCls} h-12`}>
            <option value="">Valitse ajankohta</option>
            {TIMING_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>

      <Field id={id("description")} label="Kuvaus ongelmasta" hint="Mitä on tapahtunut, missä vika on ja onko vesi saatu suljettua? Kerro myös talotyyppi." error={errors.description}>
        <textarea id={id("description")} name="description" rows={5} maxLength={2000} value={values.description}
          onChange={(e) => set("description", e.target.value)} aria-invalid={!!errors.description || undefined}
          aria-describedby={describedBy("description", true)} className={`${inputCls} py-2.5`} />
      </Field>

      {/* Piilokenttä roskapostibotteja varten – ei näy ihmisille eikä ruudunlukijoille */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Verkkosivu
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="space-y-3 rounded-[12px] bg-mist p-4">
        <div>
          <label className="flex items-start gap-3 text-[0.95rem]">
            <input id={id("privacy")} type="checkbox" checked={values.privacy} onChange={(e) => set("privacy", e.target.checked)}
              aria-invalid={!!errors.privacy || undefined} aria-describedby={describedBy("privacy")} className="mt-1 h-5 w-5 shrink-0 accent-teal-700" />
            <span>
              Olen lukenut <Link href="/tietosuojaseloste" className="font-semibold text-teal-800 underline underline-offset-2">tietosuojaselosteen</Link> ja
              hyväksyn tietojeni käsittelyn tarjouspyynnön laatimista varten.
            </span>
          </label>
          {errors.privacy ? <p id={`${id("privacy")}-error`} className="mt-1.5 pl-8 text-sm font-medium text-danger">{errors.privacy}</p> : null}
        </div>
        {operatorDelivery ? (
          <label className="flex items-start gap-3 text-[0.95rem]">
            <input type="checkbox" checked={values.marketing} onChange={(e) => set("marketing", e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-teal-700" />
            <span>
              Sivuston ylläpitäjä saa lähettää minulle sähköpostia putkitöihin liittyvistä vinkeistä ja palveluista (valinnainen).
              Voit perua luvan milloin tahansa.
            </span>
          </label>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "submitting"} className="min-w-[13rem]">
          {status === "submitting" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {status === "submitting" ? "Käsitellään…" : operatorDelivery ? "Lähetä tarjouspyyntö" : "Laadi tarjouspyyntö"}
        </Button>
        <p className="text-sm text-navy-600">Palvelu on maksuton eikä sido sinua mihinkään.</p>
      </div>
    </form>
  );
}
