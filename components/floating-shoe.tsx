"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { shoeLayoutTransition } from "@/lib/motion";
import type { Product } from "@/lib/products";

type FloatingShoeProps = {
  product: Product;
  selected: boolean;
  productOpen: boolean;
  reduceMotion: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  onHover: (slug: string) => void;
  onSelect: (slug: string) => void;
};

export function FloatingShoe({
  product,
  selected,
  productOpen,
  reduceMotion,
  pointerX,
  pointerY,
  onHover,
  onSelect,
}: FloatingShoeProps) {
  const prefersReduced = useReducedMotion();
  const reduce = reduceMotion || Boolean(prefersReduced);
  const hiddenOnMobile = product.mobile === null;
  const depth = product.desktop.depth;

  const x = useTransform(pointerX, (value) => value * depth * 18);
  const y = useTransform(pointerY, (value) => value * depth * 12);

  return (
    <motion.div
      className={`absolute -translate-x-1/2 -translate-y-1/2 pose-${product.slug} ${hiddenOnMobile ? "max-md:hidden" : ""}`}
      style={{
        zIndex: selected ? product.desktop.zIndex + 20 : product.desktop.zIndex,
        x: reduce ? 0 : x,
        y: reduce ? 0 : y,
      }}
      animate={{
        opacity: productOpen ? 0 : 1,
        scale: productOpen ? 0.92 : selected ? 1.04 : 1,
      }}
      transition={{ duration: reduce ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.button
        type="button"
        layoutId={`shoe-${product.slug}`}
        className="block w-full cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2"
        animate={
          reduce || productOpen
            ? { rotate: product.desktop.rotate, y: 0 }
            : {
                y: [0, -14, 0, 10, 0],
                rotate: [
                  product.desktop.rotate,
                  product.desktop.rotate + 2.2,
                  product.desktop.rotate,
                  product.desktop.rotate - 1.8,
                  product.desktop.rotate,
                ],
              }
        }
        transition={
          reduce || productOpen
            ? {
                duration: reduce ? 0 : 0.35,
                layout: reduce ? { duration: 0 } : shoeLayoutTransition,
              }
            : {
                y: {
                  duration: 7.5 + (product.desktop.zIndex % 7) * 0.45,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (product.desktop.zIndex % 5) * 0.28,
                },
                rotate: {
                  duration: 7.5 + (product.desktop.zIndex % 7) * 0.45,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (product.desktop.zIndex % 5) * 0.28,
                },
                layout: shoeLayoutTransition,
              }
        }
        onHoverStart={() => onHover(product.slug)}
        onFocus={() => onHover(product.slug)}
        onClick={() => onSelect(product.slug)}
        aria-label={`${product.name}.${selected ? " Đang chọn." : ""} Mở trang sản phẩm.`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt=""
          draggable={false}
          className="pointer-events-none h-auto w-full select-none"
        />
      </motion.button>
    </motion.div>
  );
}
