"use strict";
const keyTokenModel = require("../models/keyToken.model");
const keytokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId };

      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: id });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteMany({ user: userId });
  };
}
module.exports = KeyTokenService;
