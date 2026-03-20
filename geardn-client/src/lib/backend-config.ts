export function getBackendBaseUrl() {
  // 1. Ưu tiên biến môi trường NEXT_PUBLIC_ cho client-side (Browser)
  // Hoặc BACKEND_API_URL cho server-side (như trong RSC hoặc generateMetadata)
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  if (envUrl && envUrl.length > 0) return envUrl;

  // 2. Nếu là Production (chạy trên Vercel hoặc Docker)
  if (process.env.NODE_ENV === "production") {
    // Đã sửa lại thành đúng sub-domain API của bạn!
    return "https://api.geardn.id.vn/api";
  }

  // 3. Mặc định chạy Local
  return "http://localhost:8080/api";
}
