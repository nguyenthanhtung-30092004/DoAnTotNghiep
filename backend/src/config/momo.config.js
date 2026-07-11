module.exports = {
  partnerCode: process.env.MOMO_PARTNER_CODE || "",
  accessKey: process.env.MOMO_ACCESS_KEY || "",
  secretKey: process.env.MOMO_SECRET_KEY || "",
  endpoint: process.env.MOMO_ENDPOINT || "",
  returnUrl: process.env.MOMO_RETURN_URL || "",
  notifyUrl: process.env.MOMO_NOTIFY_URL || "",
};
