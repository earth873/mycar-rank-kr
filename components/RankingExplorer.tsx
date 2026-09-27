"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Car } from "@/lib/types";
import { categories, categoryGroup } from "@/lib/rankings";
import RankingList from "./RankingList";
const label = (s: string) =>
  s === "대우/GM" ? "대우·GM" : s === "쌍용/KGM" ? "KGM" : s;
export default function RankingExplorer({
  cars,
  brands,
}: {
  cars: Car[];
  brands: string[];
}) {
  const params = useSearchParams(),
    router = useRouter(),
    path = usePathname();
  const brand = params.get("brand") || "",
    category = params.get("category") || "";
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${path}${next.size ? "?" + next : ""}`, { scroll: false });
  }
  const filtered = cars.filter(
    (c) =>
      (!brand || c.manufacturer === brand || label(c.manufacturer) === brand) &&
      (!category || categoryGroup(c.category) === category),
  );
  return (
    <>
      <div className="filter-panel">
        <div className="chips" aria-label="브랜드 필터">
          {["", ...brands].map((b) => (
            <button
              className={`chip ${brand === b ? "active" : ""}`}
              aria-pressed={brand === b}
              key={b}
              onClick={() => update("brand", b)}
            >
              {b ? label(b) : "전체 브랜드"}
            </button>
          ))}
        </div>
        <div className="chips" aria-label="차급 필터">
          {["", ...categories].map((c) => (
            <button
              className={`chip ${category === c ? "active" : ""}`}
              aria-pressed={category === c}
              key={c}
              onClick={() => update("category", c)}
            >
              {c || "전체 차급"}
            </button>
          ))}
        </div>
      </div>
      <p className="list-caption" role="status">
        총 {filtered.length}개 모델 <span>대한민국 전체 순위 기준</span>
      </p>
      <div className="panel">
        <RankingList cars={filtered} />
        {!filtered.length && (
          <p className="empty">
            조건에 맞는 차량이 없어요. 다른 필터를 선택해보세요.
          </p>
        )}
      </div>
    </>
  );
}
