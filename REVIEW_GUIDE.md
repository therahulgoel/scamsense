# ScamSense: implementation and verification guide

[Public demo](https://scamsense-lemon.vercel.app/) · [Problem and usage](https://scamsense-lemon.vercel.app/about) · [Setup](README.md#run-locally)

This document maps product claims to observable behavior and source code. It is a navigation aid for human and automated reviewers, not a substitute for running the application.

## Problem and intended outcome

People need to judge messages in context, rather than memorize that every urgent or unfamiliar SMS is fraudulent. ScamSense provides safe rehearsal: read a fictional SMS, choose a verdict, compare with an independent AI prediction, then learn a clue and a safer action. Indian contexts include UPI, KYC, parcel delivery, employment and electricity bills.

A five-case round is intended for individual practice, a family challenge or a facilitated awareness discussion. The intended outcome is better verification habits. Learning gains, long-term retention and fraud prevention have not been measured.

## What the Decisions API contributes

A fixed quiz can teach authored lessons without AI. Here, a live model adds an independent competitor whose judgment can be compared with the player's. Decisions provides a constrained verdict through `choice` and tactic estimates through four `predicate` questions in one request. These outputs fit a scoreboard and signal display directly. They do not demonstrate superiority over another model or API; no comparative benchmark has been run.

The code uses `POST https://api.openai.com/v1/decisions` with `gpt-6-luna`. Codex helped build the application; it is not the runtime opponent. Scenarios and explanations are authored, not generated live.

## Evidence map

| Claim | Where to inspect | What to verify |
| --- | --- | --- |
| Real server-side AI request | [lib/decisions.mjs](lib/decisions.mjs), `evaluate` | Fixed endpoint, private Authorization header, timeout and response parsing; no random or prerecorded production verdict. |
| Same evidence for AI and player | [lib/decisions.mjs](lib/decisions.mjs), `decisionRequest`; [app/api/challenges/route.js](app/api/challenges/route.js) | AI receives sender, SMS and visible context, not the answer label or player choice. |
| Independent grading | [app/api/answers/route.js](app/api/answers/route.js), `grade` | Player and AI verdicts are each compared with `scenario.verdict`. |
| Authored training content | [lib/scenarios.mjs](lib/scenarios.mjs) | Fifteen scenarios, three packs, labels, evidence, lessons and actions. Labels are author-reviewed, not externally certified. |
| Useful failure behavior | [lib/decisions.mjs](lib/decisions.mjs), `parseDecision` / `evaluate`; [app/Game.js](app/Game.js), `CaseReveal` | Missing credentials, refusal, malformed verdict, HTTP failure or timeout yield unavailable AI. Training continues; unavailable cases do not enter AI accuracy. |
| Targeted practice | [app/api/practice/route.js](app/api/practice/route.js), [lib/scenarios.mjs](lib/scenarios.mjs) | Selection uses missed tactics and an unseen authored case. It is deterministic selection, not AI-generated personalization. |
| Signed progression | [lib/session.mjs](lib/session.mjs), answer route | HMAC token verification, expiry and next-case validation. Signing does not prevent someone from reading the public source or replaying practice cases. |
| Public request controls | [lib/limits.mjs](lib/limits.mjs), answer route | Known IDs, input bounds, origin checks and rate limits. Default in-memory counters and duplicate handling are per instance, not global. |
| Responsive learning flow | [app/Game.js](app/Game.js), [app/globals.css](app/globals.css) | Desktop split layout, mobile reading order, focus management, reduced motion and visible unavailable states. |
| Sharing | [app/Game.js](app/Game.js) | Stable challenge link, score card and self-reported friend score. There is no verified leaderboard. |
| Accessible product explanation | [app/about/page.js](app/about/page.js) | Static HTML explanation available without a game session, JavaScript interaction or an AI request. |

## Follow one answer through the system

1. `GET /api/challenges?id=starter` returns five display cases and a signed token. It does not return the answer keys.
2. The player submits `{ token, scenarioId, verdict }` to `POST /api/answers`.
3. The route validates origin, body, token, verdict and expected next case; request limits apply.
4. The server selects its authored scenario and calls `evaluate`. The player's verdict is not passed to that function.
5. The server compares both answers with the authored label and returns the result, lesson, evidence, score and updated signed token.
6. The UI shows the result and lets the player inspect a receipt summarizing the parsed API output and server-measured duration. Reopening it makes no new request. It is not a signed audit record or full raw upstream response.

## Reproduce a review

```sh
npm install
cp .env.example .env.local
npm test
npm run build
npm run dev
```

For live verification, configure a private `OPENAI_API_KEY` with Decisions access and available credits in `.env.local`. Keep it out of source control. Without it, the game intentionally runs in visibly unavailable-AI training mode. Live requests incur API usage; unit tests use injected fixtures and do not verify account access.

Open the game, choose First instincts and answer a case. Inspect the player verdict, authored correct answer and AI verdict separately. Expand **Explore the real Decisions response**. For a successful request, expect the model, endpoint, elapsed duration and returned tactic estimates. Browser network tools show the app's `/api/answers` response; the private OpenAI request originates on the server.

Finish a round with at least one mistake, inspect the score and try practice. Return home and resume. Try a narrow viewport and keyboard navigation. To inspect the failure path locally, start without an API key: lessons and points should work, AI should read unavailable, and no invented verdict should appear.

## Validation and boundaries

Eight automated tests cover scenario integrity, evidence separation, scoring, practice selection, token validity and upstream error handling. `npm run build` checks the production build. Successful live calls and responsive browser checks were recorded on October 10, 2026; these do not imply continuous uptime or a measured accuracy rate. See [HACKATHON.md](HACKATHON.md#validation-record) for the validation record.

The demo does not screen real SMS, verify senders, access a bank account or prevent payments. It has no database, login, externally audited labels, multilingual content or completed efficacy study. Local progress and share scores can be edited by a player; the public repository also exposes the training answers. This is a learning game, not an exam or security guarantee. The README documents serverless rate-limit and spend-control limitations.
