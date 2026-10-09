/** Rakenteinen data. Sisältö tulee aina omasta koodista, ei käyttäjältä. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // `<` escapataan, jotta merkkijono ei voi sulkea script-elementtiä.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
