import { metadata } from "@/lib/seo";
import { cars } from "@/lib/cars";
import { DATA_REFERENCE_LABEL } from "@/lib/site";
export const generateMetadata = () =>
  metadata(
    "내차몇위란?",
    "내차몇위 서비스 소개와 판매량 데이터 안내입니다.",
    "/about",
  );
export default function About() {
  return (
    <article className="container page-content about">
      <p className="eyebrow">ABOUT US</p>
      <h1>내차몇위란?</h1>
      <p className="page-description">익숙한 내 차, 새롭게 만나는 이야기.</p>
      <section className="panel story">
        <h2>내 차는 대한민국에서 몇 위일까?</h2>
        <p>
          대한민국에서 판매된 주요 국산 자동차의 누적 판매량을 바탕으로 내
          자동차의 순위를 재미있게 확인하는 서비스입니다.
        </p>
        <h2>데이터 안내</h2>
        <p>
          판매량은 제조사 발표, 자동차 산업 통계, 언론 보도 등을 종합한
          추정치입니다. 집계 시점과 기준에 따라 실제 수치와 차이가 있을 수
          있습니다.
        </p>
        <p>
          현재 {cars.length}개 모델을 다루며, 판매량 기준일은{" "}
          {DATA_REFERENCE_LABEL}입니다. 세대가 바뀌거나 이름이 이어진 차량은
          제공된 모델 계보를 기준으로 합산합니다. 판매 여부도 데이터 작성 시점
          기준입니다.
        </p>
        <p>
          전체 순위는 수록 모델 사이의 순위이며, 차급 순위는 중형SUV·준중형세단
          등 세부 차급을 기준으로 합니다. SUV·세단 묶음에서는 전체 순위를 함께
          보여드립니다.
        </p>
      </section>
    </article>
  );
}
