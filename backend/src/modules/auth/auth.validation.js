const emailRegex = /^\S+@\S+\.\S+$/;
const otpRegex = /^\d{6}$/;
const Joi = require("joi");

const createSchema = (validator) => ({
  validate(payload = {}) {
    const body = payload.body || {};
    const result = validator(body);

    if (result.error) {
      return {
        error: {
          message: result.error,
        },
      };
    }

    return {
      value: {
        ...payload,
        body: result.value,
      },
    };
  },
});

const requireEmail = (email) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedEmail) return { error: "Vui lòng nhập email" };
  if (!emailRegex.test(normalizedEmail)) return { error: "Email không hợp lệ" };

  return { value: normalizedEmail };
};

const register = createSchema((body) => {
  const fullName = String(body.fullName || "").trim();
  const emailResult = requireEmail(body.email);
  const password = String(body.password || "");

  if (!fullName) return { error: "Vui lòng nhập họ và tên" };
  if (emailResult.error) return emailResult;
  if (!password) return { error: "Vui lòng nhập mật khẩu" };
  if (password.length < 6) {
    return { error: "Mật khẩu phải có ít nhất 6 ký tự" };
  }

  return {
    value: {
      fullName,
      email: emailResult.value,
      password,
    },
  };
});

const login = createSchema((body) => {
  const emailResult = requireEmail(body.email);
  const password = String(body.password || "");

  if (emailResult.error) return emailResult;
  if (!password) return { error: "Vui lòng nhập mật khẩu" };

  return {
    value: {
      email: emailResult.value,
      password,
    },
  };
});

const forgotPassword = createSchema((body) => {
  const emailResult = requireEmail(body.email);

  if (emailResult.error) return emailResult;

  return {
    value: {
      email: emailResult.value,
    },
  };
});

const verifyOtp = createSchema((body) => {
  const emailResult = requireEmail(body.email);
  const otp = String(body.otp || "").trim();

  if (emailResult.error) return emailResult;
  if (!otpRegex.test(otp)) return { error: "OTP phải gồm 6 chữ số" };

  return {
    value: {
      email: emailResult.value,
      otp,
    },
  };
});

const resetPassword = createSchema((body) => {
  const newPassword = String(body.newPassword || "");

  if (!newPassword) return { error: "Vui lòng nhập mật khẩu mới" };
  if (newPassword.length < 6) {
    return { error: "Mật khẩu mới phải có ít nhất 6 ký tự" };
  }

  return {
    value: {
      newPassword,
    },
  };
});

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
