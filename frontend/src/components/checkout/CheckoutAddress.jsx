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
    <form className="space-y-6 border border-zinc-200 p-8 bg-white">
      <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950">Thông tin giao hàng</h2>

      <div>
        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Họ và tên</label>
        <input
          type="text"
          name="fullName"
          value={shippingAddress.fullName}
          onChange={handleChangeShipping}
          placeholder="Nhập họ và tên"
          className={`h-12 w-full border bg-zinc-50 px-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-1 ${
            addressErrors.fullName
              ? "border-red-500 focus:ring-red-500"
              : "border-zinc-200 focus:ring-teal-600 focus:border-teal-600"
          }`}
        />
        {addressErrors.fullName && (
          <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.fullName}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Email</label>
        <input
          type="email"
          name="email"
          value={shippingAddress.email}
          onChange={handleChangeShipping}
          placeholder="Ví dụ: email@gmail.com"
          className={`h-12 w-full border bg-zinc-50 px-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-1 ${
            addressErrors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-zinc-200 focus:ring-teal-600 focus:border-teal-600"
          }`}
        />
        {addressErrors.email && (
          <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.email}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Số điện thoại</label>
        <input
          type="tel"
          name="phone"
          value={shippingAddress.phone}
          onChange={handleChangeShipping}
          placeholder="Nhập số điện thoại"
          className={`h-12 w-full border bg-zinc-50 px-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-1 ${
            addressErrors.phone
              ? "border-red-500 focus:ring-red-500"
              : "border-zinc-200 focus:ring-teal-600 focus:border-teal-600"
          }`}
        />
        {addressErrors.phone && (
          <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.phone}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Tỉnh/Thành phố</label>
          <select
            value={provinces.find((item) => item.name === shippingAddress.province)?.code || ""}
            onChange={selectProvince}
            className={`h-12 w-full border bg-zinc-50 px-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-1 ${
              addressErrors.province
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-200 focus:ring-teal-600 focus:border-teal-600"
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
          <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Quận/Huyện</label>
          <select
            value={districts.find((item) => item.name === shippingAddress.district)?.code || ""}
            onChange={selectDistrict}
            disabled={!shippingAddress.province || addressLoading}
            className={`h-12 w-full border bg-zinc-50 px-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-1 disabled:opacity-60 ${
              addressErrors.district
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-200 focus:ring-teal-600 focus:border-teal-600"
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
          <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Phường/Xã</label>
          <select
            value={wards.find((item) => item.name === shippingAddress.ward)?.code || ""}
            onChange={selectWard}
            disabled={!shippingAddress.district || addressLoading}
            className={`h-12 w-full border bg-zinc-50 px-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-1 disabled:opacity-60 ${
              addressErrors.ward
                ? "border-red-500 focus:ring-red-500"
                : "border-zinc-200 focus:ring-teal-600 focus:border-teal-600"
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
        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Địa chỉ chi tiết</label>
        <input
          type="text"
          name="detailAddress"
          value={shippingAddress.detailAddress}
          onChange={handleChangeShipping}
          placeholder="Số nhà, tên đường..."
          className={`h-12 w-full border bg-zinc-50 px-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-1 ${
            addressErrors.detailAddress
              ? "border-red-500 focus:ring-red-500"
              : "border-zinc-200 focus:ring-teal-600 focus:border-teal-600"
          }`}
        />
        {addressErrors.detailAddress && (
          <p className="mt-1 text-xs font-medium text-red-500">{addressErrors.detailAddress}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleNextToPayment}
        className="inline-flex h-14 w-full items-center justify-center gap-2 bg-zinc-950 text-white font-black uppercase tracking-[0.1em] text-xs hover:bg-teal-600 transition-colors mt-4"
      >
        Tiếp tục thanh toán
      </button>
    </form>
  );
};

export default CheckoutAddress;
