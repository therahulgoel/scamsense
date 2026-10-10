import { getScenario, VERDICTS, scoreAnswers } from '../../../lib/scenarios.mjs';
import { readSession, signSession } from '../../../lib/session.mjs';
import { evaluate } from '../../../lib/decisions.mjs';
import { rateLimit, sameOrigin, readBody } from '../../../lib/limits.mjs';
import { createHash } from 'node:crypto';
export const runtime = 'nodejs';
export const maxDuration = 20;
const pending = new Map();
async function grade(session, verdict) {
 const scenario = getScenario(session.ids[session.answers.length]);
 const ai = await evaluate(scenario);
 if (ai.status === 'live') ai.correct = ai.verdict === scenario.verdict;
 const answer = { id: scenario.id, verdict, correct: verdict === scenario.verdict, ai };
 const next = { ...session, answers: [...session.answers,answer] };
 return { answer: { ...answer, groundTruth: scenario.verdict, tactics: scenario.tactics, evidence: scenario.evidence, lesson: scenario.lesson, action: scenario.action }, token: signSession(next), score: scoreAnswers(next.answers), completed: next.answers.length === next.ids.length };
}
export async function POST(request) {
 if (!sameOrigin(request)) return Response.json({ error: 'Use the game website to submit your answer.' }, { status: 403 });
 try {
 const { token, verdict, scenarioId } = await readBody(request);
 if (!VERDICTS.includes(verdict)) return Response.json({ error: 'Choose one of the three verdicts.' }, { status: 400 });
 const session = readSession(token);
 if (session.ids[session.answers.length] !== scenarioId) return Response.json({ error: 'This case is not the next case in your round.' }, { status: 400 });
 const id = createHash('sha256').update(token + verdict).digest('hex');
 for (const [k,v] of pending) if (v.expires < Date.now()) pending.delete(k);
 if (pending.has(id)) return Response.json(await pending.get(id).promise, { headers: { 'Cache-Control': 'no-store' } });
 if (!(await rateLimit(request))) return Response.json({ error: 'Too many requests. Take a short break and try again in a minute.' }, { status: 429, headers: { 'Retry-After': '60' } });
 if (pending.size > 1000) return Response.json({ error: 'The game is busy. Try again shortly.' }, { status: 503 });
 const promise = grade(session,verdict);
 pending.set(id,{ promise, expires: Date.now() + 120000 });
 return Response.json(await promise, { headers: { 'Cache-Control': 'no-store' } });
 } catch { return Response.json({ error: 'Your round expired or the request was invalid. Start a new round.' }, { status: 400 }); }
}
