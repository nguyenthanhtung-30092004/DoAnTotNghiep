"use strict";

// 1. Import bộ từ điển chuẩn quốc tế từ thư viện
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

// 2. Class gốc
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// 3. Các class lỗi cụ thể
class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}

// MENTOR TẶNG THÊM: Lỗi xác thực (Dùng cho vụ sai Token / API Key)
class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED, // "Unauthorized"
    statusCode = StatusCodes.UNAUTHORIZED, // 401
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
};
