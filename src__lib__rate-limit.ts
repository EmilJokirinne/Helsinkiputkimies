/**
 * Yksinkertainen muistinvarainen rajoitin. Vercelissä jokaisella
 * palvelininstanssilla on oma muistinsa, joten raja on suuntaa-antava.
 * Tiukempaan suojaan: Vercel Firewall -säännöt tai Upstash Redis (README).
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}
