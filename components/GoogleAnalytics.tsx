import Script from "next/script";
import { analyticsId, analyticsBootstrap } from "@/lib/analytics";

export default function GoogleAnalytics() {
  const id = analyticsId();
  if (!id) return null;
  return (
    <>
      <Script id="google-analytics-init" strategy="afterInteractive">
        {analyticsBootstrap(id)}
      </Script>
      <Script
        id="google-analytics-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
    </>
  );
}
