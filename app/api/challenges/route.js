import { challenges, getScenario, visibleScenario } from '../../../lib/scenarios.mjs';
import { newSession, signSession } from '../../../lib/session.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request) {
 const id = new URL(request.url).searchParams.get('id') || 'starter';
 const challenge = Object.hasOwn(challenges,id) ? challenges[id] : null;
 if (!challenge) return Response.json({ error: 'Choose a valid challenge.' }, { status: 400 });
 return Response.json({ challenge: { id, name: challenge.name, level: challenge.level }, scenarios: challenge.ids.map(id => visibleScenario(getScenario(id))), token: signSession(newSession(challenge)), aiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()) }, { headers: { 'Cache-Control': 'no-store' } });
}
