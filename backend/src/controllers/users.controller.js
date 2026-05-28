const { Created, OK } = require("../core/success.response");
const usersService = require("../services/users.service");
const setCookie = require("../utils/setCookie");

class UsersController {
  async register(req, res) {
    const { fullName, email, password } = req.body;

    const result = await usersService.register({ fullName, email, password });

    setCookie(res, "accessToken", result.accessToken, 1 * 60 * 60 * 1000);
    setCookie(
      res,
      "refreshToken",
      result.refreshToken,
      30 * 24 * 60 * 60 * 1000,
    );

    return new Created({
      message: "Đăng ký thành công",
      metadata: {
        user: result.user,
        accessToken: result.accessToken,
      },
    }).send(res);
  }

  async login(req, res) {
    const { email, password } = req.body;

    const result = await usersService.login({ email, password });

    setCookie(res, "accessToken", result.accessToken, 1 * 60 * 60 * 1000); // 1 giờ
    setCookie(
      res,
      "refreshToken",
      result.refreshToken,
      30 * 24 * 60 * 60 * 1000,
    ); // 30 ngày

    return new OK({
      message: "Đăng nhập thành công",
      metadata: result.user,
    }).send(res);
  }

  async refreshToken(req, res) {
    const token = req.cookies.refreshToken;
    const newAccessToken = await usersService.refreshToken(token);

    return new OK({
      metadata: { accessToken: newAccessToken },
    }).send(res);
  }

  async logout(req, res) {
    const token = req.cookies.refreshToken;
    await usersService.logout(token);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return new OK({ message: "Logout thành công" }).send(res);
  }

  async me(req, res) {
    const user = req.user?.toObject ? req.user.toObject() : req.user;

    if (user) {
      delete user.password;
      delete user.refreshToken;
    }

    return new OK({
      message: "Lấy thông tin người dùng thành công",
      metadata: user,
    }).send(res);
  }

  async updateMe(req, res) {
    const userId = req.user._id || req.user.id;

    const updatedUser = await usersService.updateMe({
      userId,
      body: req.body,
    });

    return new OK({
      message: "Cập nhật thông tin cá nhân thành công",
      metadata: updatedUser,
    }).send(res);
  }

  async forgotPassword(req, res) {
    const { email } = req.body;
    await usersService.forgotPassword(email);

    return new OK({
      message: "Mã OTP đã được gửi đến email của bạn",
      metadata: true,
    }).send(res);
  }

  async verifyOtp(req, res) {
    const { email, otp } = req.body;
    const resetToken = await usersService.verifyOtp({ email, otp });

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
    const token = req.cookies.resetToken;

    await usersService.resetPassword({ newPassword, token });

    res.clearCookie("resetToken");

    return new OK({
      message: "Đổi mật khẩu thành công",
    }).send(res);
  }

  // ===== ADMIN METHODS =====

  async getAllUsers(req, res) {
    const { page = 1, limit = 10, keyword = "", role = "" } = req.query;
    const result = await usersService.getAllUsers({ page, limit, keyword, role });

    return new OK({
      message: "Lấy danh sách người dùng thành công",
      metadata: result,
    }).send(res);
  }

  async getUserById(req, res) {
    const { userId } = req.params;
    const user = await usersService.getUserById(userId);

    return new OK({
      message: "Lấy thông tin người dùng thành công",
      metadata: user,
    }).send(res);
  }

  async updateUserRole(req, res) {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await usersService.updateUserRole({ userId, role });

    return new OK({
      message: "Cập nhật quyền người dùng thành công",
      metadata: user,
    }).send(res);
  }

  async deleteUser(req, res) {
    const { userId } = req.params;
    await usersService.deleteUser(userId);

    return new OK({
      message: "Xóa người dùng thành công",
      metadata: true,
    }).send(res);
  }
}

module.exports = new UsersController();
