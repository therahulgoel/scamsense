# ScamSense — Nice try, scammer.

**Built by @therahulgoel.** Five fictional SMS messages. You versus the Decisions API. Spot the trap, learn the clue, and challenge a friend.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://127.0.0.1:3000. Set `OPENAI_API_KEY` in `.env.local` to enable live AI. Without a key, all training and scoring work, but AI is visibly unavailable and excluded from comparisons. No simulated AI answers are used.

## Deploy to Vercel (free Hobby hosting within its limits)

1. Create a personal Vercel account and a GitHub repository for this folder. Do not upload `.env.local`.
2. In Vercel, choose **Add New → Project**, import that repository, and keep the detected **Next.js** framework settings. If importing the parent folder, set Root Directory to `scamsense`.
3. Add `OPENAI_API_KEY` as a server environment variable for Production (and Preview if needed). Obtain an OpenAI Platform project key at https://platform.openai.com/api-keys with billing/credits and access to `POST /v1/decisions` using `gpt-6-luna`.
4. Deploy. Open the returned `.vercel.app` URL and play a round. If adding the key after deployment, redeploy to apply it.
5. Verify the reveal says **Live Decisions AI** before claiming the AI comparison is live.

No custom domain or paid database is required. Vercel Hobby is for personal/non-commercial usage. OpenAI inference is separately metered; event credits may cover eligible usage. Hosting quotas do not limit OpenAI spend.

If using the Vercel CLI instead: run `npx vercel`, sign in, link this project, add the key in the Vercel project dashboard, and run `npx vercel --prod` after local checks.

## Game

- Three five-case files across KYC, UPI, parcels, jobs and electricity.
- Read the SMS **and context**, then choose likely legitimate / suspicious / clear scam.
- 100 XP per correct verdict. Beginning at the third consecutive correct answer, +25 XP per correct verdict; misses reset the streak.
- Reviewed evidence is highlighted on reveal. A safer next action accompanies every case.
- Player and AI are scored against the author-reviewed answer key, not against each other.
- Targeted practice selects an unseen case using tactics from missed cases. Practice never changes the round score.
- Shared links preserve the same challenge and order. Shared sender scores are self-reported, not a verified leaderboard.
- Native mobile sharing, desktop clipboard fallback and downloadable PNG score cards.
- Local browser progress, keyboard controls, reduced-motion support and no player account.

## Architecture

```text
Browser (Next.js client)
  GET /api/challenges?id=starter → five display-only cases + signed round token
  POST /api/answers → validate token and next case → grade reviewed data
                                          ↓
                                  OpenAI POST /v1/decisions
                                          ↓
  Reveal ← real AI verdict, reviewed lesson and new signed progress token
  POST /api/practice → unseen tactic-matched case + separate practice token
```

`lib/scenarios.mjs` is imported only by server routes and tests; the client cannot fetch the answer key up front. The AI input includes the same sender, message and context visible to the player. It never includes ground truth, evidence highlights, explanations, player choices or XP. A `choice` question makes the verdict and `predicate` questions estimate tactic presence. Tactic probabilities are labeled as model estimates, not proof. Written lessons are authored and reviewed rather than generated at runtime.

Sessions are HMAC-signed and expire after two hours. They prevent clients changing score history when a private signing secret is configured. By default the API key is used for signing. Set a stable independent `GAME_SIGNING_SECRET` if desired; changing signing credentials expires existing rounds. In no-key training mode, the fallback signing secret is public and not intended for trusted scoring; there is no live AI spend or leaderboard in that mode.

Only known scenario IDs are accepted; arbitrary prompts cannot be forwarded to OpenAI. AI timeouts, malformed responses, refusals and upstream failures preserve the reviewed lesson and are excluded from AI accuracy. Duplicate identical submissions reuse the same in-flight response **within one server instance** for two minutes. No cross-instance idempotency or unlimited free inference is promised.

## Rate limits and public demo

The default limiter allows 20 new answer submissions per minute per IP **per server instance**. This is best effort in serverless hosting. For shared rate limits, optionally set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; the server then uses Redis counters and fails closed if the configured store is unavailable. Origin checks reduce unintended browser calls; they are not authentication. Enable appropriate Vercel firewall controls and configure OpenAI project spend controls before broad promotion. Duplicate requests across server instances can still incur API usage. Do not treat local counters as a global cost cap.

All domains in simulated messages use `.example`; messages are inert text. No real SMS, contacts, bank details or personal identifiers are collected. Request IPs are hashed for short-lived rate-limit counters. Your API key is never returned to players. All keys and deployment state are ignored by Git.

## Validation

```sh
npm test
npm run build
```

Tests cover visible-evidence separation, scenario integrity, signed-token tampering/expiry, streak reset, AI availability denominators, unseen practice selection, API request contracts, and error/refusal handling. Live API verification requires the real credential; mocked request tests do not establish account access.

## 90-second judge demo

1. Open the public URL and choose First instincts.
2. Explain that the SMS and its visible context are the full evidence for both contestants.
3. Answer the KYC case and show highlighted clues, the live AI answer and the reviewed answer.
4. Show a plausible ambiguous case: the correct skill is to verify, not distrust everything.
5. Finish a round, show the player/AI score, then open a targeted practice case.
6. Share the same challenge with a friend. Explain the Decisions `choice` and `predicate` questions and independent grading.

Built with Codex. Runtime AI uses the Decisions API with `gpt-6-luna`. A ChatGPT plugin, live generated content and additional languages are future scope.
