const {
  ConflictRequestError,
  NotFoundError,
  AuthFailureError,
} = require("../core/error.response");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("../auth/checkAuth");
const SendMailForgotPassword = require("../utils/mailForgotPassword");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const otpModel = require("../models/otp.model");

class UsersService {
  async register({ fullName, email, password }) {
    if (!fullName || !email || !password) {
      throw new ConflictRequestError("Thiếu thông tin đăng ký");
    }

    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) {
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

    const accessToken = createAccessToken({
      id: newUser._id,
      role: newUser.role,
    });

    const refreshToken = createRefreshToken({
      id: newUser._id,
      role: newUser.role,
    });

    newUser.refreshToken = refreshToken;
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  async login({ email, password }) {
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

    return {
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token) {
    if (!token) {
      throw new AuthFailureError("Chưa đăng nhập");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      const user = await userModel.findById(decoded.id);
      if (!user || user.refreshToken !== token) {
        throw new AuthFailureError("Token không hợp lệ");
      }

      const newAccessToken = createAccessToken({
        id: user._id,
        role: user.role,
      });

      return newAccessToken;
    } catch (error) {
      throw new AuthFailureError("Token hết hạn hoặc không hợp lệ");
    }
  }

  async logout(token) {
    if (token) {
      const user = await userModel.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    return true;
  }

  async forgotPassword(email) {
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

    await otpModel.create({
      otp,
      email,
    });

    await SendMailForgotPassword(email, otp);

    return true;
  }

  async verifyOtp({ email, otp }) {
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

    return resetToken;
  }

  async resetPassword({ newPassword, token }) {
    if (!newPassword || newPassword.length < 6) {
      throw new ConflictRequestError("Password không hợp lệ");
    }

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

    return true;
  }
}

module.exports = new UsersService();
