"use strict";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const keyTokenModel = require("../models/keyToken.model");

const HEADER = {
  API_KEY: "x_api_key",
  CLIENT_ID: "x_client_id",
  AUTHORIZATION: "authorization",
};

// Hàm tạo cặp Token
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const verifyJWT = async (token, secretKey) => {
  return await JWT.verify(token, secretKey);
};

// Middleware xác thực cho Web App (Dùng Cookie)
const authentication = asyncHandler(async (req, res, next) => {
  /*
    1. Lấy userId từ Header (bắt buộc để biết ai đang gọi)
    2. Lấy accessToken từ Cookie
    3. Tìm keyStore của user này
    4. Verify token
  */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request!");

  const accessToken = req.cookies.accessToken;
  if (!accessToken) throw new AuthFailureError("Invalid Request!");

  // Tìm các keyStore của user
  const keyStores = await keyTokenModel.find({ user: userId });
  if (!keyStores || keyStores.length === 0)
    throw new NotFoundError("Not found keyStore!");

  // Duyệt qua các keyStore để tìm cái khớp với token này (Hỗ trợ đa thiết bị)
  let currentKeyStore = null;
  let decodedUser = null;

  for (const store of keyStores) {
    try {
      const decode = JWT.verify(accessToken, store.publicKey);
      if (decode.userId === userId) {
        currentKeyStore = store;
        decodedUser = decode;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!currentKeyStore)
    throw new AuthFailureError("Session expired or invalid!");

  req.keyStore = currentKeyStore;
  req.user = decodedUser;
  return next();
});

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
