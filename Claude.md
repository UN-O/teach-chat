# Project Overview

**teach-chat** — A teacher-parent communication simulator for new teachers in Taiwan.
Architecture: Service-Oriented Architecture (SOA)

---

# Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript 5, React 19)
- **Package manager**: pnpm
- **Styling**: Tailwind CSS v4 + shadcn/ui (`neutral` base, `lucide-react` icons)
- **Font**: Chiron GoRound TC + Noto Sans TC + DM Sans
- **AI**: Vercel AI SDK (`ai` v6 + `@ai-sdk/react`) — use `useChat` / `streamText` Vercel AI SDK 6 (`ai`, `@ai-sdk/openai`, `@ai-sdk/google`) 
- **HTTP**: `ky` for fetch wrapper (`src/lib/fetch.ts`); `swr` for client-side data fetching
- **Utilities**: `clsx` + `tailwind-merge` via `cn()` helper (`src/lib/utils.ts`); `class-variance-authority` for component variants
- **Testing**: not configured yet — add Jest + Playwright (`--chrome`) in the setup task
- **Deployment**: Vercel

### LLM Providers

The app supports **OpenAI** and **Google Gemini** interchangeably. Provider selection is automatic based on environment variables:

- `GOOGLE_GENERATIVE_AI_API_KEY` → uses `gemini-3.1-pro-preview`
- `OPENAI_API_KEY` → uses `gpt-5-mini`

gemini first

---

## AI SDK v6 重要注意事項

> **必讀：** 以下規則適用於本專案所有 LLM 呼叫，違反會造成 runtime 錯誤或行為異常。

### 1. 只使用 `generateText`，不使用 `generateObject`

本專案所有 LLM 呼叫以 generateText 為主 *嚴禁使用 `generateObject`* 這已經被淘汰。

### 2. 禁用 `maxOutputTokens`

AI SDK v6 **不支援** `maxOutputTokens` 參數，傳入會導致 TypeScript 型別錯誤或被靜默忽略。如需控制輸出長度，請在 prompt 內以文字指示模型。

```ts
// ✅ 正確
await generateText({ model, prompt: '請用 2–3 句話回答...' });

// ❌ 錯誤 — v6 不接受此參數
await generateText({ model, prompt, maxOutputTokens: 200 });
```

### 3. 大多數模型不支援 `temperature`

目前主流模型（包含 Gemini 3.1 系列與 GPT-5 mini 系列）**不接受 `temperature` 參數**，傳入會被模型 provider 忽略或拋出錯誤。**不要在任何 `generateText` 呼叫中設定 `temperature`**。

```ts
// ✅ 正確
await generateText({ model, prompt });

// ❌ 錯誤 — 大多數 v6 模型不支援
await generateText({ model, prompt, temperature: 0.7 });
```

### 4. 最新支援模型

| Provider | 模型 ID |
|---|---|
| OpenAI | `gpt-5-mini`（及同系列變體） |
| Google | `gemini-2.5-flash`、`gemini-3-flash-preview`、`gemini-3.1-pro-preview`（及同系列變體） |

`src/lib/llm/config.ts` 中的模型選擇請以上述為準，避免使用已棄用的舊版模型名稱，優先使用 gemini 模型
update time: 2026/03/16

### 5. 結構化輸出使用 `Output.object()`

搭配 `generateText` 使用 `Output.object()` + Zod schema，**不要使用已棄用的 `generateObject`**。

```ts
import { generateText, Output } from 'ai';
import { z } from 'zod';

const { output } = await generateText({
  model,
  output: Output.object({
    schema: z.object({ result: z.string() }),
  }),
  prompt,
});
```


---

# Folder Structure

