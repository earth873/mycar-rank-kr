import { cars } from "./cars";
import { categoryGroup } from "./rankings";

export const rankingCategories = [
  { slug: "suv", label: "SUV", group: "SUV", eyebrow: "SUV RANKING" },
  { slug: "sedan", label: "세단", group: "세단", eyebrow: "SEDAN RANKING" },
  { slug: "compact", label: "경차", group: "경차", eyebrow: "COMPACT RANKING" },
  { slug: "mpv", label: "MPV", group: "MPV", eyebrow: "MPV RANKING" },
  {
    slug: "commercial",
    label: "상용차",
    group: "상용",
    eyebrow: "COMMERCIAL RANKING",
  },
].map((category) => {
  const rankedCars = cars
    .filter((car) => categoryGroup(car.category) === category.group)
    .sort(
      (a, b) =>
        b.estimated_domestic_sales - a.estimated_domestic_sales ||
        a.overall_rank - b.overall_rank,
    );
  return {
    ...category,
    path: `/rank/${category.slug}`,
    title: `국산 ${category.label} 역대 판매량 순위`,
    heading: `국산 ${category.label} 역대 판매순위`,
    description: `대한민국 주요 국산 ${category.label}의 국내 누적 판매량 순위. ${rankedCars
      .slice(0, 3)
      .map((car) => car.model_family)
      .join(", ")} 등 모델별 기록을 확인하세요.`,
    cars: rankedCars,
  };
});

// Only substantial groups receive a static page and internal links.
export const staticRankingCategories = rankingCategories.filter(
  (category) => category.cars.length >= 3,
);
export const getRankingCategory = (slug: string) =>
  staticRankingCategories.find((category) => category.slug === slug);
export const getRankingCategoryForCar = (category: string) =>
  staticRankingCategories.find(
    (entry) => entry.group === categoryGroup(category),
  );
