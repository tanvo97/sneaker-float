import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatVnd, getProduct, products } from "@/lib/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return { title: "Không tìm thấy" };
  }
  return {
    title: product.name,
    description: `${product.description} Giá ${formatVnd(product.price)}.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  if (!getProduct(slug)) {
    notFound();
  }
  return null;
}
