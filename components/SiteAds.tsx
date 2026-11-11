import Script from "next/script";
import ads from "@/public/ads.json";

/** Popunder in head; Social Bar before end of body (static export). */
export function SiteAds() {
  const popunder = typeof ads.popunder === "string" ? ads.popunder.trim() : "";
  const socialBar = typeof ads.socialBar === "string" ? ads.socialBar.trim() : "";

  return (
    <>
      {popunder ? <Script id="fir-popunder" src={popunder} strategy="beforeInteractive" /> : null}
      {socialBar ? <Script id="fir-social-bar" src={socialBar} strategy="lazyOnload" /> : null}
    </>
  );
}
