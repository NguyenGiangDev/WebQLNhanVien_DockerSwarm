const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const Authentication = require('../model/model_authentication'); // Model cho người dùng 
const jwt = require('jsonwebtoken'); // Nếu bạn muốn sử dụng JWT để tạo token xác thực

// Route xử lý đăng nhập
router.post('/login', async (req, res) => {
  const ID = req.body.id;
  const Password = req.body.password;

  try {
    // Tìm tất cả người dùng trong database
    const users = await Authentication.find();

    // In ra danh sách tất cả người dùng
    console.log("Dữ liệu bên gửi:", ID);
    console.log("Danh sách người dùng từ cơ sở dữ liệu:", users);

    // Tìm người dùng có ID trùng khớp
    const user = users.find(user => user.ID === ID);

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' });
    }

    // So sánh mật khẩu đã nhập với mật khẩu trong database
   // So sánh mật khẩu đã nhập với mật khẩu trong database (so sánh trực tiếp)
   console.log("Mật khẩu bên gửi:", Password);
if (Password !== user.Password) {
    return res.status(401).json({ message: 'Mật khẩu không chính xác' });
  }

    // Nếu thông tin đăng nhập hợp lệ
    // Bạn có thể sử dụng JWT để tạo token
    const token = jwt.sign(
      { role: user.ID}, // Payload chứa thông tin user
      process.env.JWT_SECRET, // Khóa bí mật
      { expiresIn: '1h' } // Thời gian hết hạn của token
    );

    // Trả về token và thông tin người dùng
    return res.json({
      message: 'Đăng nhập thành công',
      token, // Token để xác thực các request tiếp theo
      role: user.ID // Trả về vai trò của người dùng
    });
      
  } catch (error) {
    console.error('Lỗi trong quá trình đăng nhập:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại sau' });
  }
});

module.exports = router; // Xuất router để sử dụng trong app.js
