import { practiceScenario, visibleScenario, TACTICS } from '../../../lib/scenarios.mjs';
import { readSession, signSession } from '../../../lib/session.mjs';
import { sameOrigin, readBody } from '../../../lib/limits.mjs';
import { randomUUID } from 'node:crypto';
export const runtime = 'nodejs';
export async function POST(request) {
 if (!sameOrigin(request)) return Response.json({ error: 'Use the game website.' }, { status: 403 });
 try {
 const { token } = await readBody(request);
 const s = readSession(token);
 if (s.practice || s.answers.length !== s.ids.length) throw new Error('Finish your round first.');
 const { scenario, focus } = practiceScenario(s.answers);
 const next = { sessionId: randomUUID(), challenge: s.challenge, ids: [scenario.id], answers: [], practice: true, expires: Date.now() + 7200000 };
 return Response.json({ scenario: visibleScenario(scenario), focus: focus ? TACTICS[focus] : 'A fresh case', token: signSession(next) }, { headers: { 'Cache-Control': 'no-store' } });
 } catch { return Response.json({ error: 'Finish a valid round before starting practice.' }, { status: 400 }); }
}
