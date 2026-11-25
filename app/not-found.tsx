import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400">
        AURE
      </p>
      <h1 className="mt-4 text-xl font-medium tracking-[0.08em] text-neutral-900">
        Không tìm thấy đôi giày này
      </h1>
      <Link
        href="/"
        className="mt-8 text-[11px] uppercase tracking-[0.2em] text-neutral-500 underline decoration-neutral-300 underline-offset-4"
      >
        Về cửa hàng
      </Link>
    </div>
  );
}
