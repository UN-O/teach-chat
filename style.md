# Editorial UI — Style Guide
> React · Tailwind CSS v4 · shadcn/ui

---

## 核心精神

Editorial UI 的本質是「閱讀體驗優先」：排版即設計，留白即敘事，插畫即語言。  
字體配對選擇 **Chiron GoRound TC × Noto Sans TC**，讓整體氣質從「冷靜 editorial」轉向「溫柔 editorial」——依然克制，但多了一份圓潤的親近感。

---

## 1. Design Tokens（CSS Variables）

在 `globals.css` 中定義，配合 Tailwind v4 的 `@theme` 語法：

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* ── Color Palette ── */
  --color-background:   #B6D0E2;   /* 灰藍背景 */
  --color-surface:      #FFFFFF;   /* 卡片/內文區塊背景 */
  --color-primary:      #000000;   /* 主文字、主線條 */
  --color-secondary:    #2A3D66;   /* 次文字、深藍強調 */
  --color-muted:        #808080;   /* 分隔線、灰色次要元素 */
  --color-accent:       #FF5A5F;   /* 可選強調色（按鈕、tag） */
  --color-accent-alt:   #4A90E2;   /* 可選強調色（連結、highlight） */

  /* ── Typography ── */
  --font-display:  "Chiron GoRound TC", "Noto Sans TC", sans-serif;  /* 標題：圓潤幾何 */
  --font-body:     "Noto Sans TC", sans-serif;                        /* 內文：穩定易讀 */
  --font-en:       "DM Sans", "Helvetica Neue", Helvetica, sans-serif; /* 英文：圓潤無襯線，配 Chiron */

  /* ── Spacing Scale ── */
  --spacing-section: 6rem;   /* section 間距 */
  --spacing-block:   3rem;   /* 區塊內間距 */

  /* ── Border & Radius ── */
  --border-thin:        1px;
  --radius-default:     0.5rem;    /* rounded-lg = 8px，元件預設圓角（配合圓潤字體）*/
  --radius-sm:          0.375rem;  /* rounded-md，小元件（badge、tag） */
  --radius-lg:          0.75rem;   /* rounded-xl，卡片或大區塊 */
  --radius-full:        9999px;    /* 僅限 pill badge、avatar */ 

  /* ── Shadow（柔和、無邊框替代） ── */
  --shadow-soft:   0 2px 8px 0 rgba(0, 0, 0, 0.06);
  --shadow-md:     0 4px 16px 0 rgba(0, 0, 0, 0.10);
  --shadow-lifted: 0 8px 24px 0 rgba(0, 0, 0, 0.12);

  /* ── Motion ── */
  --ease-editorial: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fade:  200ms;
  --duration-slide: 300ms;
}
```

---

## 2. Typography

### 字體配對邏輯

| 角色 | 字體 | 氣質 |
|------|------|------|
| **標題（H1–H3）** | Chiron GoRound TC | 圓潤幾何、現代、有個性 |
| **內文（Body）** | Noto Sans TC | 穩定、易讀、中性 |
| **英文輔助** | DM Sans | 圓潤無襯線，與 Chiron 氣質一致 |

> **為什麼是 DM Sans？**  
> Chiron GoRound TC 的中文字形偏圓潤幾何，搭配同樣帶有圓潤感的 DM Sans 比 Inter 更協調。Inter 稍顯工程感，會讓中英混排的視覺張力略微不統一。

---

### 字體引入

**方法 A：自架 / 本地字體（Chiron GoRound TC 需自行取得授權字型檔）**

```css
/* globals.css */
@font-face {
  font-family: "Chiron GoRound TC";
  src: url("/fonts/ChironGoRoundTC-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Chiron GoRound TC";
  src: url("/fonts/ChironGoRoundTC-Medium.woff2") format("woff2");
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: "Chiron GoRound TC";
  src: url("/fonts/ChironGoRoundTC-Bold.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}
```

**方法 B：Google Fonts（Noto Sans TC + DM Sans，Next.js）**

```tsx
// app/layout.tsx
import { Noto_Sans_TC, DM_Sans } from "next/font/google";
import localFont from "next/font/local";

// Chiron GoRound TC — 本地字型
const chironGoRound = localFont({
  src: [
    { path: "../fonts/ChironGoRoundTC-Regular.woff2",  weight: "400" },
    { path: "../fonts/ChironGoRoundTC-Medium.woff2",   weight: "500" },
    { path: "../fonts/ChironGoRoundTC-Bold.woff2",     weight: "700" },
  ],
  variable: "--font-chiron",
  display: "swap",
});

// Noto Sans TC — 內文
const notoTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-tc",
  display: "swap",
});

// DM Sans — 英文輔助
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-TW"
      className={`${chironGoRound.variable} ${notoTC.variable} ${dmSans.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
```

**對應 Tailwind v4 `@theme` 更新：**

```css
@theme {
  --font-display: var(--font-chiron), "Noto Sans TC", sans-serif;
  --font-body:    var(--font-noto-tc), sans-serif;
  --font-en:      var(--font-dm-sans), "Helvetica Neue", sans-serif;
}
```

---

### 字體層級規則

| 層級 | 字體 | 尺寸 | 字重 | 行距 | Tailwind Class |
|------|------|------|------|------|---------------|
| Display / H1 | Chiron GoRound TC | 64–96px | 700 | 1.1 | `font-display text-7xl font-bold leading-[1.1]` |
| H2 | Chiron GoRound TC | 40–48px | 700 | 1.15 | `font-display text-5xl font-bold leading-[1.15]` |
| H3 | Chiron GoRound TC | 28–32px | 500 | 1.25 | `font-display text-3xl font-medium leading-snug` |
| Label / Eyebrow | DM Sans | 12px | 500 | — | `font-en text-xs font-medium tracking-widest uppercase` |
| Body | Noto Sans TC | 16–18px | 400 | 1.7 | `font-body text-base leading-[1.7]` |
| Caption | Noto Sans TC | 13px | 400 | 1.6 | `font-body text-sm text-muted` |

> **行距微調說明**：Chiron GoRound TC 字形較圓潤飽滿，H1 行距建議用 `1.1`（而非原本的 `1.05`），避免行與行之間太過緊密壓迫。

---

### 組合範例

```tsx
{/* Editorial 標題組合 */}
<div>
  {/* Eyebrow：DM Sans，乾淨英文質感 */}
  <p className="font-en text-xs font-medium tracking-widest uppercase text-secondary mb-4">
    Feature Story
  </p>

  {/* H1：Chiron GoRound TC，圓潤大字 */}
  <h1 className="font-display text-7xl font-bold leading-[1.1] text-primary">
    設計是<br />一種閱讀
  </h1>

  {/* Body：Noto Sans TC，穩定舒適 */}
  <p className="font-body mt-6 text-base leading-[1.7] text-primary max-w-[65ch]">
    Editorial UI 讓每個畫面都像雜誌的一頁，排版即設計，留白即敘事。
  </p>
</div>
```

```tsx
{/* H3 + Body 的卡片內層排版 */}
<div className="space-y-3">
  <h3 className="font-display text-2xl font-medium leading-snug text-primary">
    排版即設計
  </h3>
  <p className="font-body text-sm leading-[1.7] text-primary/70">
    每個留白都是敘事的節奏，每個字重都是視覺的層次。
  </p>
</div>
```

---

### 字體使用規則

- **標題（H1–H3）永遠用 Chiron GoRound TC**，即使是短標題也不例外
- **內文、說明文字永遠用 Noto Sans TC**，保持閱讀舒適度
- **純英文的 label、eyebrow、數字** 用 DM Sans，比中文字體渲染英文更精緻
- 每頁只用 3 個字重：`400`（內文）/ `500`（H3、label）/ `700`（H1、H2）
- 行寬控制在 `max-w-[65ch]`（最舒適） 至 `max-w-[75ch]`（最寬）

---

## 3. Color

Tailwind v4 將 `@theme` 中的 `--color-*` 自動對應為 utility class（去掉 `--color-` 前綴）。**一律使用短 token，不要寫 `[var(--color-NAME)]`**：

```tsx
// ✅ 正確：使用短 token
<div className="bg-background">
  <p className="text-primary">主文字</p>
  <p className="text-secondary">次文字（深藍）</p>
  <span className="text-muted">輔助文字</span>
  <button className="border border-primary text-accent">
    Accent Button
  </button>
</div>

// ❌ 錯誤：不需要這樣寫
<div className="bg-[var(--color-background)]">
  <p className="text-[var(--color-primary)]">主文字</p>
</div>
```

opacity modifier 同樣適用：`text-primary/80`、`text-primary/70`、`border-muted/20`

**色彩使用原則：**
- 背景永遠是 `#B6D0E2` 或 `#FFFFFF`（依 section 交替）
- Accent 色（`#FF5A5F`）只用於 CTA、tag、強調詞，一頁最多出現 2–3 次
- 不使用漸層、不使用 glassmorphism
- 陰影可用，但保持柔和（見 Shadow 系統章節）

---

## 4. Layout & Spacing

### Section 結構

```tsx
// 標準 Section 模板
<section className="px-6 md:px-16 py-24 bg-background">
  <div className="max-w-6xl mx-auto">
    {/* 非對稱排版：文字左 + 插畫右 */}
    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-16 items-center">
      <div>{/* 文字區 */}</div>
      <div>{/* 插畫區 */}</div>
    </div>
  </div>
</section>
```

### 版面節奏規則

- **Section 間距**：`py-24`（96px）
- **區塊內間距**：`gap-12` 至 `gap-16`
- **文字段落間距**：`space-y-6`
- **非對稱欄位**：`grid-cols-[3fr_2fr]` 或 `grid-cols-[2fr_3fr]`，避免 1:1 的無聊對稱
- **圓角**：元件統一使用 `rounded-md`（6px），大區塊可用 `rounded-lg`
- **無邊框分區**：用留白和對齊分區，色塊 + 圓角 + 陰影取代 card border

```tsx
// 分隔線：極細、低對比、少用
<hr className="border-t border-muted opacity-40 my-12" />
```

---

## 5. Shadow 系統（柔和陰影）

陰影的作用是「給元素漂浮感」，而非邊框替代品。用得節制，效果才顯著。

### 三個陰影等級

| 等級 | 用途 | Tailwind Class |
|------|------|---------------|
| `shadow-soft` | 卡片、input、次要區塊 | `shadow-soft` |
| `shadow-md` | hover 狀態、浮起元件 | `shadow-md` |
| `shadow-lifted` | Modal、Dropdown、置頂元件 | `shadow-lifted` |

```tsx
{/* Soft Card — 純色塊 + rounded-xl + 柔和陰影 */}
<div className="bg-white rounded-xl shadow-soft p-6">
  內容
</div>

{/* Hover 時提升陰影，給予反饋 */}
<div className="bg-white rounded-xl shadow-soft hover:shadow-md transition-shadow duration-200 p-6">
  互動卡片
</div>

{/* 深色背景卡片 */}
<div className="bg-secondary text-white rounded-xl shadow-md p-6">
  深色卡片
</div>
```

**陰影使用原則：**
- 永遠使用 `rgba` 黑色半透明，不用彩色陰影
- 陰影不替代邊框，也不堆疊（一個元件只用一層陰影）
- 插畫本身不加陰影（保持 editorial 平面感）
- `shadow-lifted` 只保留給 Modal、Popover 等需要分層感的浮層

---

## 6. 插畫整合（Illustration Integration）

插畫是版面敘事的一部分，不是裝飾。

```tsx
// 插畫嵌入規則
<div className="relative">
  <img
    src="/illustration.svg"
    alt="editorial illustration"
    className="w-full h-auto
               object-contain
               mix-blend-multiply   {/* 讓插畫融入背景色 */}
               "
    /* 注意：無 rounded、無 shadow、無 border、無 bg */
  />
</div>
```

**插畫使用規則：**
- 不加 `rounded-*`、不加卡片背景、**不加陰影**（插畫保持平面 editorial 感）
- 使用 `mix-blend-multiply` 讓插畫背景透明融入頁面底色
- 插畫與文字之間保留至少 `gap-12`（48px）的呼吸空間
- 插畫大小不必一致，但要有節奏（一大一小交替）
- SVG 插畫優先（保持線條清晰度）

---

## 7. Components（shadcn/ui 客製化）

### Button

**Step 1：覆寫 `components/ui/button.tsx`**

```tsx
// components/ui/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // base：字體用 font-en（DM Sans）、rounded-lg 配合圓潤風格
  [
    "inline-flex items-center justify-center",
    "font-en text-sm font-medium tracking-wider uppercase",
    "rounded-lg transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        // 主要：黑色純色塊，hover 上浮 + 陰影
        default:
          "bg-[var(--color-primary)] text-white hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.18)] hover:-translate-y-px active:translate-y-0",
        // 次要：白色色塊 + soft shadow
        secondary:
          "bg-white text-[var(--color-primary)] shadow-[0_2px_8px_0_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.12)] hover:-translate-y-px active:translate-y-0",
        // 強調：accent 紅
        accent:
          "bg-[var(--color-accent)] text-white hover:shadow-[0_4px_16px_0_rgba(255,90,95,0.35)] hover:-translate-y-px active:translate-y-0",
        // 深藍
        deep:
          "bg-[var(--color-secondary)] text-white hover:shadow-[0_4px_16px_0_rgba(42,61,102,0.28)] hover:-translate-y-px active:translate-y-0",
        // 幽靈：無底色，文字底線
        ghost:
          "bg-transparent text-[var(--color-secondary)] underline-offset-4 hover:underline hover:bg-transparent",
      },
      size: {
        sm:      "h-8  px-5  text-xs",
        default: "h-11 px-8",
        lg:      "h-13 px-12 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Step 2：在頁面中使用**

```tsx
import { Button } from "@/components/ui/button";

// 主要 CTA
<Button>閱讀更多</Button>

// 次要行動
<Button variant="secondary">了解詳情</Button>

// 強調 / 訂閱
<Button variant="accent">立即訂閱</Button>

// 深藍
<Button variant="deep">查看作品</Button>

// 文字連結型
<Button variant="ghost">關於我們</Button>

// 尺寸
<Button size="sm">小按鈕</Button>
<Button size="lg">大按鈕</Button>

// asChild：包裝 Link 組件（Next.js）
import Link from "next/link";
<Button asChild>
  <Link href="/about">關於我們</Link>
</Button>
```

### Card

**設計原則：資訊傳達優先，無裝飾**

圖卡（Card）的視覺層級完全依靠**字體、字重、色彩、間距**建立，不使用任何 icon。

> **為什麼不用 icon？**  
> Icon 是功能導航的輔助工具，不是資訊本身。在 Editorial UI 中，加入 icon 會把閱讀節奏打斷，讓視線在「讀文字」和「辨認圖示」之間來回切換。字體層級本身就足以傳達資訊的輕重與類型。

**卡片內的資訊層級結構（固定順序）：**

```
[Eyebrow label]   ← 分類、期號、日期（最小、最輕）
[Title]           ← 核心訊息（最大、最重）
[Body]            ← 補充說明（中等、輕）
[CTA Button]      ← 行動指引（選填）
```

```tsx
import { Button } from "@/components/ui/button";

{/* ── 標準淺色卡片 ── */}
<div className="bg-white rounded-xl p-8 space-y-3 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
  {/* Eyebrow：分類標籤，無 icon */}
  <p className="font-en text-xs font-medium tracking-widest uppercase text-muted">
    Research · 2025
  </p>
  {/* Title */}
  <h3 className="font-display text-xl font-bold leading-snug text-primary">
    排版即設計
  </h3>
  {/* Body */}
  <p className="font-body text-sm leading-[1.7] text-primary/70">
    字體層級的每一個決定，都是在告訴讀者什麼重要、什麼次要。
  </p>
</div>

{/* ── 深色卡片 ── */}
<div className="bg-secondary rounded-xl p-8 space-y-3 shadow-md">
  <p className="font-en text-xs font-medium tracking-widest uppercase text-white/50">
    Feature
  </p>
  <h3 className="font-display text-xl font-bold leading-snug text-white">
    留白即敘事
  </h3>
  <p className="font-body text-sm leading-[1.7] text-white/70">
    留白不是空白，是節奏、是呼吸、是讓內容說話的空間。
  </p>
</div>

{/* ── 帶 CTA 的卡片 ── */}
<div className="bg-white rounded-xl p-8 space-y-4 shadow-soft">
  <p className="font-en text-xs font-medium tracking-widest uppercase text-muted">
    Case Study
  </p>
  <h3 className="font-display text-xl font-bold leading-snug text-primary">
    插畫即語言
  </h3>
  <p className="font-body text-sm leading-[1.7] text-primary/70">
    當插畫與文字共享同一套視覺語言，版面才能真正統一。
  </p>
  <Button variant="deep" size="sm">深入了解</Button>
</div>
```

**卡片使用禁止清單：**
- ❌ 不放任何 icon（`lucide-react`、`heroicons` 等）
- ❌ 不用編號 + icon 的組合替代 eyebrow label
- ❌ 不用 icon 代替文字說明功能或分類
- ❌ 不加插畫作為「裝飾」（插畫只在 Section 級別的敘事版面使用）
- ✅ 分類、狀態、類型一律用 eyebrow label 文字傳達
- ✅ 數字編號（01 / 02 / 03）可作為序列視覺，但仍是文字，非圖示



### Badge / Tag

```tsx
{/* 純色塊 tag：rounded-sm、無邊框 */}
<span className="inline-block px-3 py-1 text-xs tracking-widest uppercase rounded bg-primary text-white">
  Editorial
</span>

{/* Accent tag */}
<span className="inline-block px-3 py-1 text-xs tracking-widest uppercase rounded bg-accent text-white">
  New
</span>

{/* 淺色 muted tag */}
<span className="inline-block px-3 py-1 text-xs tracking-widest uppercase rounded bg-background text-secondary">
  Design
</span>
```

### 分隔線 / Divider

```tsx
<hr className="border-t border-muted opacity-30" />

<div className="flex items-center gap-4 my-8">
  <hr className="flex-1 border-t border-muted opacity-30" />
  <span className="text-xs tracking-widest uppercase text-muted">VOL. 01</span>
  <hr className="flex-1 border-t border-muted opacity-30" />
</div>
```

### Input / Form

```tsx
{/* 純色塊 input — rounded-md + soft shadow，hover/focus 加深陰影 */}
<Input
  className="border-0 rounded-md bg-white
             shadow-soft
             px-4 py-2.5
             text-primary placeholder:text-muted
             focus-visible:ring-0
             focus-visible:shadow-md
             transition-shadow duration-200"
  placeholder="你的電子信箱"
/>
```

---

## 8. Motion & Animation

所有動態保持克制，配合插畫的靜態氣質。

```css
/* globals.css — 全局動態基礎 */
* {
  transition-timing-function: var(--ease-editorial);
}

/* Fade In（頁面載入、section 出現） */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-editorial-in {
  animation: fadeIn var(--duration-slide) var(--ease-editorial) both;
}

/* Stagger children */
.stagger > * {
  animation: fadeIn var(--duration-slide) var(--ease-editorial) both;
}
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 80ms; }
.stagger > *:nth-child(3) { animation-delay: 160ms; }
.stagger > *:nth-child(4) { animation-delay: 240ms; }
```

```tsx
// Hover 規則：只改線條粗細、顏色、底色填滿，不做彈跳
<a
  href="#"
  className="text-primary border-b border-transparent
             hover:border-primary
             transition-colors duration-200"
>
  深入閱讀
</a>
```

**禁止：**
- `animate-bounce`、`animate-pulse`（太活潑）
- Spring 彈性動畫
- 複雜 keyframe（旋轉、縮放超過 1.02）
- `transition-all`（效能差，改用具體屬性）

---

## 9. Tailwind v4 設定整合

```ts
// tailwind.config.ts（v4 使用 @theme，此檔案可省略）
// 若需要 safelist 或 plugin：
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // v4 優先使用 CSS @theme，此處可留空
  },
  plugins: [],
} satisfies Config;
```

```jsonc
// tsconfig.json — 確保路徑正確
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 10. shadcn/ui 初始化建議

