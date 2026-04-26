import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Persona Signal — 제품팀용 pre-validation tool",
  description: "한국인 합성 페르소나 기반 메시지·가격·기능 사전 검토 도구",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
