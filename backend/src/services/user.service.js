"use strict";

const userModel = require("../models/user.model");

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    fullName: 1,
    phoneNumber: 1,
    address: 1,
    role: 1,
  },
}) => {
  return await userModel.findOne({ email }).select(select).lean();
};
module.exports = { findByEmail };
