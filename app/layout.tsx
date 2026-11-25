import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ShopApp } from "@/components/shop-app";
import "./globals.css";

const sans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AURE — Demo cửa hàng giày",
    template: "%s — AURE",
  },
  description:
    "Bản demo cửa hàng giày tối giản: đôi giày bay trên nền trắng, mở sang trang sản phẩm. Thực hiện bởi TanVo Studio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white font-sans text-neutral-900">
        <ShopApp />
        {children}
      </body>
    </html>
  );
}
