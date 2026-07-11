const { AuthFailureError } = require('../core/error.response');
const jwt = require("jsonwebtoken");
const userModel = require('../models/user.model');

const authUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthFailureError("Phiên đăng nhập hết hạn");
    }

    const user = await userModel.findById(decoded.id);
    if (!user) {
      throw new AuthFailureError("Người dùng không tồn tại");
    }

    req.user = user;
    req.user.userId = user._id;
    return next();
  } catch (error) {
    next(error);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      req.user = null;
      return next();
    }
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
      req.user = null;
      return next();
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      req.user = null;
      return next();
    }
    req.user = user;
    req.user.userId = user._id;
    return next();
  } catch (error) {
    req.user = null;
    next(error);
  }
};

const authAdmin = async (req, res, next) => {
  try {
    // 1. Lấy Token từ cookie
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AuthFailureError("Vui lòng đăng nhập lại");
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthFailureError("Phiên đăng nhập hết hạn");
    }

    // 3. Tìm user trong db để đảm bảo user vẫn tồn tại
    const user = await userModel.findById(decoded.id);
    if (!user) {
      throw new AuthFailureError("Người dùng không tồn tại");
    }

    // 4. Kiểm tra quyền ADMIN
    if (user.role !== "admin") {
      throw new AuthFailureError("Bạn không có quyền truy cập khu vực này");
    }

    req.user = user;
    req.user.userId = user._id;
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authAdmin, authUser, optionalAuth };
