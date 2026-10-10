# ScamSense: pitch and honest review

[Play](https://scamsense-lemon.vercel.app/) · [Source](https://github.com/therahulgoel/scamsense) · [Built by @therahulgoel](https://x.com/therahulgoel)

## The 30-second pitch

“Think you’re unscammable? Prove it in five texts. ScamSense puts your judgment up against OpenAI’s live Decisions API. You both get the same message and context, and an authored answer key grades you independently. After each choice, you learn the trick and a safer next step. Then challenge your family group to the same cases. Beat the AI. Pass on the instinct.”

## Can it win?

It is a credible working entry. Winning depends on competing projects, judging and the demonstration; there is no basis for assigning a win probability.

The supplied Bengaluru event brief names four judging criteria:

| Criterion | Assessment | Evidence or remaining gap |
| --- | --- | --- |
| Usefulness | Clear intended use | Safe practice for SMS judgment; family, classroom and workplace discussion. No measured learning improvement yet. |
| Technical execution | Solid MVP | Live Decisions API, server-side grading, signed progress, explicit failure states and deployed frontend/backend. |
| Originality | Moderate | Scam quizzes are a familiar concept. Competing against a real AI and exposing its fallibility is the distinguishing interaction. |
| How well it works | Demonstrable | Public game, local full-round tests, practice and sharing. Limited to 15 English-language fictional cases. |

The new design improves readability and makes the actual AI interaction visible. Design alone does not establish usefulness. The next strongest evidence would be a small observed playtest: record completion, which explanations players understand, and whether they correctly handle an unseen case afterward. Do not present this proposed study as completed.

## What is real, and what is authored?

- **Real:** server requests to OpenAI `POST /v1/decisions`, returned verdicts and tactic probabilities, measured response duration, player scoring and challenge links.
- **Authored:** fictional SMS scenarios, training labels, highlighted evidence and educational explanations.
- **Not shipped:** a ChatGPT plugin, live scenario generation, multilingual packs, a global leaderboard or proof of reduced fraud losses.
- **Test fixtures:** unit tests inject responses to test error handling. Production has no fake-AI fallback.

The technical demonstration uses the Decisions API’s `choice` and `predicate` questions, powered by `gpt-6-luna`. It does not use `score`, Agents, Dots or a ChatGPT sidebar plugin. Codex was used to build and refine the app. Do not claim launch features that are not in the project.

## The DevDay connection

OpenAI released Decisions in beta on October 6, 2026 ([official changelog](https://developers.openai.com/api/docs/changelog)). ScamSense uses it to turn message evidence into a typed verdict and tactic estimates during live play. Show the request-driven animation and response receipt; explain the practical benefit rather than just listing API names.

## A 90-second demonstration

1. **0–15 seconds:** Show the public page. “Five texts. You versus AI. No signup.”
2. **15–40 seconds:** Answer the first KYC case. Show both verdicts, the clue and safer next action.
3. **40–55 seconds:** Expand the live Decisions receipt. Explain that the API sees no training label or player answer, and can lose fairly.
4. **55–75 seconds:** Show a result from a round you actually played. Open the practice case and explain how it targets a missed tactic.
5. **75–90 seconds:** Show the friend challenge and score card. Close: “The win is the conversation this starts before a real suspicious message arrives.”

Prepare a completed round before presenting if time is short. Identify saved results as saved results. An unavailable AI response should stay visibly unavailable.

## Share pitch

“Think you’re unscammable? Five texts. Two minutes. You versus AI. Play ScamSense, then challenge the family group: https://scamsense-lemon.vercel.app/”

The in-game share message uses your actual score and includes the AI score only if all five AI responses were available. Links reproduce the same challenge. Shared player scores are self-reported. Social previews and downloadable score cards reduce sharing friction; they do not guarantee virality.

## Validation record

- Existing automated tests cover scenario integrity, visible evidence, signed tokens, scoring, practice selection and API failure behavior.
- The original public deployment successfully returned a live Decisions prediction on 10 October 2026.
- The redesign passed all eight automated tests and a production build. A browser round with one deliberate miss produced 4/5, 400 XP and five real AI responses. An unseen practice case targeted the missed context clue. Mobile width was checked at 390px with no horizontal overflow.
- The redesign adds larger type, stronger contrast, an integration explanation, an actual-response receipt and creator follow links.
- User research, learning outcomes and broad accessibility certification remain future work.
