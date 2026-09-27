import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { cars } from "@/lib/cars";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "내차몇위 | 내 차의 대한민국 판매순위",
    template: "%s | 내차몇위",
  },
  description: `대한민국 주요 국산차 ${cars.length}개 모델의 누적 판매순위. 내 차의 순위와 역사를 확인해보세요.`,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main">
          본문으로 건너뛰기
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Link className="logo" href="/">
              <span className="logo-mark" aria-hidden="true">
                ↗
              </span>
              내차몇위<span className="logo-dot">.</span>
            </Link>
            <nav aria-label="주요 메뉴">
              <Link href="/rank">전체 랭킹</Link>
              <Link href="/about">서비스 소개</Link>
            </nav>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="container site-footer">
          <div>
            <Link className="logo" href="/">
              내차몇위<span className="logo-dot">.</span>
            </Link>
            <p>숫자로 만나는, 우리 자동차 이야기.</p>
          </div>
          <div>
            <p>주요 국산차 · 국내 누적판매 추정치 기준</p>
            <Link href="/about">데이터 안내 ↗</Link>
            <p>© {new Date().getFullYear()} 내차몇위</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
