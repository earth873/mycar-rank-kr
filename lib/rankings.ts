import type { Car } from "./types";
export const categories = ["세단", "SUV", "경차", "MPV", "상용", "기타"];
export function categoryGroup(category: string) {
  return category.includes("SUV")
    ? "SUV"
    : category.includes("세단")
      ? "세단"
      : category.includes("상용") ||
          category.includes("트럭") ||
          category.includes("버스") ||
          category === "픽업"
        ? "상용"
        : category === "경차"
          ? "경차"
          : category === "MPV"
            ? "MPV"
            : "기타";
}
export function nearby(cars: Car[], slug: string) {
  const i = cars.findIndex((c) => c.slug === slug);
  return i < 0 ? [] : cars.slice(Math.max(0, i - 2), i + 3);
}