Current state: all folders exist.

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/        # /home, /about, /technique, /blog, /how-to-use
│   ├── polish/             # /polish — message rewrite tool (PolishService)
│   ├── scenario/
│   │   ├── page.tsx        # /scenario — scenario list
│   │   └── [name]/
│   │       ├── page.tsx    # /scenario/[name] — intro + difficulty selection
│   │       └── [uuid]/     # game session: intro → chatlist → chat → phase*/sectionclose → final
│   └── api/                # Route handlers (AI stream endpoints)
├── services/               # SOA service layer (pure functions / classes)
│   ├── ScenarioService.ts  # scenario data & parent persona prompts
│   ├── ScoringService.ts   # rubric evaluation (T01–T14)
│   └── PolishService.ts    # message rewriting via AI SDK
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui primitives (added via `pnpm dlx shadcn add`)
│   └── game/               # scenario-specific components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── utils.ts            # cn() helper (clsx + tailwind-merge)
│   └── fetch.ts            # ky-based fetcher for swr
├── data/                   # Static scenario TS data files
└── types/                  # Shared TypeScript interfaces
```

---

# Style Guidelines

> Full spec: `style.md` — Editorial UI × React × Tailwind v4 × shadcn/ui

- **Design philosophy**: Editorial UI — reading experience first. Layout is design, whitespace is narrative, illustration is language.
- **Color palette**: `#B6D0E2` background · `#FFFFFF` surface · `#000000` primary text · `#2A3D66` secondary/deep-blue · `#808080` muted · `#FF5A5F` accent (max 2–3 uses/page) · `#4A90E2` accent-alt. Tokens defined in `globals.css` `@theme {}` — use short Tailwind utilities (`text-primary`, `bg-background`, `text-secondary`, `text-muted`, etc.) **not** `text-primary` 等. No gradients, no glassmorphism.
- **Typography**: `Chiron GoRound TC` (H1–H3, local font) · `Noto Sans TC` (body, Google Fonts) · `DM Sans` (English labels/eyebrow/numbers, Google Fonts). Only 3 weights: `400` / `500` / `700`. Line width: `max-w-[65ch]`.
- **Font setup**: Load via `next/font/local` (Chiron) + `next/font/google` (Noto TC, DM Sans); expose as CSS variables `--font-chiron`, `--font-noto-tc`, `--font-dm-sans`.
- **CSS**: Tailwind v4 uses `@import "tailwindcss"` + `@theme {}` block (not `@tailwind base/components/utilities`). All design tokens defined in `globals.css` using `@theme`.
- **Components**: Use `class-variance-authority` (cva) for multi-variant components. Cards use `rounded-xl`, elements use `rounded-lg`, badges use `rounded-md`. Use shadow tokens (`shadow-soft` / `shadow-md` / `shadow-lifted`) — never hardcode shadow RGBA values. No icons inside cards — use eyebrow labels instead.
- **Motion**: Fade-in only (`opacity` + `translateY(12px)`). No bounce, no spring, no rotation. Use `transition-shadow` / `transition-colors` for hover, not `transition-all`.
- **Layout**: Section padding `py-24 px-6 md:px-16`. Asymmetric grids: `grid-cols-[3fr_2fr]` or `[2fr_3fr]`. No 1:1 symmetric layouts.
- **Illustrations**: `mix-blend-multiply` to blend with background. No rounded corners, no shadow, no card background on illustrations.
- **Mobile-first**: Design for 375px viewport first; desktop is enhancement.
- **Tone**: Empathetic, encouraging — never clinical or alarming.
- **UI language**: Chinese (Traditional, zh-TW); set `lang="zh-TW"` on `<html>`.

---

# Service Design Rules (SOA)

- Each service lives in `src/services/` and is responsible for one domain.
- Services must NOT import from `app/` or `components/`.
- AI calls use the Vercel AI SDK (`ai` + `@ai-sdk/react`). Streaming responses go through `app/api/` route handlers; services build the prompts and config, routes call `streamText`.
- Client components use `useChat` (from `@ai-sdk/react`) pointing at those route handlers.
- Data fetching in client components: use `swr` with the `fetcher` from `src/lib/fetch.ts`.
- Services should be independently testable (pure inputs/outputs where possible).

---

# Task Creation Rule

- For each new task, add an item to `README.md` task checklist.
- After finishing a task, put a checkmark `[x]` on the item.

