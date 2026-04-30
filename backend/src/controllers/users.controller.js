const {
  ConflictRequestError,
  NotFoundError,
  AuthFailureError,
} = require("../core/error.response");
const { Created } = require("../core/success.response");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("../auth/checkAuth");
const jwt = require("jsonwebtoken");
const setCookie = require("../utils/setCookie");

class UsersController {
  async register(req, res) {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      throw new ConflictRequestError("Thiếu thông tin đăng ký");
    }

    const findUser = await userModel.findOne({ email });
    if (findUser) {
      throw new ConflictRequestError("Email đã tồn tại");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // tạo token
    const accessToken = createAccessToken({
      id: newUser._id,
      role: newUser.role,
    });

    const refreshToken = createRefreshToken({
      id: newUser._id,
      role: newUser.role,
    });

    // lưu refreshToken (optional nhưng nên có)
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // set cookie
    setCookie(res, refreshToken);

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return new Created({
      message: "Đăng ký thành công",
      metadata: {
        user: userResponse,
        accessToken,
      },
    }).send(res);
  }

  async login(req, res) {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email });

    // Kiểm tra xem có tài khoản không
    if (!findUser) {
      throw new NotFoundError("Tài khoản hoặc mật khẩu không chính xác!");
    }

    // Kiểm tra mật khẩu
    const isMatchPassword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPassword) {
      throw new AuthFailureError("Tài khoản hoặc mật khẩu không chính xác!");
    }

    // Tạo accessToken và refreshToken
    const accessToken = createAccessToken({
      id: findUser._id,
      role: findUser.role,
    });

    const refreshToken = createRefreshToken({
      id: findUser._id,
      role: findUser.role,
    });

    // Lưu refreshToken
    findUser.refreshToken = refreshToken;
    await findUser.save();

    // set cookie
    setCookie(res, refreshToken);

    return new Created({
      message: "Đăng nhập thành công",
      metadata: {
        accessToken,
      },
    }).send(res);
  }

  async refreshToken(req, res) {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await userModel.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const newAccessToken = createAccessToken({
      id: user._id,
      role: user.role,
    });
    return res.json({
      accessToken: newAccessToken,
    });
  }

  async logout(req, res) {
    const token = req.cookies.refreshToken;

    if (token) {
      const user = await userModel.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken");

    return res.json({ message: "Logout thành công" });
  }
}

module.exports = new UsersController();
