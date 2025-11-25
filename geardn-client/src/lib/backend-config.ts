export function getBackendBaseUrl() {
    // 1. Ưu tiên biến môi trường nếu có set
    const envUrl = process.env.BACKEND_API_URL;
    if (envUrl && envUrl.length > 0) return envUrl;
  
    // 2. Nếu là Production (chạy trong Docker container)
    if (process.env.NODE_ENV === 'production') {
      // Lưu ý: 'geardn-server' phải là tên service trong docker-compose của bạn
      return 'https://geardn.id.vn/api'; 
    }
  
    // 3. Mặc định chạy Local
    return 'http://localhost:8080/api'; 
  }