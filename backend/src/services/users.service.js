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
const { createAccentRegex } = require("../utils/format");
const otpModel = require("../models/otp.model");

class UsersService {
  async register({ fullName, email, password }) {
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

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return {
      user: userResponse,
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

  async updateMe({ userId, body }) {
    const { fullName, phone } = body;

    const updateData = {};

    if (fullName !== undefined) {
      const trimmedFullName = String(fullName).trim();

      if (!trimmedFullName) {
        throw new ConflictRequestError("Họ tên không được để trống");
      }

      if (trimmedFullName.length < 2) {
        throw new ConflictRequestError("Họ tên phải có ít nhất 2 ký tự");
      }

      if (trimmedFullName.length > 100) {
        throw new ConflictRequestError("Họ tên không được vượt quá 100 ký tự");
      }

      updateData.fullName = trimmedFullName;
    }

    if (phone !== undefined) {
      const trimmedPhone = String(phone).trim();

      if (trimmedPhone && !/^(0|\+84)[0-9]{9,10}$/.test(trimmedPhone)) {
        throw new ConflictRequestError("Số điện thoại không hợp lệ");
      }

      updateData.phone = trimmedPhone;
    }

    if (body.email !== undefined) {
      throw new ConflictRequestError("Không được cập nhật email tại đây");
    }

    if (body.password !== undefined) {
      throw new ConflictRequestError("Không được cập nhật mật khẩu tại đây");
    }

    if (Object.keys(updateData).length === 0) {
      throw new ConflictRequestError("Không có thông tin nào để cập nhật");
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      })
      .select("-password -refreshToken");

    if (!updatedUser) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    return updatedUser;
  }

  // ===== ADMIN METHODS =====

  async getAllUsers({ page = 1, limit = 10, keyword = "", role = "" }) {
    const query = {};

    if (keyword && keyword.trim()) {
      const searchText = keyword.trim();
      const regexPattern = createAccentRegex(searchText);
      query.$or = [
        { fullName: { $regex: regexPattern, $options: "i" } },
        { email: { $regex: regexPattern, $options: "i" } },
      ];
    }

    if (role && ["customer", "admin"].includes(role)) {
      query.role = role;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await userModel.countDocuments(query);

    const users = await userModel
      .find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getUserById(userId) {
    const user = await userModel
      .findById(userId)
      .select("-password -refreshToken");

    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    return user;
  }

  async updateUserRole({ userId, role }) {
    if (!role || !["customer", "admin"].includes(role)) {
      throw new ConflictRequestError("Role không hợp lệ");
    }

    const user = await userModel
      .findByIdAndUpdate(userId, { role }, { new: true, runValidators: true })
      .select("-password -refreshToken");

    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    return user;
  }

  async deleteUser(userId) {
    const user = await userModel.findById(userId);

    if (!user) {
      throw new NotFoundError("Người dùng không tồn tại");
    }

    if (user.role === "admin") {
      throw new ConflictRequestError("Không thể xóa tài khoản Admin");
    }

    await userModel.findByIdAndDelete(userId);
    return true;
  }
}

module.exports = new UsersService();
