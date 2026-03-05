export const getTagStyle = (value: string) => {
  switch (value) {
    case "hot":
      return { bgcolor: "#FFF", color: "#000", borderColor: "#000" }; // Đỏ
    case "bestseller":
      return { bgcolor: "#FFF", color: "#000", borderColor: "#000" }; // Cam
    case "new":
      return { bgcolor: "#fff", color: "#1780fc", borderColor: "#1780fc" }; // Xanh lá
    case "sale":
      return { bgcolor: "#242424", color: "#fff", borderColor: "#000" }; // Xanh lá
    case "coming_soon":
      return { bgcolor: "#242424", color: "#FFF", borderColor: "#000" }; // Xanh lá
    default:
      return { bgcolor: "#757575", color: "#FFF", borderColor: "#D32F2F" }; // Xám (mặc định)
  }
};
