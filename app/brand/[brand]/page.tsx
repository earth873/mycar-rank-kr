import { notFound } from "next/navigation";
import {
  brands,
  brandSlug,
  brandLabel,
  brandPath,
  cars,
  decodeSegment,
} from "@/lib/cars";
import RankingList from "@/components/RankingList";
import { metadata } from "@/lib/seo";
export const dynamicParams = false;
export const generateStaticParams = () =>
  brands.map((brand) => ({ brand: brandSlug(brand) }));
type Props = { params: Promise<{ brand: string }> };
export async function generateMetadata({ params }: Props) {
  const { brand } = await params;
  const name = brands.find((b) => brandSlug(b) === decodeSegment(brand));
  if (!name) return {};
  return metadata(
    `${brandLabel(name)} 역대 판매량 순위`,
    `${brandLabel(name)} 자동차의 국내 누적판매 순위를 확인하세요.`,
    brandPath(name),
  );
}
export default async function Brand({ params }: Props) {
  const { brand } = await params;
  const name = brands.find((b) => brandSlug(b) === decodeSegment(brand));
  if (!name) notFound();
  const list = cars
    .filter((c) => c.manufacturer === name)
    .sort((a, b) => a.brand_rank - b.brand_rank);
  return (
    <div className="container page-content">
      <p className="eyebrow">BRAND RANKING</p>
      <h1>{brandLabel(name)} 역대 판매량 순위</h1>
      <p className="page-description">
        {list.length}개 모델 · 브랜드 내 순위 기준
      </p>
      <div className="panel">
        <RankingList cars={list} rank="brand_rank" />
      </div>
    </div>
  );
}
