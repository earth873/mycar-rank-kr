import Link from "next/link";
import { notFound } from "next/navigation";
import { cars, getCar, carPath, brandPath, brandLabel } from "@/lib/cars";
import { nearby } from "@/lib/rankings";
import { getRankingCategoryForCar } from "@/lib/ranking-categories";
import { metadata, siteUrl } from "@/lib/seo";
import RankingList from "@/components/RankingList";
import ShareButtons from "@/components/ShareButtons";
import CarSearch from "@/components/CarSearch";
// All known models are prerendered; unknown models use notFound() below.
export const dynamicParams = false;
export const generateStaticParams = () => cars.map((c) => ({ slug: c.slug }));
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const c = getCar((await params).slug);
  if (!c) return {};
  return metadata(
    `${c.manufacturer} ${c.model_family}는 대한민국 판매량 몇 위?`,
    `${c.manufacturer} ${c.model_family} 국내 누적판매 ${c.display_sales}. 대한민국 전체 순위, ${c.category} 순위, 출시 역사와 세대 정보를 확인하세요.`,
    carPath(c.slug),
  );
}
export default async function CarPage({ params }: Props) {
  const c = getCar((await params).slug);
  if (!c) notFound();
  const rankingCategory = getRankingCategoryForCar(c.category);
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "홈", url: siteUrl },
      {
        name: brandLabel(c.manufacturer),
        url: siteUrl + brandPath(c.manufacturer),
      },
      { name: c.model_family, url: siteUrl + carPath(c.slug) },
    ].map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.name,
      item: x.url,
    })),
  };
  return (
    <div className="container detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(crumbs).replace(/</g, "\\u003c"),
        }}
      />
      <nav className="breadcrumbs" aria-label="현재 위치">
        <Link href="/">홈</Link> /{" "}
        <Link href={brandPath(c.manufacturer)}>
          {brandLabel(c.manufacturer)}
        </Link>{" "}
        / {c.model_family}
      </nav>
      <section className="detail-hero panel">
        <div>
          <p className="eyebrow">
            {c.manufacturer} · {c.category}
          </p>
          <h1>{c.model_family}</h1>
          <span className="status-chip">
            {c.is_current
              ? "현재 판매 중"
              : `${c.launch_year} ~ ${c.discontinued_year ?? "단종"}`}
          </span>
          <p className="muted">판매 상태는 제공 데이터 기준</p>
          <div className="detail-sales">
            <span>국내 누적판매</span>
            <strong>{c.display_sales}</strong>
          </div>
          <ShareButtons
            name={c.model_family}
            rank={c.overall_rank}
            sales={c.display_sales}
          />
        </div>
        <div className="big-rank">
          <p>대한민국 역대 판매순위</p>
          <strong>
            <span>#</span>
            {c.overall_rank}
          </strong>
          <span>{cars.length}개 모델 중</span>
        </div>
      </section>
      <div className="stats-grid">
        {[
          ["전체 순위", `#${c.overall_rank}`],
          ["브랜드 순위", `${brandLabel(c.manufacturer)} #${c.brand_rank}`],
          ["차급 순위", `${c.category} #${c.category_rank}`],
          ["출시", `${c.launch_year}년`],
        ].map(([label, value]) => (
          <div className="panel stat" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="detail-columns">
        <div>
          <section className="panel story">
            <p className="eyebrow">THE STORY</p>
            <h2>이 차는 어떤 차?</h2>
            <p>{c.short_history}</p>
            <h3>함께 달려온 {c.generation_count}세대</h3>
            <ol className="generations">
              {c.generations.map((g, i) => (
                <li key={`${i}-${g}`}>
                  <small>{i + 1}세대</small>
                  <strong>{g}</strong>
                </li>
              ))}
            </ol>
            <div className="fact">
              <h3>알고 계셨나요?</h3>
              <p>{c.notable_fact}</p>
            </div>
          </section>
        </div>
        <section className="panel nearby">
          <p className="eyebrow">A LITTLE COMPETITION</p>
          <h2>내 차 주변 순위</h2>
          <p className="muted">앞뒤로 어떤 차가 달리고 있을까요?</p>
          <RankingList compact cars={nearby(cars, c.slug)} current={c.slug} />
        </section>
      </div>
      <div className="detail-columns related">
        <section className="panel">
          <div className="related-heading">
            <h2>같은 브랜드 인기차</h2>
            <Link href={brandPath(c.manufacturer)}>전체 보기 ↗</Link>
          </div>
          <RankingList
            compact
            cars={cars
              .filter((x) => x.manufacturer === c.manufacturer)
              .sort((a, b) => a.brand_rank - b.brand_rank)
              .slice(0, 5)}
            rank="brand_rank"
          />
        </section>
        <section className="panel">
          <div className="related-heading">
            <h2>같은 차급 랭킹</h2>
            <span>{c.category}</span>
          </div>
          <RankingList
            compact
            cars={cars
              .filter((x) => x.category === c.category)
              .sort((a, b) => a.category_rank - b.category_rank)
              .slice(0, 5)}
            rank="category_rank"
          />
          {rankingCategory && (
            <p className="category-more">
              <Link href={rankingCategory.path}>
                전체 {rankingCategory.label} 순위 보기 →
              </Link>
            </p>
          )}
        </section>
      </div>
      <p className="data-note">
        {c.sales_as_of} 기준 국내 누적판매 추정치 ·{" "}
        <Link href="/about">데이터 안내</Link>
      </p>
      <section className="detail-search">
        <h2>다른 차의 순위도 궁금하다면</h2>
        <CarSearch />
      </section>
    </div>
  );
}
