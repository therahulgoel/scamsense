import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { challenges, getScenario } from './scenarios.mjs';
const lifetime = 2 * 60 * 60 * 1000;
function secret() { return process.env.GAME_SIGNING_SECRET || process.env.OPENAI_API_KEY || 'training-only-no-ai-credential-v1'; }
export function signSession(payload) {
 const content = Buffer.from(JSON.stringify(payload)).toString('base64url');
 return `${content}.${createHmac('sha256', secret()).update(content).digest('base64url')}`;
}
export function newSession(challenge) { return { sessionId: randomUUID(), challenge: challenge.id, ids: challenge.ids, answers: [], expires: Date.now() + lifetime, practice: false }; }
export function readSession(token) {
 if (typeof token !== 'string' || token.length > 18000) throw new Error('Invalid game session. Start a new round.');
 const [content, signature, ...rest] = token.split('.');
 if (!content || !signature || rest.length) throw new Error('Invalid game session. Start a new round.');
 const expected = createHmac('sha256', secret()).update(content).digest();
 const actual = Buffer.from(signature, 'base64url');
 if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error('Invalid game session. Start a new round.');
 const s = JSON.parse(Buffer.from(content, 'base64url').toString());
 if (!Number.isFinite(s.expires) || s.expires < Date.now()) throw new Error('This round expired. Start a fresh one.');
 if (!Array.isArray(s.ids) || !s.ids.length || s.ids.length > 5 || !s.ids.every(id => getScenario(id)) || !Array.isArray(s.answers) || s.answers.length > s.ids.length || !challenges[s.challenge]) throw new Error('Invalid game session. Start a new round.');
 return s;
}
