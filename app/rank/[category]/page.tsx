import Link from "next/link";
import { notFound } from "next/navigation";
import RankingList from "@/components/RankingList";
import { brandLabel, carPath } from "@/lib/cars";
import {
  getRankingCategory,
  staticRankingCategories,
} from "@/lib/ranking-categories";
import { metadata, siteUrl } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () =>
  staticRankingCategories.map(({ slug }) => ({ category: slug }));
type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props) {
  const category = getRankingCategory((await params).category);
  if (!category) notFound();
  return metadata(category.title, category.description, category.path);
}

export default async function CategoryRank({ params }: Props) {
  const category = getRankingCategory((await params).category);
  if (!category) notFound();
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "홈", url: siteUrl },
      { name: "전체 랭킹", url: `${siteUrl}/rank` },
      { name: category.label, url: siteUrl + category.path },
    ].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  const items = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: category.cars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${brandLabel(car.manufacturer)} ${car.model_family}`,
      url: siteUrl + carPath(car.slug),
    })),
  };
  return (
    <div className="container page-content category-ranking">
      {[crumbs, items].map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <nav className="breadcrumbs" aria-label="현재 위치">
        <Link href="/">홈</Link> / <Link href="/rank">전체 랭킹</Link> /{" "}
        <span aria-current="page">{category.label}</span>
      </nav>
      <p className="eyebrow">{category.eyebrow}</p>
      <h1>{category.heading}</h1>
      <p className="page-description">
        대한민국 도로를 함께 달려온 주요 국산 {category.label}{" "}
        {category.cars.length}개 모델을 국내 누적 판매량 기준으로 정리했습니다.
        모델 계보별 추정치를 비교하며 출시년도와 자동차의 역사를 살펴보세요.
        아래 순위는 이 차급 그룹 안에서 계산하며, 현재 판매량 순위와는 다를 수
        있습니다.
      </p>
      <section aria-labelledby="category-top-three">
        <h2 id="category-top-three">{category.label} TOP 3</h2>
        <ol className="category-grid category-podium">
          {category.cars.slice(0, 3).map((car, index) => (
            <li className="panel" key={car.slug}>
              <Link href={carPath(car.slug)}>
                <span className="eyebrow">{index + 1}위</span>
                <small className="muted">{brandLabel(car.manufacturer)}</small>
                <h3>{car.model_family}</h3>
                <strong>{car.display_sales}</strong>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="section" aria-labelledby="category-full-ranking">
        <div className="section-heading">
          <h2 id="category-full-ranking">전체 {category.label} 순위</h2>
          <p>{category.cars.length}개 모델 · 차급 내 순위</p>
        </div>
        <div className="panel">
          <RankingList cars={category.cars} rank="position" />
        </div>
      </section>
      <p className="data-note">
        판매량은 제조사 발표, 산업 통계, 언론 보도 등을 종합한 추정치이며 집계
        기준과 시점에 따라 차이가 있을 수 있습니다.{" "}
        <Link href="/about">데이터 안내 →</Link>
      </p>
    </div>
  );
}
