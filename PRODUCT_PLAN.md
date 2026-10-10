# ScamSense — Think you’re unscammable?

Built by [@therahulgoel](https://x.com/therahulgoel)

Status: implemented and publicly deployed. Local tests, production build and backend flow checks passed. One live production Decisions comparison was verified on 10 October 2026.

- Play: [scamsense-lemon.vercel.app](https://scamsense-lemon.vercel.app/)
- Source: [therahulgoel/scamsense](https://github.com/therahulgoel/scamsense)
- Deployment and operations: [README](README.md)

## Product promise
Learn to pause, spot manipulation, and choose a safer next action through short fictional SMS challenges. Compete against AI, then practice the tactics you missed. Competition attracts attention; useful feedback provides the reason to return.

## Audience and real use case
Start with Indian students and working professionals who receive bank, parcel, job, payment, and utility messages. A player completes a five-message round, learns where their judgment was weak, and shares the same challenge with a family or friends group. Do not ask players to upload personal SMS in the MVP.

## Experience
1. Landing: one promise, five messages, about two minutes, one Play button, no login. Say all messages are fictional.
2. Challenge: sender and message in a phone-style bubble; round progress; three large choices: Likely legitimate / Suspicious—verify / Clear scam. Keep the AI answer hidden.
3. Reveal: correct verdict, player verdict, actual AI verdict, highlighted evidence, and a reviewed safer next action. Never shame incorrect answers.
4. Result: verdict accuracy, AI accuracy, and one tactic to practice. No fabricated percentile or claim that a game score establishes real-world safety.
5. Practice: select an unseen reviewed scenario for the player's weakest observed tactic. If all answers are correct, offer a harder example. Treat one mistake as limited evidence, not a diagnosis.
6. Sharing: same challenge ID, same order, no answer spoilers. Provide share text and a copy-link fallback. Friends see their own results after playing. No forced signup or contact access.

## Visual and accessibility direction
Mobile first; generous reading space; warm off-white canvas, vivid violet, golden accents, mint success states, and a friendly detective mascot. The redesigned landing leads with “Think you’re unscammable?” and a human-versus-AI matchup. SMS text is 20px on small phones and 22px on desktop; choice labels are 18–19px. Rounded case cards, crisp typography, tactile buttons, and a trophy-style result. Include “Built by @therahulgoel” in the footer, result/share card, and README. Link the footer and results to the creator’s X profile. One primary action per screen. Use large readable message text and touch targets of at least 44px. Keyboard operation, visible focus, reduced-motion support. Communicate results through words and icons as well as color. No countdown pressure; optional playful motion must not slow the reveal.

## Content and scoring
Prepare 15 manually reviewed scenarios: three each for KYC, UPI, parcels, jobs, and electricity bills. Include clear scams, plausible legitimate messages with enough visible context, and examples where independent verification is the defensible answer. Difficulty reflects subtlety, not message length or bad spelling.

Each record contains ID, version, text, sender, display context, category, difficulty, verdict, tactic tags, evidence spans, explanation, and safer action. Label only what the evidence shown to the player supports. Do not score a vague message as legitimate based on hidden fictional intent. Use reserved .example domains for fictional links; render them as inert text.

Award 100 XP per correct verdict and 25 bonus XP for each correct answer from the third consecutive correct answer onward; a miss resets the streak. Show verdict accuracy separately for fair AI comparison. Optional clue selection can provide bonus points and better adaptation if time permits; it is not required for the first build. Reviewed scenario data controls scoring. AI receives only the same visible message/context as the player, never answer keys or hidden tactic tags.

## AI implementation
Server-side Decisions request: choice for verdict, predicates for tactic presence, the shipped MVP uses no `score` question. Use reviewed explanations for educational feedback. Validate returned answers. A refusal, timeout, or error means AI unavailable for that round and is excluded from AI accuracy, not counted as wrong. Successful reveals include an expandable API receipt with model, endpoint, elapsed time and real tactic probabilities. Explain that reopening a stored receipt does not run a new request. Never invent an answer to preserve a scoreboard.

For the hackathon, use reviewed static content; live content generation is a later experiment requiring validation. Keep the API key in server environment variables. Add request limits and a bounded set of accepted scenario IDs. The backend looks up evidence from a scenario ID; do not expose an unrestricted public API proxy. Keep answer keys server-side and return them only after a guess.

## Share and return loop
Share text uses the real player score and includes the AI score only when all five AI answers were available: “I scored 4/5 on ScamSense. AI got 4/5. Five texts. One scam showdown. Can you beat me?” Use genuine results. Launch with a fixed challenge to simplify comparisons. Later offer a reviewed daily challenge and optional Hindi/Hinglish content. Measure completed rounds, share clicks, incoming challenge visits, and repeat play; do not promise virality or collect message content for analytics.

## Original three-hour implementation budget
- 0–25 min: establish API access, confirm hosting path, define data contract, review initial scenarios.
- 25–75 min: responsive landing, challenge, reveal, scoring, and result loop.
- 75–115 min: server Decisions integration, independent scoring, response validation and honest failure states.
- 115–140 min: targeted practice and same-challenge links; add share/copy behavior.
- 140–165 min: deploy and verify on a phone and desktop; check keyboard controls, content, score transitions, and API failure handling.
- 165–180 min: repository README, public demo link, and 90-second presentation rehearsal.

If behind schedule, cut streak animations, clue bonus scoring, and share-card image export first. Preserve the full round, reviewed explanations, live API comparison, targeted practice, and a working public demo.

## Delivery and demo
A Next.js frontend and server backend hosted together on Vercel; public code repository with setup instructions, architecture, tools used, and limitations. GitHub Pages alone needs a separate backend for live AI. The production destination is https://scamsense-lemon.vercel.app/; credentials are configured privately in Vercel.

Judge demo: play one obvious trap, show an ambiguous message, reveal the independent answer key and real AI prediction, show one targeted practice question, and finish with the friend challenge. Explain that the goal is better judgment, including when to verify, rather than promising automatic fraud detection. Do not rely on AI being wrong for an engaging demo.

## Acceptance criteria
Public link opens without login. A five-message round can be completed. Answers are scored from reviewed data. AI sees no hidden labels. A missing AI response leaves the game usable and honestly labeled. Practice selects an appropriate unseen scenario when available. Challenge URLs reproduce the same versioned questions. API secrets do not appear in the browser or repository. Mobile layout and keyboard navigation work. README documents OpenAI usage and the fictional nature of the exercise.

## Later scope
Reviewed multilingual packs, daily challenges, clue selection, teacher/group mode, measured learning improvement on new questions, and an interactive ChatGPT integration. Exclude live personal-message analysis, accounts, leaderboards, and autonomous generation from the initial demo.


## Shipped implementation
Next.js with React, JavaScript and responsive CSS, plus Node.js server route handlers in one repository. Host the full app on Vercel Hobby for this personal, non-commercial demo, within plan limits. No database or player account is needed for the MVP. Persist local progress in the browser; keep reviewed scenarios and grading on the server.

- GET /api/challenges?id=starter returns a versioned set of display-only scenarios.
- POST /api/answers accepts a signed round token, scenario ID, and player verdict. The server validates the signature and next case, grades from reviewed data, requests an AI verdict from the same visible evidence, and returns reveal data plus an updated signed token.
- POST /api/practice accepts a completed round token, chooses an unseen reviewed scenario based on missed tactics, and returns a separate practice token.
- Share URLs use a stable challenge ID and an optional validated sender score. A sender score is self-reported, not a verified leaderboard result.

Scoring: 100 XP per correct verdict, 25 bonus XP for each correct answer from the third consecutive correct answer onward; an incorrect answer resets the streak. Practice earns separate practice feedback and never changes the competitive round score. Both competitors' accuracy is displayed separately from XP.

Credential: OPENAI_API_KEY supplied privately in .env.local for local development and as a Vercel server environment variable. Use an OpenAI Platform project key with permission and access to POST /v1/decisions and gpt-6-luna, and available API billing or credits. No separate Decisions-specific key. Never ask players for a key. Add .env.local to .gitignore and provide .env.example containing only placeholders.

Verification performed: local tests covered scenario integrity, signed sessions, scoring, AI input separation and failure handling. Local HTTP and browser checks covered the five-message round, streaks and separate practice scoring. The production build passed and local client assets were checked for server-only content. A small authenticated Decisions call succeeded, followed by a successful first-case comparison on the public deployment.

Delivery package: public playable URL, GitHub source link, README setup and architecture, and a 90-second demo script. Public verification covered one KYC case; full-round scoring and practice were checked locally.


## Hosting decision
User selected Vercel for both frontend and real backend. Source can live on GitHub. OPENAI_API_KEY is a server environment variable, never a browser credential. No paid database or custom domain is needed for the MVP. OpenAI usage is billed separately. The README contains deployment steps and honest API failure behavior.

## Honest positioning and evaluation

Pitch: “Beat the AI. Then teach your family the trick.” The production AI predictions come from real OpenAI requests; the SMS and reviewed training content are fictional. Never claim that the game uses real victim messages or no fictional data. It is not a ChatGPT integration.

The supplied event criteria are usefulness, technical execution, originality and how well the solution works. The strongest assets are the working public demo, independent grading and live human-versus-AI mechanic. Originality and unmeasured learning benefit remain limitations. A polished demo can compete, but no outcome or virality is guaranteed. See HACKATHON.md for the detailed assessment and pitch.
