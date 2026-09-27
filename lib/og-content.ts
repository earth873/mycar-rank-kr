import type { Car } from "./types";
import { SITE_NAME } from "./site";
import { cars } from "./cars";

export function ogContent(car?: Car) {
  return {
    site: `${SITE_NAME}.`,
    manufacturer: car?.manufacturer || "숫자로 만나는 우리 자동차 이야기",
    title: car?.model_family || "내 차는 대한민국에서",
    subtitle: car ? "대한민국 역대 판매순위" : "몇 번째로 많이 팔렸을까?",
    rank: car ? `#${car.overall_rank}` : "?",
    salesLabel: car ? "국내 누적판매" : "함께 달려온 자동차의 기록",
    sales: car?.display_sales || `${cars.length}개 주요 국산차 판매순위`,
    detail: car
      ? `${car.category} · ${car.launch_year}년 출시`
      : "검색하고, 비교하고, 내 차의 이야기를 발견하세요.",
    footer: "내 차는 몇 위?",
  };
}

export function ogCharacters() {
  const text = [ogContent(), ...cars.map((c) => ogContent(c))]
    .flatMap((c) => Object.values(c))
    .join("");
  return [...new Set(text + "0123456789")].sort().join("");
}
