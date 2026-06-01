const { OK } = require("../../core/success.response");
const couponService = require("../../services/coupon.service");

class CouponController {
  createCoupon = async (req, res) => {
    new OK({
      message: "Tạo mã giảm giá thành công",
      metadata: await couponService.createCoupon(req.body),
    }).send(res);
  };

  getCoupons = async (req, res) => {
    new OK({
      message: "Lấy danh sách mã giảm giá thành công",
      metadata: await couponService.getCoupons(req.query),
    }).send(res);
  };

  getCouponDetail = async (req, res) => {
    new OK({
      message: "Lấy chi tiết mã giảm giá thành công",
      metadata: await couponService.getCouponDetail(req.params.id),
    }).send(res);
  };

  updateCoupon = async (req, res) => {
    new OK({
      message: "Cập nhật mã giảm giá thành công",
      metadata: await couponService.updateCoupon({
        id: req.params.id,
        body: req.body,
      }),
    }).send(res);
  };

  deleteCoupon = async (req, res) => {
    new OK({
      message: "Xóa mã giảm giá thành công",
      metadata: await couponService.deleteCoupon(req.params.id),
    }).send(res);
  };

  validateCouponForCart = async (req, res) => {
    new OK({
      message: "Áp mã giảm giá thành công",
      metadata: await couponService.validateCouponForCart({
        userId: req.user ? req.user._id : null,
        code: req.body.code,
        items: req.body.items,
      }),
    }).send(res);
  };
}

module.exports = new CouponController();

