const crypto = require("crypto");
const qs = require("qs");
const moment = require("moment");

const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();

  keys.forEach((key) => {
    sorted[encodeURIComponent(key)] = encodeURIComponent(obj[key]).replace(
      /%20/g,
      "+",
    );
  });

  return sorted;
};

const getClientIp = (ipAddr) => {
  if (!ipAddr) return "127.0.0.1";

  const ip = Array.isArray(ipAddr)
    ? ipAddr[0]
    : String(ipAddr).split(",")[0].trim();

  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    return "127.0.0.1";
  }

  return ip;
};

class VnpayPayment {
  createPaymentUrl({ order, ipAddr = "127.0.0.1" }) {
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const hashSecret = process.env.VNPAY_HASH_SECRET;
    const vnpUrl = process.env.VNPAY_PAYMENT_URL;
    const publicBackendUrl = process.env.PUBLIC_BACKEND_URL;

    if (!tmnCode || !hashSecret || !vnpUrl || !publicBackendUrl) {
      throw new Error("Thiếu cấu hình VNPAY trong biến môi trường");
    }

    const createDate = moment().format("YYYYMMDDHHmmss");
    const expireDate = moment().add(15, "minutes").format("YYYYMMDDHHmmss");

    const returnUrl = `${publicBackendUrl}/v1/api/payments/vnpay-return`;

    let vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode.trim(),
      vnp_Amount: Math.round(Number(order.finalPrice)) * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: String(order.orderCode),
      vnp_OrderInfo: `Thanh toan don hang ${order.orderCode}`,
      vnp_OrderType: "other",
      vnp_Locale: "vn",
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: getClientIp(ipAddr),
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    vnpParams = sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, {
      encode: false,
    });

    const secureHash = crypto
      .createHmac("sha512", hashSecret.trim())
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    vnpParams.vnp_SecureHash = secureHash;

    const paymentUrl = `${vnpUrl}?${qs.stringify(vnpParams, {
      encode: false,
    })}`;

    console.log("========== VNPAY CREATE PAYMENT URL ==========");
    console.log("VNPAY_SIGN_DATA:", signData);
    console.log("VNPAY_SECURE_HASH:", secureHash);
    console.log("VNPAY_PAYMENT_URL:", paymentUrl);
    console.log("==============================================");

    return paymentUrl;
  }

  verifyReturnUrl(query) {
    const hashSecret = process.env.VNPAY_HASH_SECRET;

    let vnpParams = { ...query };
    const secureHash = vnpParams.vnp_SecureHash;

    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    vnpParams = sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, {
      encode: false,
    });

    const checkHash = crypto
      .createHmac("sha512", hashSecret.trim())
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    return secureHash === checkHash;
  }
}

module.exports = new VnpayPayment();
