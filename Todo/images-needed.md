# 圖片需求清單

> **目前狀態**：所有圖片位置均已建立 SVG 佔位符（`public/images/`），待換上真實圖片。
> 以下按頁面/區塊整理所有待準備的圖片與視覺資源。

---

## 字型需求

| 項目 | 路徑 | 說明 |
|---|---|---|
| Chiron GoRound TC Regular | `src/fonts/ChironGoRoundTC-Regular.woff2` | 標題字型 400 weight，需自行取得授權 |
| Chiron GoRound TC Medium | `src/fonts/ChironGoRoundTC-Medium.woff2` | 標題字型 500 weight，需自行取得授權 |
| Chiron GoRound TC Bold | `src/fonts/ChironGoRoundTC-Bold.woff2` | 標題字型 700 weight，需自行取得授權 |

---

## OG / SEO 圖片

| 圖片檔案 | 建議尺寸 | 類型 | 視覺描述（來自 page-content.md）|
|---|---|---|---|
| `public/images/og-image.svg` → 換成 `.jpg/.png` | 1200 × 630px | 插畫/攝影合成 | 老師帶著微笑、手持平板，背景浮現溫暖的對話框與「防護網」意象。整體色調溫暖，字體疊加「老師怎麼辦...?」 |

---

## /home 首頁

| 圖片檔案 | 建議尺寸 | 類型 | 視覺描述 | 使用位置 |
|---|---|---|---|---|
| `public/images/hero-teacher.svg` | 800 × 600px | 插畫（SVG 優先）| 一位年輕老師坐在書桌前，看著手機螢幕微微皺眉，但畫面色調是溫暖的暖色系，身後有柔和的光線或溫暖的輔助元素 | HeroSection 右側插畫 |
| `public/images/hook-phone.svg` | 800 × 600px | 插畫（SVG 優先）| 老師手握手機，螢幕跳出家長長篇大論的 LINE 訊息，老師頭痛扶額的情境照 | HookSection 情境練習區塊左側 |
| `public/images/feature-chat.svg` | 800 × 500px | 截圖（系統完成後替換）| 情境訓練功能截圖（包含聊天對答與情緒分數雷達圖），需等聊天室系統完成後截圖 | HookSection 功能卡片、IntroSection 功能卡 |
| `public/images/feature-polish.svg` | 800 × 500px | 截圖（系統完成後替換）| 訊息潤飾功能截圖 Before/After 對比，左側原始草稿，右側 AI 建議回覆 | HookSection 訊息潤飾區塊、IntroSection 功能卡 |
| `public/images/origin-team.svg` | 800 × 500px | 攝影 | 團隊溫馨合照或工作照（AI創新教育工學圈圈團隊），風格溫暖，去背或白底均可 | OriginSection 左側 |

---

## /technique 交戰手冊

| 圖片檔案 | 建議尺寸 | 類型 | 視覺描述 |
|---|---|---|---|
| `public/images/technique-t01.svg` | 600 × 400px | 插畫 | T01 首訊破冰：老師傳出第一則訊息，家長安心閱讀的場景，溫暖色調 |
| `public/images/technique-t02.svg` | 600 × 400px | 插畫 | T02 事實分層：資訊分成兩層（事實層 vs 擔憂層）的視覺化呈現 |
| `public/images/technique-t04.svg` | 600 × 400px | 插畫 | T04 情緒轉換：生氣文字轉換成溫和文字的對比示意 |
| `public/images/technique-t06.svg` | 600 × 400px | 插畫 | T06 降溫技術：溫度計從高往低，文字承接情緒的示意 |
| `public/images/technique-t07.svg` | 600 × 400px | 插畫 | T07 收尾約定：握手或日曆約定的溫馨場景 |

> **注意**：技巧頁的文章圖片目前「按需要置入」（非必要），各技巧卡片目前為純文字卡片，無圖。若未來要加圖，可放在卡片上方。

---

## /about 關於我們

| 圖片檔案 | 建議尺寸 | 類型 | 視覺描述 |
|---|---|---|---|
| `public/images/team-1.svg` | 300 × 300px | 攝影（大頭貼）| 成員一的個人大頭貼，建議圓形裁切，白底或統一背景色 |
| `public/images/team-2.svg` | 300 × 300px | 攝影（大頭貼）| 成員二的個人大頭貼 |
| `public/images/team-3.svg` | 300 × 300px | 攝影（大頭貼）| 成員三的個人大頭貼 |
| `public/images/team-4.svg` | 300 × 300px | 攝影（大頭貼）| 成員四的個人大頭貼 |
| `public/images/team-5.svg` | 300 × 300px | 攝影（大頭貼）| 成員五的個人大頭貼 |

> **Also needed**：真實姓名、職稱、角色資料（替換 `src/data/text.ts` 的 `aboutText.teamMembers` 假資料）

---

## /how-to-use 使用說明

| 圖片檔案 | 建議尺寸 | 類型 | 說明 |
|---|---|---|---|
| `public/images/how-to-use-step-1.svg` | 800 × 500px | 截圖（系統完成後）| 步驟 1：選擇情境頁面截圖，顯示情境列表卡片 |
| `public/images/how-to-use-step-2.svg` | 800 × 500px | 截圖（系統完成後）| 步驟 2：練習對話聊天室截圖，顯示對話框與輸入框 |
| `public/images/how-to-use-step-3.svg` | 800 × 500px | 截圖（系統完成後）| 步驟 3：成績查看截圖，顯示技能雷達圖與評分 |

---

## /blog 教師鬼故事集

| 圖片檔案 | 建議尺寸 | 類型 | 視覺描述 |
|---|---|---|---|
| `public/images/blog-header.svg` | 800 × 400px | 插畫 | 教師鬼故事集頁頭插畫，黑板上有鬼故事風格文字，溫馨且略帶幽默感，不要過於恐怖 |

---

## 替換說明

1. 將對應的真實圖片放入 `public/images/`，**同名同格式**（建議用 `.webp` 或 `.jpg`）
2. 在 Next.js 程式碼中，把 `<img src="...svg" ...>` 改為 `<Image src="..." width={} height={} alt="..." />` 並加上適當的 `width` / `height`
3. SVG 插畫可保持 SVG 格式（`<img>` 標籤），攝影照片建議換成 `.webp`（壓縮較佳）
4. 若是頁面截圖，需等對應功能上線後再截圖替換

---

## 優先順序建議

1. 🔴 **最優先**：Hero 插畫（`hero-teacher.svg`）— 第一眼視覺
2. 🔴 **最優先**：OG 圖片（`og-image`）— 社群分享用
3. 🟡 **次優先**：Hook 插畫（`hook-phone.svg`）— 痛點引發區
4. 🟡 **次優先**：團隊照（`origin-team.svg`）— 信任建立
5. 🟢 **可等**：功能截圖（`feature-*.svg`）— 等系統完成
6. 🟢 **可等**：使用說明截圖（`how-to-use-step-*.svg`）— 等系統完成
7. 🟢 **可等**：大頭貼（`team-*.svg`）— 等收集到成員照片
