const { ConflictRequestError } = require("../core/error.response");
const { Created } = require("../core/success.response");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

class UsersController {
  async register(req, res) {
    const { fullName, email, password } = req.body;

    // Tìm kiếm và kiểm tra xem email đã tồn tại hay chưa
    const findUser = await userModel.findOne({ email });
    if (findUser) {
      throw new ConflictRequestError("Email đã tồn tại");
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

    new Created({
      message: "Đăng ký thành công",
      metadata: newUser,
    }).send(res);
  }
}

module.exports = new UsersController();
