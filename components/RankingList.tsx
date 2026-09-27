import Link from "next/link";
import type { Car } from "@/lib/types";
import { carPath, brandLabel } from "@/lib/cars";
export default function RankingList({
  cars,
  rank = "overall_rank",
  current,
  compact = false,
}: {
  cars: Car[];
  rank?: "overall_rank" | "brand_rank" | "category_rank" | "position";
  current?: string;
  compact?: boolean;
}) {
  return (
    <ol className={`ranking-list ${compact ? "compact" : ""}`}>
      {cars.map((c, index) => (
        <li key={c.slug}>
          <Link
            href={carPath(c.slug)}
            className={`rank-row ${current === c.slug ? "current" : ""}`}
            aria-current={current === c.slug ? "page" : undefined}
          >
            <span
              className={`rank-number ${(rank === "position" ? index + 1 : c[rank]) <= 3 ? "top-rank" : ""}`}
            >
              {(rank === "position" ? index + 1 : c[rank])
                .toString()
                .padStart(2, "0")}
            </span>
            <span className="car-name">
              <small>
                {brandLabel(c.manufacturer)}
                <span className="category-meta"> · {c.category}</span>
              </small>
              <strong>{c.model_family}</strong>
            </span>
            <span className="sales">
              <strong>{c.display_sales}</strong>
              {!compact && <small>{c.launch_year}년 출시</small>}
            </span>
            <span className="row-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
