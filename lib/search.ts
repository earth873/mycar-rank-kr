import type { SearchCar } from "./types";
export const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s/·-]/g, "");
export function searchCars(cars: SearchCar[], query: string) {
  const q = normalize(query);
  if (!q) return [];
  return cars
    .map((car) => {
      const name = normalize(car.model_family);
      const score =
        name === q
          ? 0
          : name.startsWith(q)
            ? 1
            : name.includes(q)
              ? 2
              : car.aliases.some((a) => normalize(a).includes(q))
                ? 3
                : normalize(car.manufacturer + car.model_family).includes(q)
                  ? 4
                  : normalize(car.manufacturer).includes(q)
                    ? 5
                    : 99;
      return { car, score };
    })
    .filter((x) => x.score < 99)
    .sort(
      (a, b) => a.score - b.score || a.car.overall_rank - b.car.overall_rank,
    )
    .slice(0, 8)
    .map((x) => x.car);
}
