"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { shoeLayoutTransition } from "@/lib/motion";
import { formatVnd, products, type Product } from "@/lib/products";

function isLightHex(hex: string): boolean {
  const value = hex.replace("#", "");
  if (value.length !== 6) return false;
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 220;
}

type SharedProps = {
  product: Product;
};

type HeroProps = SharedProps & {
  enableLayoutId: boolean;
};

type ChromeProps = SharedProps & {
  onBack: () => void;
  onOpenProduct: (slug: string) => void;
  onAdded: (name: string) => void;
};

const desktopGrid =
  "md:fixed md:inset-0 md:z-40 md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]";

export function ProductHero({ product, enableLayoutId }: HeroProps) {
  const reduce = Boolean(useReducedMotion());

  return (
    <div className={`pointer-events-none relative flex justify-center px-6 pt-20 ${desktopGrid}`}>
      <div className="flex w-full justify-center md:items-center md:px-16 md:pt-0">
        <motion.div
          layoutId={enableLayoutId ? `shoe-${product.slug}` : undefined}
          transition={reduce ? { duration: 0 } : shoeLayoutTransition}
          className="w-[86%] max-w-[620px] md:w-[80%]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.alt}
            draggable={false}
            className="h-auto w-full select-none"
          />
        </motion.div>
      </div>
    </div>
  );
}

export function ProductChrome({
  product,
  onBack,
  onOpenProduct,
  onAdded,
}: ChromeProps) {
  const reduce = Boolean(useReducedMotion());
  const [size, setSize] = useState<number>(41);
  const [colorId, setColorId] = useState<string>(product.colors[0]?.id ?? "");

  useEffect(() => {
    setSize(41);
    setColorId(product.colors[0]?.id ?? "");
  }, [product.slug, product.colors]);

  const selectedColor = product.colors.find((c) => c.id === colorId);

  return (
    <motion.div
      className={`pointer-events-none relative px-6 pb-10 ${desktopGrid} md:px-0 md:pb-0`}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative hidden md:block">
        <div className="pointer-events-auto absolute bottom-10 left-0 right-0 flex items-center justify-center gap-3 px-16">
          {products.map((item) => {
            const active = item.slug === product.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => onOpenProduct(item.slug)}
                aria-current={active ? "true" : undefined}
                aria-label={item.name}
                className={`pointer-events-auto h-12 w-12 overflow-hidden rounded-md border bg-white transition-colors ${
                  active
                    ? "border-neutral-900"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-auto flex flex-col justify-center pt-2 md:px-16 md:pr-24 md:pt-0">
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
          {product.collection}
        </p>
        <h1 className="mt-2 text-2xl font-medium uppercase tracking-[0.18em] text-neutral-900 md:text-3xl">
          {product.name}
        </h1>
        <p className="mt-3 text-sm text-neutral-500">{formatVnd(product.price)}</p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
          {product.description}
        </p>

        <fieldset className="mt-8">
          <legend className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
            Chọn size
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((value) => {
              const active = value === size;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSize(value)}
                  className={`h-10 min-w-10 rounded-md px-2.5 text-sm transition-colors ${
                    active
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  }`}
                  aria-pressed={active}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
            Màu
            {selectedColor ? ` · ${selectedColor.name}` : ""}
          </legend>
          <div className="mt-3 flex gap-2.5">
            {product.colors.map((color) => {
              const active = color.id === colorId;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setColorId(color.id)}
                  aria-label={color.name}
                  aria-pressed={active}
                  className={`h-7 w-7 rounded-full border ${
                    isLightHex(color.hex)
                      ? "border-neutral-300"
                      : "border-black/10"
                  } ${active ? "ring-2 ring-neutral-900 ring-offset-2" : ""}`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => onAdded(product.name)}
          className="mt-8 h-12 w-full max-w-sm rounded-full bg-neutral-900 text-sm tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-90"
        >
          Thêm vào giỏ
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="pointer-events-auto fixed left-5 top-16 z-50 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900 md:left-8 md:top-20"
        aria-label="Quay lại cửa hàng"
      >
        <span aria-hidden="true">←</span>
        Quay lại
      </button>
    </motion.div>
  );
}
