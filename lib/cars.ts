import data from "@/data/cars.json";
export const cars = [...data].sort((a, b) => a.overall_rank - b.overall_rank);
export const brands = [...new Set(cars.map((c) => c.manufacturer))];
export const brandSlug = (brand: string) => brand.replaceAll("/", "-");
export const brandLabel = (brand: string) =>
  brand === "대우/GM" ? "대우·GM" : brand === "쌍용/KGM" ? "KGM" : brand;
export const carPath = (slug: string) => `/car/${encodeURIComponent(slug)}`;
export const brandPath = (brand: string) =>
  `/brand/${encodeURIComponent(brandSlug(brand))}`;
export function decodeSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
export const getCar = (slug: string) =>
  cars.find((c) => c.slug === decodeSegment(slug));
