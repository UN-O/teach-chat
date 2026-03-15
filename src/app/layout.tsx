import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// 字型說明：
// ① Chiron GoRound TC — 本地字型，H1/H2/H3 用
//    請將授權字型檔放入 public/fonts/：
//    - ChironGoRoundTC-Regular.woff2 (400)
//    - ChironGoRoundTC-Medium.woff2  (500)
//    - ChironGoRoundTC-Bold.woff2    (700)
//    @font-face 宣告在 globals.css。若字型未載入，自動 fallback 到 Noto Sans TC
//
// ② Noto Sans TC — 內文 body 用
//    生產環境請透過 <link> 或字型 CDN 載入，或自行下載放入 public/fonts/
//
// ③ DM Sans — 英文 label / eyebrow 用
//    同上，生產環境另行載入

export const metadata: Metadata = {
  title: "老師怎麼辦...? [親師溝通篇] | 新手老師的專屬溝通模擬器",
  description:
    "教育現場的挑戰，往往不在講台上，而在下課後跳動的 LINE 訊息裡。我們打造了一個「零風險」的親師溝通情境模擬器，讓你面對焦慮家長不再害怕。結合真實校園劇本與 PAD 情緒模型，提供實戰演練與溝通技巧教戰守則。",
  openGraph: {
    title: "老師怎麼辦...? 深呼吸，這裡是你最安全的溝通練習場。",
    description:
      "免費親師溝通情境模擬器，結合 PAD 情緒模型與真實劇本，讓新手老師練就從容應對的底氣。",
    images: ["/images/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
