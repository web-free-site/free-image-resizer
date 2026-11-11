import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SiteAds } from "@/components/SiteAds";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://free-image-resizer.web-free.site"),
  title: { default: "Free Image Resizer", template: "%s" },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`}>
        <SiteAds />
        {children}
      </body>
    </html>
  );
}
