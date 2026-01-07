"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4 text-center">
      <h2>Có lỗi xảy ra!</h2>
      <button onClick={() => reset()}>Thử lại</button>
      <p className="text-xs text-red-500">{error.message}</p>
    </div>
  );
}
