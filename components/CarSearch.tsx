"use client";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import index from "@/data/car_search_index.json";
import { searchCars } from "@/lib/search";
export default function CarSearch() {
  const [query, setQuery] = useState(""),
    [composing, setComposing] = useState(false),
    [open, setOpen] = useState(false),
    [active, setActive] = useState(-1);
  const id = useId();
  const router = useRouter();
  const results = searchCars(index, query);
  const visible = open && !composing && !!query.trim();
  function go(slug: string) {
    setOpen(false);
    router.push(`/car/${encodeURIComponent(slug)}`);
  }
  return (
    <div
      className="search-wrap"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <label className="sr-only" htmlFor={id}>
        내 차 검색
      </label>
      <div className="search-box">
        <span aria-hidden="true">⌕</span>
        <input
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={visible}
          aria-controls={`${id}-results`}
          aria-activedescendant={
            visible && active >= 0 ? `${id}-${active}` : undefined
          }
          autoComplete="off"
          placeholder="차량명을 입력하세요. 예: 싼타페, 그랜저, 레이"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onKeyDown={(e) => {
            if (composing || e.nativeEvent.isComposing) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(0, i - 1));
            }
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Enter" && results.length) {
              e.preventDefault();
              go(results[Math.max(0, active)].slug);
            }
          }}
        />
        <span className="search-hint" aria-hidden="true">
          ↵
        </span>
      </div>
      {visible && (
        <div className="suggestions">
          <ul id={`${id}-results`} role="listbox" aria-label="차량 검색 결과">
            {results.map((c, i) => (
              <li
                id={`${id}-${i}`}
                key={c.slug}
                role="option"
                aria-selected={i === active}
                className={i === active ? "selected" : ""}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(c.slug)}
              >
                <span>
                  <small>{c.manufacturer}</small>
                  <strong>{c.model_family}</strong>
                </span>
                <span className="search-rank">
                  전체 {c.overall_rank}위 <span aria-hidden="true">↗</span>
                </span>
              </li>
            ))}
          </ul>
          <p role="status">
            {results.length
              ? `${results.length}개 결과 · 방향키로 이동하고 Enter로 선택하세요`
              : "찾는 차량이 없어요. 모델명이나 영문명으로 다시 검색해보세요."}
          </p>
        </div>
      )}
    </div>
  );
}
