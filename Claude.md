# Project Overview

**teach-chat** — A teacher-parent communication simulator for new teachers in Taiwan.
Architecture: Service-Oriented Architecture (SOA)

---

# Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Claude API (`claude-sonnet-4-6`) via Anthropic SDK
- **State**: Zustand (client-side game state)
- **Testing**: Jest (unit/service) + Playwright (e2e, use `--chrome` flag)
- **Deployment**: Vercel

---

# Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # home, about, technique, blog, how-to-use
│   └── scenario/
│       └── [name]/
│           └── [uuid]/     # intro, chatlist, chat, phase*/sectionclose, final
├── services/               # SOA service layer (pure functions / classes)
│   ├── ScenarioService.ts  # scenario data & parent persona prompts
│   ├── ScoringService.ts   # rubric evaluation (T01–T14)
│   └── PolishService.ts    # message rewriting via Claude API
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui primitives
│   └── game/               # scenario-specific components
├── lib/                    # Utilities (claude client, helpers)
├── data/                   # Static scenario JSON/TS data files
└── types/                  # Shared TypeScript interfaces
```

---

# Style Guidelines

- **Color palette**: Warm tones — amber, rose, warm-gray. Avoid cold blues/greens.
- **Typography**: Use `Noto Sans TC` for Chinese; `Inter` for Latin.
- **Mobile-first**: Design for 375px viewport first; desktop is enhancement.
- **Tone**: Empathetic, encouraging — never clinical or alarming.
- **UI language**: Chinese (Traditional, zh-TW).

---

# Service Design Rules (SOA)

- Each service lives in `src/services/` and is responsible for one domain.
- Services must NOT import from `app/` or `components/`.
- API calls to Claude must go through `src/lib/claudeClient.ts` only — never call the Anthropic SDK directly in components or pages.
- Services should be independently testable (pure inputs/outputs where possible).

---

# Task Creation Rule

- For each new task, add an item to `README.md` task checklist.
- After finishing a task, put a checkmark `[x]` on the item.

---

# Task Pipeline

1. **Branch** — format: `name-intention-tasktitle` (e.g. `jerry-feature-mainpage`). Checkout to that branch.
2. **Doc** — create a task doc in `Todo/` named `<branch-name>.md`.
3. **Plan** — describe exactly what to do in the task doc before writing any code.
4. **Generate** — follow the plan to implement.
5. **Test** — verify:
   - All unit/service tests pass
   - Frontend renders correctly (`playwright --chrome`)
   - Style aligns with the style guidelines above
   - Code is clean and not over-abstracted
6. **Commit** — commit with a proper message for each sub-task.
7. **PR** — open a pull request to merge changes back to `main`.

---

# Environment Variables

```
ANTHROPIC_API_KEY=          # Claude API key
NEXT_PUBLIC_APP_URL=        # e.g. https://teach-chat.vercel.app
```

Never commit `.env.local`. Add all new vars to `.env.example` when introducing them.

---

# Omit / Avoid

- Do not generate lorem ipsum — all copy must come from `text.md` or be confirmed with the team.
- Do not store game session state on the server — use client-side Zustand only.
- Do not hard-code Chinese strings outside of `data/` or `text.md` source — keep copy centralized.