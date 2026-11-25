export type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

export type FloatPose = {
  /** Horizontal center, as a percentage of the viewport. */
  x: number;
  /** Vertical center, as a percentage of the viewport. */
  y: number;
  /** Width in viewport-width units. */
  widthVw: number;
  rotate: number;
  /** Mouse-parallax multiplier (higher = more movement). */
  depth: number;
  zIndex: number;
};

export type Product = {
  slug: string;
  name: string;
  collection: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  colors: ColorOption[];
  sizes: number[];
  desktop: FloatPose;
  /** If null, the shoe is hidden on small screens. */
  mobile: FloatPose | null;
};

export const SIZES = [38, 39, 40, 41, 42, 43, 44] as const;

export const products: Product[] = [
  {
    slug: "shift",
    name: "AURE SHIFT",
    collection: "Giày cổ trung",
    description: "Phom vững, phối xanh royal và đen, đế trắng dày.",
    price: 3_190_000,
    image: "/aure-shift.webp",
    alt: "Giày AURE SHIFT màu xanh royal và đen, chụp nghiêng",
    colors: [
      { id: "royal", name: "Xanh royal", hex: "#1e4fd7" },
      { id: "navy", name: "Xanh than", hex: "#15233b" },
      { id: "black", name: "Đen", hex: "#171717" },
    ],
    sizes: [...SIZES],
    desktop: { x: 52, y: 38, widthVw: 28, rotate: -22, depth: 0.35, zIndex: 30 },
    mobile: { x: 54, y: 34, widthVw: 50, rotate: -16, depth: 0.2, zIndex: 30 },
  },
  {
    slug: "trace",
    name: "AURE TRACE",
    collection: "Giày thấp cổ",
    description: "Da trắng, điểm đen và đường đế đỏ mảnh.",
    price: 2_890_000,
    image: "/aure-trace.webp",
    alt: "Giày AURE TRACE màu trắng, đen và đế đỏ, chụp nghiêng",
    colors: [
      { id: "white", name: "Trắng", hex: "#f5f5f5" },
      { id: "black", name: "Đen", hex: "#171717" },
    ],
    sizes: [...SIZES],
    desktop: { x: 74, y: 18, widthVw: 16, rotate: 18, depth: 0.55, zIndex: 18 },
    mobile: { x: 78, y: 16, widthVw: 32, rotate: 14, depth: 0.25, zIndex: 18 },
  },
  {
    slug: "01",
    name: "AURE 01",
    collection: "Giày thấp cổ",
    description: "Da đen mịn, đế trắng phẳng, form tối giản.",
    price: 2_490_000,
    image: "/aure-01.webp",
    alt: "Giày AURE 01 màu đen đế trắng, chụp nghiêng",
    colors: [
      { id: "black", name: "Đen", hex: "#171717" },
      { id: "white", name: "Trắng", hex: "#f5f5f5" },
    ],
    sizes: [...SIZES],
    desktop: { x: 28, y: 62, widthVw: 15, rotate: 10, depth: 0.7, zIndex: 22 },
    mobile: { x: 22, y: 68, widthVw: 34, rotate: 8, depth: 0.2, zIndex: 22 },
  },
  {
    slug: "void",
    name: "AURE VOID",
    collection: "Giày thấp cổ",
    description: "Đen mờ, chỉ đỏ và đường viền đế mỏng.",
    price: 2_790_000,
    image: "/aure-void.webp",
    alt: "Giày AURE VOID màu đen với chỉ đỏ, chụp nghiêng",
    colors: [
      { id: "black", name: "Đen đỏ", hex: "#171717" },
      { id: "charcoal", name: "Xám than", hex: "#3f3f46" },
    ],
    sizes: [...SIZES],
    desktop: { x: 82, y: 52, widthVw: 14, rotate: -8, depth: 0.85, zIndex: 16 },
    mobile: { x: 84, y: 62, widthVw: 30, rotate: -6, depth: 0.25, zIndex: 16 },
  },
  {
    slug: "drift",
    name: "AURE DRIFT",
    collection: "Giày chạy bộ",
    description: "Da lộn kem, gót nâu và đế cao su caramel.",
    price: 2_690_000,
    image: "/aure-drift.webp",
    alt: "Giày AURE DRIFT màu kem đế nâu, chụp nghiêng",
    colors: [
      { id: "oat", name: "Kem", hex: "#d9c7a8" },
      { id: "tan", name: "Nâu vàng", hex: "#b07d4f" },
    ],
    sizes: [...SIZES],
    desktop: { x: 62, y: 72, widthVw: 15, rotate: 8, depth: 0.5, zIndex: 14 },
    mobile: { x: 50, y: 70, widthVw: 30, rotate: 6, depth: 0.2, zIndex: 14 },
  },
  {
    slug: "pulse",
    name: "AURE PULSE",
    collection: "Giày thấp cổ",
    description: "Toàn trắng, đường may chìm, đế cupsole gọn.",
    price: 2_290_000,
    image: "/aure-pulse.webp",
    alt: "Giày AURE PULSE màu trắng toàn thân, chụp nghiêng",
    colors: [
      { id: "white", name: "Trắng", hex: "#f5f5f5" },
      { id: "ivory", name: "Ngà", hex: "#ece7dc" },
    ],
    sizes: [...SIZES],
    desktop: { x: 16, y: 22, widthVw: 13, rotate: -26, depth: 0.9, zIndex: 12 },
    mobile: null,
  },
  {
    slug: "halo",
    name: "AURE HALO",
    collection: "Giày mỗi ngày",
    description: "Da lộn xám nhạt, điểm tím lavender.",
    price: 2_590_000,
    image: "/aure-halo.webp",
    alt: "Giày AURE HALO màu xám và tím nhạt, chụp nghiêng",
    colors: [
      { id: "lavender", name: "Lavender", hex: "#c5b4d8" },
      { id: "grey", name: "Xám", hex: "#c4c4c8" },
    ],
    sizes: [...SIZES],
    desktop: { x: 88, y: 28, widthVw: 11, rotate: 28, depth: 1.05, zIndex: 10 },
    mobile: null,
  },
  {
    slug: "ridge",
    name: "AURE RIDGE",
    collection: "Giày đi phố",
    description: "Nubuck xanh oliu, mũi cao su đen, đế gai.",
    price: 3_490_000,
    image: "/aure-ridge.webp",
    alt: "Giày AURE RIDGE màu xanh oliu, chụp nghiêng",
    colors: [
      { id: "olive", name: "Oliu", hex: "#4a5c32" },
      { id: "forest", name: "Rêu", hex: "#2f3b28" },
    ],
    sizes: [...SIZES],
    desktop: { x: 9, y: 68, widthVw: 12, rotate: -12, depth: 1.1, zIndex: 8 },
    mobile: null,
  },
];

export const DEFAULT_SLUG = "shift";

export function getProduct(slug: string): Product | undefined {
  return products.find((item) => item.slug === slug);
}

export function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
}
