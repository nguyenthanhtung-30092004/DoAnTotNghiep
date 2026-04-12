"use strict";
const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await AccessService.handlerRefreshToken(refreshToken);

    res.cookie("accessToken", result.tokens.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/v1/api/user/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    new SuccessResponse({
      message: "Refresh success!",
      metadata: result.user,
    }).send(res);
  };

  login = async (req, res, next) => {
    const result = await AccessService.login(req.body);

    res.cookie("accessToken", result.tokens.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/v1/api/user/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    new SuccessResponse({ metadata: result.user }).send(res);
  };

  logout = async (req, res, next) => {
    await AccessService.logout({ keyStore: req.keyStore });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/v1/api/user/refresh-token" });
    new SuccessResponse({ message: "Logout success!" }).send(res);
  };
  signUp = async (req, res, next) => {
    const result = await AccessService.signUp(req.body);
    console.log(result);
    res.cookie("accessToken", result.tokens.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/v1/api/user/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    new CREATED({
      message: "User created successfully!",
      metadata: result,
    }).send(res);
  };
}
module.exports = new AccessController();
