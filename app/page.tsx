import Link from "next/link";
import CarSearch from "@/components/CarSearch";
import CarSilhouette from "@/components/CarSilhouette";
import RankingList from "@/components/RankingList";
import { cars, carPath, brands } from "@/lib/cars";
import { DATA_REFERENCE } from "@/lib/site";
import { categoryGroup } from "@/lib/rankings";
import { metadata, siteUrl } from "@/lib/seo";
export const generateMetadata = () =>
  metadata(
    "내 차는 대한민국에서 몇 위?",
    "대한민국 주요 국산차의 누적 판매량과 순위를 확인해보세요.",
    "/",
  );
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "내차몇위",
            url: siteUrl,
          }).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> 우리나라 자동차, 숫자로 다시 보기
          </p>
          <h1>
            내 차는 대한민국에서
            <br />
            <em>몇 번째</em>로 많이 팔렸을까?
          </h1>
          <p className="hero-description">
            대한민국 주요 국산차의 누적 판매량과 순위를 확인해보세요.
          </p>
          <div id="car-search">
            <CarSearch />
          </div>
          <div className="popular">
            <span>바로 찾아보기</span>
            {["싼타페", "그랜저", "레이", "쏘렌토"].map((name) => (
              <Link
                key={name}
                href={carPath(cars.find((c) => c.model_family === name)!.slug)}
              >
                {name} ↗
              </Link>
            ))}
          </div>
        </div>
        <aside className="hero-art">
          <div className="art-top">
            <span>EVERY CAR HAS A STORY</span>
            <span>↗</span>
          </div>
          <div className="art-number">
            내 차의 기록
            <span>
              당신과 달려온 그 차,
              <br />
              얼마나 많은 사람과 함께했을까요?
            </span>
          </div>
          <CarSilhouette />
          <div className="art-bottom">
            <span>{cars.length}개의 자동차 이야기</span>
            <span>국내 누적판매 기준</span>
          </div>
        </aside>
      </section>
      <div className="data-strip">
        <div className="container">
          <span>
            <strong>{cars.length}</strong>개 모델의 기록
          </span>
          <span>
            <strong>{brands.length}</strong>개 브랜드
          </span>
          <span>
            <strong>{DATA_REFERENCE}</strong> 판매량 기준
          </span>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ALL-TIME BEST SELLERS</p>
            <h2>
              국산차 역대 판매 TOP 10<span className="small-dot">●</span>
            </h2>
            <p>우리 도로에서 자주 만나는 데는 이유가 있죠.</p>
          </div>
          <Link className="text-link" href="/rank">
            전체 {cars.length}개 보기 ↗
          </Link>
        </div>
        <div className="panel top-ten">
          <RankingList cars={cars.slice(0, 10)} />
        </div>
        <p className="data-note">
          모델 계보의 국내 누적판매 추정치입니다. 현재 판매량 순위와는 다를 수
          있어요.
        </p>
      </section>
      <section className="container category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR FAVORITE</p>
            <h2>같은 차급에서는 몇 위일까?</h2>
          </div>
        </div>
        <div className="category-grid">
          {["SUV", "세단", "경차"].map((category, i) => (
            <article className="panel category-card" key={category}>
              <div className="category-title">
                <span className="category-icon" aria-hidden="true">
                  {["↗", "⌁", "✳"][i]}
                </span>
                <h3>{category} TOP 5</h3>
                <Link
                  href={`/rank?category=${encodeURIComponent(category)}`}
                  aria-label={`${category} 전체 순위`}
                >
                  ↗
                </Link>
              </div>
              <RankingList
                compact
                cars={cars
                  .filter((c) => categoryGroup(c.category) === category)
                  .slice(0, 5)}
              />
              <p className="data-note">표시 숫자는 대한민국 전체 순위예요.</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container bottom-cta">
        <div>
          <p className="eyebrow">나의 첫 차부터, 지금 타는 차까지</p>
          <h2>모든 차에는 이야기가 있어요.</h2>
          <p>익숙했던 자동차의 새로운 기록을 발견해보세요.</p>
        </div>
        <a className="button primary" href="#car-search">
          내 차 찾아보기 ↑
        </a>
      </section>
    </>
  );
}
