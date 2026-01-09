// 1. Hàm nhận callback (Giả sử là hàm lưu dữ liệu)
function saveUser(name, callback) {
  console.log('Đang lưu người dùng: ' + name);
  // Sau khi lưu xong (giả sử xong ngay lập tức)
  callback();
}

// 2. Sử dụng: Truyền hàm "hiện thông báo" vào làm callback
saveUser('Trần Văn A', () => {
  console.log('Lưu thành công! Đã gửi email xác nhận.');
});
