"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToten.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./user.service");
const RoleUser = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
};

class AccessService {
  /* 
    1 - Check Email
    2 - match Password
    3 - create AccessToken and RefreshToken
    4 - generate Token
    5 - get data return login
  */
  static login = async ({ email, password }) => {
    // Xóa tham số refreshToken ở đây vì lúc login chưa có token
    const foundUser = await findByEmail({ email });

    // 1. Kiểm tra User tồn tại
    if (!foundUser) {
      throw new BadRequestError("User not registered!");
    }

    // 2. Kiểm tra mật khẩu (ĐÃ THÊM AWAIT)
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new AuthFailureError("Authentication error!");
    }

    // 3. Tạo Key cặp
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // 4. Tạo token
    const tokens = await createTokenPair(
      {
        userId: foundUser._id,
        email,
        role: foundUser.role,
      },
      publicKey,
      privateKey,
    );

    // Lưu vào DB (ĐÃ BỔ SUNG userId)
    await KeyTokenService.createKeyToken({
      userId: foundUser._id, // THIẾU CÁI NÀY LÀ KHÔNG LƯU ĐƯỢC VÀO DB
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    // 5. Trả dữ liệu
    return {
      user: getInfoData({
        fields: ["_id", "email", "fullName", "phoneNumber", "address"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static signUp = async ({
    fullName,
    email,
    password,
    phoneNumber,
    address,
  }) => {
    // Kiểm tra email tồn tại
    const holderUser = await userModel.findOne({ email }).lean();
    if (holderUser) {
      throw new BadRequestError("Email already exists!");
    }

    // Hash password và tạo user
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      fullName,
      email,
      password: passwordHash,
      phoneNumber,
      address,
      role: RoleUser.CUSTOMER,
    });

    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("PublicKeyString error!");
      }

      // Tạo token pair
      const tokens = await createTokenPair(
        {
          userId: newUser._id,
          email,
          role: newUser.role,
        },
        publicKey,
        privateKey,
      );

      console.log(`Created Token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          user: getInfoData({
            fields: ["_id", "email", "fullName", "phoneNumber", "address"],
            object: newUser,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}
module.exports = AccessService;