```bash
# 安裝 shadcn（選擇 CSS Variables 模式）
npx shadcn@latest init

# 建議安裝的組件（保持最小化）
npx shadcn@latest add button input badge separator
```

在 `components.json` 中確認：

```jsonc
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true  // ← 必須開啟
  }
}
```

---

## 11. 完整頁面範例

```tsx
// app/page.tsx — Editorial Hero Section（v1.2）
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Eyebrow + 大標題 */}
      <section className="px-6 md:px-16 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="font-en text-xs font-medium tracking-widest uppercase text-secondary mb-6">
            Issue No. 01 — 2025
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-16 items-end">
            <div className="stagger">
              <h1 className="font-display text-7xl md:text-8xl font-bold leading-[1.1] text-primary">
                設計是<br />一種閱讀
              </h1>
              <p className="font-body mt-8 text-base leading-[1.7] text-primary max-w-[60ch]">
                當版面成為故事，留白成為節奏，插畫成為語言——
                這就是 Editorial UI 想帶給你的體驗。
              </p>
              <div className="mt-10 flex items-center gap-4">
                <Button>閱讀更多</Button>
                <Button variant="secondary">關於我們</Button>
              </div>
            </div>

            {/* 插畫區：無邊框、無陰影、融入背景 */}
            <div className="animate-editorial-in" style={{ animationDelay: "200ms" }}>
              <img
                src="/illustration-hero.svg"
                alt=""
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 分隔 */}
      <div className="px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <hr className="border-t border-muted opacity-30" />
        </div>
      </div>

      {/* 次要 Section — 純色塊卡片 */}
      <section className="px-6 md:px-16 py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: "01", title: "排版優先", bg: "bg-white", dark: false },
            { num: "02", title: "留白敘事", bg: "bg-secondary", dark: true },
            { num: "03", title: "插畫語言", bg: "bg-white", dark: false },
          ].map(({ num, title, bg, dark }) => (
            <div
              key={num}
              className={`${bg} rounded-xl p-8 space-y-4 shadow-soft hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
            >
              <span className={`font-en text-xs tracking-widest uppercase rounded-md px-2 py-1 inline-block ${dark ? "bg-white/20 text-white" : "bg-background text-secondary"}`}>
                {num}
              </span>
              <h3 className={`font-display text-2xl font-medium leading-snug mt-2 ${dark ? "text-white" : "text-primary"}`}>
                {title}
              </h3>
              <p className={`font-body text-sm leading-[1.7] ${dark ? "text-white/70" : "text-primary/70"}`}>
                Editorial UI 讓每個決策都服務於閱讀體驗，而非功能展示。
              </p>
              <Button
                variant={dark ? "secondary" : "deep"}
                size="sm"
                className="mt-2"
              >
                深入了解
              </Button>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
