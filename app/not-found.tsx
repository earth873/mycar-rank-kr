import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page-content not-found">
      <p className="eyebrow">404 · 잠깐, 길을 벗어났어요</p>
      <h1>찾는 자동차가 보이지 않아요.</h1>
      <p>차량명을 다시 검색하거나 전체 랭킹에서 찾아보세요.</p>
      <Link className="button primary" href="/">
        내 차 다시 찾기 ↗
      </Link>
    </div>
  );
}
