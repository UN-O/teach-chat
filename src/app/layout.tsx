import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_TC } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const chironGoRoundTC = localFont({
  src: "../fonts/ChironGoRoundTC-VariableFont_wght.ttf",
  variable: "--font-chiron",
  display: "swap",
  weight: "200 900",
});

const notoTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-tc",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

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
    <html
      lang="zh-TW"
      className={`${chironGoRoundTC.variable} ${notoTC.variable} ${dmSans.variable}`}
    >
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
