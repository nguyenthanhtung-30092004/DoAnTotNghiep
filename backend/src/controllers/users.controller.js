const {
  ConflictRequestError,
  NotFoundError,
  AuthFailureError,
} = require("../core/error.response");
const { Created, OK } = require("../core/success.response");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("../auth/checkAuth");
const SendMailForgotPassword = require("../utils/mailForgotPassword");

const jwt = require("jsonwebtoken");
const setCookie = require("../utils/setCookie");
const otpGenerator = require("otp-generator");
const otpModel = require("../models/otp.model");

class UsersController {
  async register(req, res) {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      throw new ConflictRequestError("Thiếu thông tin đăng ký");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new ConflictRequestError("Email không hợp lệ");
    }

    if (password.length < 6) {
      throw new ConflictRequestError("Password phải >= 6 ký tự");
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

    // Set AccessToken sống trong 1 giờ
    setCookie(res, "accessToken", accessToken, 1 * 60 * 60 * 1000);

    // Set RefreshToken sống trong 30 ngày
    setCookie(res, "refreshToken", refreshToken, 30 * 24 * 60 * 60 * 1000);

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

    if (!email || !password) {
      throw new ConflictRequestError("Thiếu thông tin");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new AuthFailureError("Sai email hoặc mật khẩu");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AuthFailureError("Sai email hoặc mật khẩu");
    }

    const accessToken = createAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = createRefreshToken({
      id: user._id,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save();

    setCookie(res, "accessToken", accessToken, 1 * 60 * 60 * 1000); // 1 giờ

    setCookie(res, "refreshToken", refreshToken, 30 * 24 * 60 * 60 * 1000); // 30 ngày

    const userRepon = {
      id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
    };
    return new Created({
      message: "Đăng nhập thành công",
      metadata: userRepon,
    }).send(res);
  }

  async refreshToken(req, res) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        throw new AuthFailureError("Chưa đăng nhập");
      }

      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      const user = await userModel.findById(decoded.id);
      if (!user || user.refreshToken !== token) {
        throw new AuthFailureError("Token không hợp lệ");
      }

      const newAccessToken = createAccessToken({
        id: user._id,
        role: user.role,
      });
      return new OK({
        metadata: { accessToken: newAccessToken },
      }).send(res);
    } catch (error) {
      throw new AuthFailureError("Token hết hạn hoặc không hợp lệ");
    }
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
    res.clearCookie("accessToken");

    return new OK({ message: "Logout thành công" }).send(res);
  }

  async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
      throw new ConflictRequestError("Thiếu Email");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      throw new NotFoundError("Email không tồn tại");
    }

    const lastOtp = await otpModel.findOne({ email });
    if (lastOtp && lastOtp.createdAt > Date.now() - 60 * 1000) {
      throw new ConflictRequestError("Vui lòng chờ 60s để gửi lại OTP");
    }

    await otpModel.deleteMany({ email });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const newOtp = await otpModel.create({
      otp,
      email,
    });

    await SendMailForgotPassword(email, otp);

    return new OK({
      message: "Mã OTP đã được gửi đến email của bạn",
      metadata: true,
    }).send(res);
  }

  async verifyOtp(req, res) {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ConflictRequestError("Thiếu dữ liệu");
    }

    const record = await otpModel.findOne({ otp, email });

    if (!record) {
      throw new AuthFailureError("OTP không đúng");
    }

    if (record.expiredAt < new Date()) {
      throw new AuthFailureError("OTP đã hết hạn");
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    res.cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 5 * 60 * 1000,
    });

    return new OK({ message: "OTP hợp lệ" }).send(res);
  }

  async resetPassword(req, res) {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      throw new ConflictRequestError("Password không hợp lệ");
    }

    const token = req.cookies.resetToken;

    if (!token) {
      throw new AuthFailureError("Thiếu token");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthFailureError("Token không hợp lệ hoặc hết hạn");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await userModel.updateOne({ email: decoded.email }, { password: hashed });

    await otpModel.deleteMany({ email: decoded.email });
    res.clearCookie("resetToken");

    return new OK({
      message: "Đổi mật khẩu thành công",
    }).send(res);
  }
}

module.exports = new UsersController();
