# AURE — demo shop sneaker

Bản demo landing cho **TanVo Studio**: cửa hàng giày hư cấu **AURE**, nền trắng tối giản, 8 đôi giày bay quanh màn hình, tên sản phẩm đổi theo đôi đang chọn, rồi chuyển mượt sang trang chi tiết.

Ý tưởng tham khảo từ reel Facebook của FBX Digital (shop sneaker, giày lơ lửng). Ảnh giày là thiết kế gốc, chụp studio, không dùng logo hay hình thương hiệu có bản quyền.

> Đây là demo giao diện. Không có giỏ hàng thật, thanh toán hay tồn kho.

## Chạy local

Cần Node 20+ và pnpm.

```bash
pnpm install
pnpm dev
```

Mở [http://localhost:3101](http://localhost:3101). Cổng `3101` để không trùng demo `matcha-scroll`.

```bash
pnpm build
pnpm start
```

## Cấu trúc

```
app/
  layout.tsx                 # font, metadata, mount ShopApp (giữ tree khi đổi route)
  page.tsx                   # route `/` — UI nằm ở ShopApp
  product/[slug]/page.tsx    # route `/product/[slug]`, generateStaticParams
  not-found.tsx
lib/
  products.ts                # data typed, dễ port sang /demo/ecommerce
  motion.ts                  # spring dùng chung cho layoutId
components/
  shop-app.tsx               # gallery + đọc URL + toast
  floating-shoe.tsx          # bay lơ lửng, parallax, layoutId
  product-view.tsx           # trang sản phẩm, nút Thêm vào giỏ
public/*.webp                # ảnh giày đã tối ưu, mỗi file < 150KB
```

## Hiệu ứng `layoutId`

`ShopApp` được render trong `app/layout.tsx`, nên không unmount khi chuyển `/` ↔ `/product/[slug]`. Toàn bộ UI nằm trong một `LayoutGroup`.

- Mỗi đôi giày trên gallery là `motion.button` với `layoutId={`shoe-${slug}`}`.
- Khi mở sản phẩm, instance gallery của đôi đó bị gỡ, và hero trên `ProductView` mount với cùng `layoutId`. `motion` nội suy vị trí, kích thước và góc xoay — đôi giày “bay” từ chỗ đang lơ lửng vào vị trí hero.
- Nút **Quay lại** làm ngược lại.
- Khi đang ở trang sản phẩm rồi đổi sang đôi khác (thumbnail), `layoutId` được tắt để tránh bay từ một đôi đang ẩn. Ảnh mới chỉ fade.
- `useReducedMotion`: tắt bay, parallax và spring; chuyển trang gần như tức thì.

URL vẫn là App Router thật (`router.push`), nên có thể mở trực tiếp `/product/shift`.

## Tương tác

- Desktop: hover đổi tên (và giá) ở cạnh trái; click mở trang sản phẩm. Chuột di chuyển làm giày parallax nhẹ, mỗi đôi một độ sâu khác nhau.
- Mobile: chỉ hiện 5 đôi. Chạm một lần để chọn, chạm lần nữa hoặc “Xem chi tiết” để mở trang sản phẩm.
- “Thêm vào giỏ” chỉ hiện toast, không có cart.

## Port sang site chính

File `lib/products.ts` export `Product`, `products`, `getProduct`, `formatVnd`. Có thể đưa nguyên sang `/demo/ecommerce` rồi đổi import ảnh và route prefix.

## Ghi chú kỹ thuật

- Next.js App Router, React 19, TypeScript strict, Tailwind v4, `motion`.
- Font Inter (subset `vietnamese`) để hiện đúng dấu.
- Không dùng Three.js. Ảnh là WebP 2D.
- `pnpm capture` (khi dev/start đang chạy) chụp screenshot bằng Playwright, dùng Chrome hệ thống.
