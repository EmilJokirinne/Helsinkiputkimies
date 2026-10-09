import { handleLeadRequest } from "@/lib/lead-handler";

// Node-ajoympäristö: kehitystilan tiedostotallennus käyttää fs-moduulia.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleLeadRequest(req);
}
