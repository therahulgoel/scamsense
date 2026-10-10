<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ScamSense project context

- Public demo: https://scamsense-lemon.vercel.app/
- Source repository: https://github.com/therahulgoel/scamsense
- Next.js frontend and Node.js route handlers deploy together on Vercel.
- Preserve creator credit: Built by @therahulgoel.
- README.md leads with the player experience and documents setup, operations, validation and limitations; PRODUCT_PLAN.md records shipped scope; HACKATHON.md contains the pitch and honest judging assessment. Keep all three consistent when behavior changes.
- Keep credentials server-side. Never read or print `.env.local` when updating docs; never commit secrets or add a `NEXT_PUBLIC_` API key.
- Grade from reviewed scenario labels. AI receives only player-visible evidence; unavailable AI must remain visibly unavailable and excluded from accuracy.
- Run `npm test` and `npm run build` for application changes. Documentation-only edits need link and consistency review, not additional paid API calls.
