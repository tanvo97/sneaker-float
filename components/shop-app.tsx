"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { FloatingShoe } from "@/components/floating-shoe";
import { ProductChrome, ProductHero } from "@/components/product-view";
import { fadeText } from "@/lib/motion";
import {
  DEFAULT_SLUG,
  formatVnd,
  getProduct,
  products,
} from "@/lib/products";

function slugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/product\/([^/]+)\/?$/);
  return match?.[1] ?? null;
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return mobile;
}

export function ShopApp() {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = Boolean(useReducedMotion());
  const isMobile = useIsMobile();

  const openSlug = slugFromPath(pathname);
  const openProduct = openSlug ? getProduct(openSlug) : undefined;
  const productOpen = Boolean(openProduct);

  const [selectedSlug, setSelectedSlug] = useState<string>(
    openProduct?.slug ?? DEFAULT_SLUG,
  );
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  // layoutId only when arriving from / leaving to the gallery, not when
  // swapping one product for another (that would fly from an invisible shoe).
  const previousPath = useRef(pathname);
  const [enableLayoutId, setEnableLayoutId] = useState(true);

  useEffect(() => {
    const prev = previousPath.current;
    const prevWasProduct = Boolean(slugFromPath(prev));
    const nextIsProduct = Boolean(slugFromPath(pathname));
    setEnableLayoutId(!(prevWasProduct && nextIsProduct));
    previousPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (openProduct) {
      setSelectedSlug(openProduct.slug);
    }
  }, [openProduct]);

  const selected = useMemo(
    () => getProduct(selectedSlug) ?? products[0],
    [selectedSlug],
  );

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  useEffect(() => {
    if (reduce || isMobile || productOpen) {
      pointerX.set(0);
      pointerY.set(0);
      return;
    }

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      pointerX.set(nx * 2);
      pointerY.set(ny * 2);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [isMobile, pointerX, pointerY, productOpen, reduce]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const openProductPage = useCallback(
    (slug: string) => {
      if (pathname === `/product/${slug}`) return;
      router.push(`/product/${slug}`, { scroll: false });
    },
    [pathname, router],
  );

  const handleSelect = useCallback(
    (slug: string) => {
      if (isMobile) {
        if (selectedSlug === slug) {
          openProductPage(slug);
        } else {
          setSelectedSlug(slug);
        }
        return;
      }
      openProductPage(slug);
    },
    [isMobile, openProductPage, selectedSlug],
  );

  const handleBack = useCallback(() => {
    router.push("/", { scroll: false });
  }, [router]);

  const poseCss = useMemo(() => {
    const desktop = products
      .map(
        (item) =>
          `.pose-${item.slug}{left:${item.desktop.x}%;top:${item.desktop.y}%;width:min(${item.desktop.widthVw}vw,420px);}`,
      )
      .join("");
    const mobile = products
      .map((item) => {
        if (!item.mobile) {
          return `.pose-${item.slug}{display:none;}`;
        }
        return `.pose-${item.slug}{left:${item.mobile.x}%;top:${item.mobile.y}%;width:min(${item.mobile.widthVw}vw,280px);}`;
      })
      .join("");
    return `${desktop}@media (max-width:767px){${mobile}}`;
  }, []);

  return (
    <LayoutGroup>
      <style>{poseCss}</style>
      <div className="relative min-h-dvh overflow-hidden bg-white text-neutral-900">
        <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-start justify-between px-5 pt-5 md:px-8 md:pt-8">
          <p className="pointer-events-auto text-[10px] uppercase tracking-[0.22em] text-neutral-400">
            Demo · TanVo Studio
          </p>
          <p className="text-[13px] font-medium uppercase tracking-[0.32em] text-neutral-900">
            Aure
          </p>
        </header>

        <div className="absolute inset-0">
          {products.map((item) => {
            if (productOpen && item.slug === openProduct?.slug) {
              return null;
            }
            return (
              <FloatingShoe
                key={item.slug}
                product={item}
                selected={item.slug === selected.slug}
                productOpen={productOpen}
                reduceMotion={reduce}
                pointerX={pointerX}
                pointerY={pointerY}
                onHover={(slug) => {
                  if (!isMobile && !productOpen) setSelectedSlug(slug);
                }}
                onSelect={handleSelect}
              />
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {!productOpen ? (
            <motion.div
              key="gallery-copy"
              className="pointer-events-none absolute left-6 z-50 max-w-[16rem] max-md:bottom-20 max-md:right-6 max-md:top-auto md:left-12 md:top-[42%] md:-translate-y-1/2"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={selected.slug} {...fadeText}>
                  <p className="text-[13px] font-medium uppercase tracking-[0.28em] text-neutral-900 md:text-sm">
                    {selected.name}
                  </p>
                  <p className="mt-2 text-[11px] tracking-[0.08em] text-neutral-400">
                    {formatVnd(selected.price)}
                  </p>
                </motion.div>
              </AnimatePresence>

              {isMobile ? (
                <button
                  type="button"
                  onClick={() => openProductPage(selected.slug)}
                  className="pointer-events-auto mt-4 border-0 bg-transparent p-0 text-[11px] uppercase tracking-[0.2em] text-neutral-500 underline decoration-neutral-300 underline-offset-4"
                >
                  Xem chi tiết
                </button>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!productOpen ? (
          <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2 md:bottom-8">
            {products.map((item) => {
                const hiddenOnMobile = item.mobile === null;
                const active = item.slug === selected.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    aria-label={`Chọn ${item.name}`}
                    onClick={() => {
                      setSelectedSlug(item.slug);
                    }}
                    className={`h-1.5 rounded-full transition-all ${hiddenOnMobile ? "max-md:hidden" : ""} ${
                      active
                        ? "w-5 bg-neutral-900"
                        : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                );
              })}
          </div>
        ) : null}

        {openProduct ? (
          <div className="fixed inset-0 z-40 overflow-y-auto md:overflow-hidden">
            <ProductHero
              product={openProduct}
              enableLayoutId={enableLayoutId}
            />
            <ProductChrome
              product={openProduct}
              onBack={handleBack}
              onOpenProduct={openProductPage}
              onAdded={(name) => showToast(`Đã thêm ${name} vào giỏ.`)}
            />
          </div>
        ) : null}

        <AnimatePresence>
          {toast ? (
            <motion.div
              key="toast"
              role="status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed bottom-8 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-neutral-900 px-5 py-2.5 text-xs tracking-[0.08em] text-white shadow-lg"
            >
              {toast}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