---

# File Naming

All file names are lowercase with hyphens (e.g., `submit-form.tsx`, `user-profile.ts`).

---

# shadcn/ui

All shadcn/ui components are available. Prefer using them to simplify component code wherever applicable.

---

# Task Pipeline

1. **Branch** — format: `{prefix}/{description}` (e.g. `feat/auth`, `feat/dark-mode`). Prefix: `feat/` in most cases; `chores/`, `bugfix/`, `hotfix/` when appropriate. Description: a single lowercase word; use `-` to join words only if unavoidable. Checkout to that branch.
2. **Doc** — create a task doc in `Todo/` named `<branch-name>.md`.
3. **Plan** — describe exactly what to do in the task doc before writing any code.
4. **Generate** — follow the plan to implement.
5. **Test** — verify:
   - All unit/service tests pass
   - Frontend renders correctly (`playwright --chrome`)
   - Style aligns with the style guidelines above
   - Code is clean and not over-abstracted
6. **Commit** — follow the Commit Rules below.
7. **PR** — open a pull request to merge changes back to `main`.

---

# Commit Rules

### Format

`{Type}: {Capitalized sentence}`

| Type | When to use |
|---|---|
| `Feat` | New feature or functionality |
| `Chores` | Maintenance, config, tooling |
| `Bugfix` | Non-urgent bug fix |
| `Lintfix` | Lint-only changes |
| `Hotfix` | Urgent bug fix |
| `Test` | Test-related changes |

### Granularity

- Multiple commits per branch are allowed.
- Each commit must reflect exactly what its message describes.
- If a single file needs to be split across two commits, stage only the relevant lines (e.g. `git add -p`) — do not bundle unrelated changes.

### Amending a commit

To revise recent commits: soft reset, incorporate all new changes, then re-commit. Soft reset may span multiple commits, but only commits authored by Claude — never reset or modify commits made by the developer.

### Temporary commits

Temporary commits by developers will appear in all-caps: `TEMP TRANSFER`, `DONE`, `NOT DONE`, etc. Treat these as human-managed; do not reorder, squash, or modify them.

---

# Environment Variables

```
# .env.local (never commit)
ANTHROPIC_API_KEY=          # Claude API key — used by Vercel AI SDK on the server
NEXT_PUBLIC_APP_URL=        # e.g. https://teach-chat.vercel.app
```

- Install packages with `pnpm add` / `pnpm add -D`.
- Add shadcn components with `pnpm dlx shadcn add <component>`.
- Never commit `.env.local`. Add all new vars to `.env.example` when introducing them.

---

# Allowed Commands (no confirmation needed)

Claude may run the following commands autonomously without asking the user first:

**pnpm**
- `pnpm install` / `pnpm i`
- `pnpm add <pkg>` / `pnpm add -D <pkg>`
- `pnpm remove <pkg>`
- `pnpm run <script>` (dev, build, lint, test, etc.)
- `pnpm dlx shadcn add <component>`
- `pnpm dlx <tool>`

**git**
- `git status` / `git log` / `git diff`
- `git add <file>` (specific files only; not `git add -A` or `git add .` near `.env*`)
- `git commit -m "..."`
- `git checkout -b <branch>` / `git checkout <branch>`
- `git pull` / `git fetch`
- `git push` (to non-main branches only — confirm before pushing to `main`)
- `git stash` / `git stash pop`

**rm** (local files in the repo only)
- `rm <file>` — single file removal
- `rm -r <directory>` — recursive removal of a local directory (repo scope only)
- Never `rm -rf /`, never target files outside the project root

> Destructive or irreversible actions (force push, `reset --hard`, deleting branches, removing `.env` files) still require explicit user confirmation.

---

# Omit / Avoid

- Do not generate lorem ipsum — all copy must come from `/docs/page-content.md` or be confirmed with the team.
- Do not store game session state on the server — use client-side Zustand only.
- Do not hard-code Chinese strings outside of `data/` or `/docs/page-content.md` source — keep copy centralized.
