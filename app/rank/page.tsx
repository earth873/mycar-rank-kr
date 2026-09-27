import { Suspense } from "react";
import RankingExplorer from "@/components/RankingExplorer";
import { cars, brands } from "@/lib/cars";
import { metadata } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "대한민국 역대 자동차 판매순위",
    `주요 국산차 ${cars.length}개 모델의 국내 누적판매 순위를 브랜드와 차급별로 확인하세요.`,
    "/rank",
  );
export default function Rank() {
  return (
    <div className="container page-content">
      <p className="eyebrow">THE RANKING</p>
      <h1>대한민국 역대 판매순위</h1>
      <p className="page-description">
        오랜 시간, 우리와 함께 달려온 자동차들.
      </p>
      <Suspense fallback={<p>랭킹을 불러오는 중이에요.</p>}>
        <RankingExplorer cars={cars} brands={brands} />
      </Suspense>
    </div>
  );
}
