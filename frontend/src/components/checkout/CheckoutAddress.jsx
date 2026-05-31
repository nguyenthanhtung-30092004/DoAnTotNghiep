import React from "react";

const CheckoutAddress = ({
  shippingAddress,
  addressErrors,
  handleChangeShipping,
  provinces,
  districts,
  wards,
  selectProvince,
  selectDistrict,
  selectWard,
  addressLoading,
  handleNextToPayment,
}) => {
  return (
    <form className="space-y-5 rounded-2xl bg-card p-6 shadow-card">
      <h2 className="text-lg font-bold">Thông tin giao hàng</h2>

      <div>
        <label className="mb-1.5 block text-xs font-semibold">Họ và tên</label>
        <input
          type="text"
          name="fullName"
          value={shippingAddress.fullName}
          onChange={handleChangeShipping}
          placeholder="Nhập họ và tên"
          className={`h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-all duration-200 focus:ring-2 ${
            addressErrors.fullName
              ? "border-red-500 focus:ring-red-100"
              : "border-border focus:ring-primary"
          }`}
        />
        {addressErrors.fullName && (
          <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.fullName}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold">Email</label>
        <input
          type="email"
          name="email"
          value={shippingAddress.email}
          onChange={handleChangeShipping}
          placeholder="Ví dụ: email@gmail.com"
          className={`h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-all duration-200 focus:ring-2 ${
            addressErrors.email
              ? "border-red-500 focus:ring-red-100"
              : "border-border focus:ring-primary"
          }`}
        />
        {addressErrors.email && (
          <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold">Số điện thoại</label>
        <input
          type="tel"
          name="phone"
          value={shippingAddress.phone}
          onChange={handleChangeShipping}
          placeholder="Nhập số điện thoại"
          className={`h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-all duration-200 focus:ring-2 ${
            addressErrors.phone
              ? "border-red-500 focus:ring-red-100"
              : "border-border focus:ring-primary"
          }`}
        />
        {addressErrors.phone && (
          <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.phone}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold">Tỉnh/Thành phố</label>
          <select
            value={provinces.find((item) => item.name === shippingAddress.province)?.code || ""}
            onChange={selectProvince}
            className={`h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-all duration-200 focus:ring-2 ${
              addressErrors.province
                ? "border-red-500 focus:ring-red-100"
                : "border-border focus:ring-primary"
            }`}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
          {addressErrors.province && (
            <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.province}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold">Quận/Huyện</label>
          <select
            value={districts.find((item) => item.name === shippingAddress.district)?.code || ""}
            onChange={selectDistrict}
            disabled={!shippingAddress.province || addressLoading}
            className={`h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-all duration-200 focus:ring-2 disabled:opacity-60 ${
              addressErrors.district
                ? "border-red-500 focus:ring-red-100"
                : "border-border focus:ring-primary"
            }`}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
          {addressErrors.district && (
            <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.district}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold">Phường/Xã</label>
          <select
            value={wards.find((item) => item.name === shippingAddress.ward)?.code || ""}
            onChange={selectWard}
            disabled={!shippingAddress.district || addressLoading}
            className={`h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-all duration-200 focus:ring-2 disabled:opacity-60 ${
              addressErrors.ward
                ? "border-red-500 focus:ring-red-100"
                : "border-border focus:ring-primary"
            }`}
          >
            <option value="">Chọn phường/xã</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
          {addressErrors.ward && (
            <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.ward}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold">Địa chỉ chi tiết</label>
        <input
          type="text"
          name="detailAddress"
          value={shippingAddress.detailAddress}
          onChange={handleChangeShipping}
          placeholder="Số nhà, tên đường..."
          className={`h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-all duration-200 focus:ring-2 ${
            addressErrors.detailAddress
              ? "border-red-500 focus:ring-red-100"
              : "border-border focus:ring-primary"
          }`}
        />
        {addressErrors.detailAddress && (
          <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.detailAddress}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleNextToPayment}
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:bg-secondary hover:shadow-xl"
      >
        Tiếp tục thanh toán
      </button>
    </form>
  );
};

export default CheckoutAddress;
