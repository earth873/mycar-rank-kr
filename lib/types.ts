import data from "@/data/cars.json";
export type Car = (typeof data)[number];
export type SearchCar = Pick<
  Car,
  | "slug"
  | "manufacturer"
  | "model_family"
  | "aliases"
  | "category"
  | "overall_rank"
  | "display_sales"
>;
