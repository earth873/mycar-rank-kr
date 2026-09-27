export function analyticsId(value = process.env.NEXT_PUBLIC_GA_ID) {
  const id = value?.trim();
  return id && /^G-[A-Z0-9]+$/.test(id) ? id : undefined;
}

export function analyticsBootstrap(id: string) {
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)});`;
}

type CarEvent =
  | { name: "search_select"; car: string; manufacturer: string; rank: number }
  | {
      name: "share_car";
      car: string;
      method: "native" | "copy" | "kakao";
      rank: number;
    };

declare global {
  interface Window {
    gtag?: (
      command: "event",
      name: string,
      parameters: Record<string, string | number>,
    ) => void;
  }
}

export function trackEvent(event: CarEvent) {
  if (!analyticsId() || typeof window === "undefined" || !window.gtag) return;
  // Pass only known model fields; never send the free-form search input.
  const { name, ...parameters } = event;
  window.gtag("event", name, parameters);
}
