import { createHash } from 'node:crypto';
const buckets = new Map();
export async function rateLimit(request) {
 const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
 const hash = createHash('sha256').update(ip).digest('hex').slice(0,24);
 const minute = Math.floor(Date.now() / 60000), key = `scamsense:${hash}:${minute}`;
 const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN;
 if (url && token) {
 try {
 const r = await fetch(`${url.replace(/\/$/,'')}/pipeline`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify([['INCR',key],['EXPIRE',key,120]]), signal: AbortSignal.timeout(3000) });
 if (!r.ok) return false;
 const result = await r.json(); return Number.isInteger(result[0]?.result) && result[0].result <= 20;
 } catch { return false; }
 }
 // Best-effort per-instance limit. Use shared Redis for global protection.
 for (const [k,v] of buckets) if (v.expires < Date.now()) buckets.delete(k);
 if (buckets.size > 2000) return false;
 const bucket = buckets.get(key) || { count: 0, expires: Date.now() + 120000 };
 bucket.count++; buckets.set(key,bucket); return bucket.count <= 20;
}
export function sameOrigin(request) {
 const origin = request.headers.get('origin');
 if (!origin) return true;
 try {
 const parsed = new URL(origin);
 if (!['http:', 'https:'].includes(parsed.protocol)) return false;
 // Next.js may construct request.url with localhost behind the local/Vercel proxy.
 const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host;
 return parsed.host === host && parsed.protocol === (request.headers.get('x-forwarded-proto') ? `${request.headers.get('x-forwarded-proto')}:` : new URL(request.url).protocol);
 } catch { return false; }
}
export async function readBody(request) {
 const text = await request.text();
 if (text.length > 20000) throw new Error('Request too large.');
 return JSON.parse(text);
}
