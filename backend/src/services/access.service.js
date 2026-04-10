"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToten.service");
const { createTokenPair } = require("../auth/authUtils");
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
        // create PrivateToken, PublicToken
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });
        // Public Key CryptoGraphy Standards!
        console.log({ privateKey, publicKey }); // Save collection KeyUser

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "PublicKeyString error!",
          };
        }
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // Created token pair
        const tokens = await createTokenPair(
          {
            userId: newUser._id,
            email,
            role: newUser.role,
          },
          publicKeyString,
          privateKey,
        );
        console.log(`Created Token Success::`, tokens);
        return {
          code: 201,
          metadata: {
            user: {
              _id: newUser._id,
              email: newUser.email,
              fullName: newUser.fullName,
              phoneNumber: newUser.phoneNumber,
              address: newUser.address,
            },
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
