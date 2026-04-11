"use strict";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { findByUserId } = require("../services/keyToten.service");
const { NotFoundError } = require("../core/error.response");

const HEADER = {
  API_KEY: "x_api_key",
  CLIENT_ID: "x_client_id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // AccessToken
    const accessToken = await JWT.sign(payload, publicKey, {
        expiresIn: "2 days",
      }),
      refreshToken = await JWT.sign(payload, privateKey, {
        expiresIn: "7 days",
      });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`Error verify::`, err);
      } else {
        console.log(`Decode::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /*  
    1 - Check userId missing
    2 - get accessToken
    3 - verify accessToken
    4 - check user in dbs
    5 - check keyStore with userId
    6 - Ok all => return next() 
  */
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request!");
  }

  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found keyStore!");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request!");
  }
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid User!");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
module.exports = { createTokenPair, authentication };
