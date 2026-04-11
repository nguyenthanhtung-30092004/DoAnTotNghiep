"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToten.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleUser = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({
    fullName,
    email,
    password,
    phoneNumber,
    address,
  }) => {
    try {
      // Check email exists?
      const holderUser = await userModel.findOne({ email }).lean();
      if (holderUser) {
        return {
          code: "xxxx",
          message: "User already registerd!",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        fullName,
        email,
        password: passwordHash,
        phoneNumber,
        address,
        roles: RoleUser.CUSTOMER,
      });

      if (newUser) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        // Public Key CryptoGraphy Standards!
        console.log({ privateKey, publicKey }); // Save collection KeyUser
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
          privateKey,
        });
        if (!keyStore) {
          return {
            code: "xxxx",
            message: "PublicKeyString error!",
          };
        }
        // Created token pair
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
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}
module.exports = AccessService;