```

---

## 12. Do & Don't 速查

| ✅ Do | ❌ Don't |
|-------|---------|
| 大留白、深呼吸 | 元素塞滿版面 |
| `rounded-lg` 元件、`rounded-xl` 大區塊 | `rounded-full`（太可愛）、`rounded-none`（太硬） |
| 純色塊按鈕（無邊框） | 細邊框空心按鈕 |
| Soft shadow 取代邊框 | 過重陰影 / 彩色陰影 |
| 陰影只加在互動元件、浮層 | 插畫加陰影（破壞平面感） |
| `mix-blend-multiply` 插畫融入 | 插畫加白底卡片 |
| 卡片內用 eyebrow label 傳達分類 | 卡片內放 icon（裝飾性圖示）|
| 數字序號（01/02）作為視覺節奏 | icon + 文字組合替代 label |
| 字體層級本身說明資訊輕重 | 靠 icon 補充文字說明不足 |
| 字重只用 400/500/700 | 混用 6 種字重 |
| 淡入淡出動態 | bounce、spring、旋轉動畫 |
| Accent 色點綴（< 3 次/頁） | 全頁用 accent 色 |
| `max-w-[65ch]` 控制行寬 | 全寬長行文字 |
| SVG 插畫（Section 級敘事） | 插畫當卡片裝飾 |

---

*Style Guide Version 1.2 — Editorial UI × React × Tailwind v4 × shadcn/ui*