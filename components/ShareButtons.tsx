"use client";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: { sendDefault: (options: object) => void };
};
declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}
let kakaoLoading: Promise<void> | undefined;
function loadKakao() {
  return (kakaoLoading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.6/kakao.min.js";
    script.onload = () => resolve();
    script.onerror = () => {
      kakaoLoading = undefined;
      script.remove();
      reject(new Error("load"));
    };
    document.head.appendChild(script);
  }));
}
export default function ShareButtons({
  name,
  rank,
  sales,
}: {
  name: string;
  rank: number;
  sales: string;
}) {
  const [status, setStatus] = useState("");
  const text = `내 ${name}가 대한민국 역대 판매량 ${rank}위래 🚗\n국내에서 ${sales} 판매!\n내 차 순위도 확인해보기`;
  async function copy() {
    trackEvent({ name: "share_car", car: name, method: "copy", rank });
    try {
      await navigator.clipboard.writeText(location.href);
      setStatus("링크를 복사했어요.");
    } catch {
      setStatus("복사하지 못했어요. 주소창의 링크를 복사해주세요.");
    }
  }
  async function share() {
    try {
      if (navigator.share) {
        trackEvent({ name: "share_car", car: name, method: "native", rank });
        await navigator.share({ title: "내차몇위", text, url: location.href });
      } else await copy();
    } catch (e) {
      if (!(e instanceof Error && e.name === "AbortError"))
        setStatus("공유하지 못했어요. 링크 복사를 이용해주세요.");
    }
  }
  async function kakao() {
    trackEvent({ name: "share_car", car: name, method: "kakao", rank });
    try {
      await loadKakao();
      if (!window.Kakao) throw Error();
      if (!window.Kakao.isInitialized())
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);
      window.Kakao.Share.sendDefault({
        objectType: "text",
        text,
        link: { mobileWebUrl: location.href, webUrl: location.href },
      });
    } catch {
      setStatus("카카오 공유를 불러오지 못했어요. 링크 복사를 이용해주세요.");
    }
  }
  return (
    <div className="share-area">
      <div className="flex flex-wrap gap-2">
        <button className="button primary" onClick={share}>
          내 차 순위 공유 ↗
        </button>
        <button className="button" onClick={copy}>
          링크 복사
        </button>
        {process.env.NEXT_PUBLIC_KAKAO_JS_KEY && (
          <button className="button" onClick={kakao}>
            카카오톡
          </button>
        )}
      </div>
      <p role="status" className="muted">
        {status}
      </p>
    </div>
  );
}
