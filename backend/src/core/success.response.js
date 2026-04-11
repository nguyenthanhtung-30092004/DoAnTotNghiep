"use strict";

const { StatusCodes, ReasonPhrases } = require("http-status-codes");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK, // Mặc định là 200
    reasonStatusCode = ReasonPhrases.OK, // Mặc định là "OK"
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED, // Lấy số 201
    reasonStatusCode = ReasonPhrases.CREATED, // Lấy chữ "Created"
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
