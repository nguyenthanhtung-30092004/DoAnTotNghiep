const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

class UsersController {
  async register(req, res) {
    const { fullName, email, password } = req.body;

    // Tìm kiếm và kiểm tra xem email đã tồn tại hay chưa
    const findUser = await userModel.findOne({ email });
    if (findUser) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    // Nếu chưa tồn tại, mã hóa mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Đăng ký thành công",
      data: { fullName, email },
    });
  }
}

module.exports = new UsersController();
