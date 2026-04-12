"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToten.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./user.service");
const RoleUser = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshToken = async (refreshToken) => {
    // 1. Check token đã dùng chưa
    const foundTokenUsed =
      await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundTokenUsed) {
      await KeyTokenService.deleteKeyByUserId(foundTokenUsed.user);
      throw new ForbiddenError("Something wrong happened! Please relogin.");
    }

    // 2. Check token hiện hành
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("User not registered!");

    // 3. Verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey,
    );

    // 4. Check User
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new AuthFailureError("User not registered!");

    // 5. Tạo cặp mới
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey,
    );

    // 6. Update DB
    await holderToken.updateOne({
      $set: { refreshToken: tokens.refreshToken },
      $addToSet: { refreshTokensUsed: refreshToken },
    });

    return { user: { userId, email }, tokens };
  };

  static login = async ({ email, password }) => {
    const foundUser = await findByEmail({ email });
    if (!foundUser) throw new BadRequestError("User not registered!");

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) throw new AuthFailureError("Authentication error!");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundUser._id, email, role: foundUser.role },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      user: getInfoData({
        fields: ["_id", "email", "fullName"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
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
      await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      console.log(`Created Token Success::`, tokens);

      return {
        user: getInfoData({
          fields: ["_id", "email", "fullName", "phoneNumber", "address"],
          object: newUser,
        }),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}
module.exports = AccessService;
