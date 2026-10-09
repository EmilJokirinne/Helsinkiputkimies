// Palauttaa kansiorakenteen litteästä zipistä: "src__app__page.tsx" → "src/app/page.tsx".
// Ajetaan automaattisesti ennen `npm run build` / `npm run dev` (prebuild/predev),
// joten se toimii myös Vercelissä. Jos tiedostot ovat jo kansioissa, ei tee mitään.
import { readdirSync, mkdirSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";

let moved = 0;
for (const name of readdirSync(".")) {
  if (!name.includes("__")) continue;
  const target = join(...name.split("__"));
  mkdirSync(dirname(target), { recursive: true });
  renameSync(name, target);
  moved++;
}
if (moved > 0) console.log(`restore.mjs: kansiorakenne palautettu (${moved} tiedostoa).`);
