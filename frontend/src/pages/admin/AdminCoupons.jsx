import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import couponService from "../../services/coupon.service";

import CouponStats from "../../components/admin/coupons/CouponStats";
import CouponFilters from "../../components/admin/coupons/CouponFilters";
import CouponTable from "../../components/admin/coupons/CouponTable";
import CouponPagination from "../../components/admin/coupons/CouponPagination";
import AddCouponForm from "../../components/admin/coupons/AddCouponForm";
import DeleteForm from "../../components/admin/coupons/DeleteCouponForm";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openCouponForm, setOpenCouponForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    totalCoupon: 0,
    limit: 8,
  });

  const [filters, setFilters] = useState({
    search: "",
    isActive: "",
    applyTo: "",
    discountType: "",
    page: 1,
    limit: 8,
  });

  const getResponseData = (res) => {
    return res.data?.metadata || res.data?.data || res.data;
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const params = {
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.isActive !== "") params.isActive = filters.isActive;
      if (filters.applyTo) params.applyTo = filters.applyTo;
      if (filters.discountType) params.discountType = filters.discountType;

      const res = await couponService.getCoupons(params);
      const data = getResponseData(res);

      setCoupons(data.coupons || []);

      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPage: 1,
          totalCoupon: 0,
          limit: filters.limit,
        },
      );
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lấy danh sách mã giảm giá thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeLimit = (limit) => {
    setFilters((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  const handleChangeFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleResetFilter = () => {
    setFilters({
      search: "",
      isActive: "",
      applyTo: "",
      discountType: "",
      page: 1,
      limit: 8,
    });
  };

  const handleOpenAdd = () => {
    setSelectedCoupon(null);
    setOpenCouponForm(true);
  };

  const handleOpenUpdate = (coupon) => {
    setSelectedCoupon(coupon);
    setOpenCouponForm(true);
  };

  const handleOpenDelete = (coupon) => {
    setSelectedCoupon(coupon);
    setOpenDeleteForm(true);
  };

  const handleCloseCouponForm = () => {
    setSelectedCoupon(null);
    setOpenCouponForm(false);
  };

  const handleCloseDeleteForm = () => {
    setSelectedCoupon(null);
    setOpenDeleteForm(false);
  };

  const handleDeleteCoupon = async () => {
    await couponService.deleteCoupon(selectedCoupon._id);
    toast.success("Xóa mã giảm giá thành công");
    await fetchCoupons();
  };

  const handleToggleActive = async (coupon) => {
    try {
      await couponService.updateCoupon(coupon._id, {
        isActive: !coupon.isActive,
      });

      toast.success("Cập nhật trạng thái thành công");
      fetchCoupons();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Đã copy mã giảm giá");
    } catch (error) {
      console.log(error);
      toast.error("Copy mã thất bại");
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage <= 1) return;

    setFilters((prev) => ({
      ...prev,
      page: prev.page - 1,
    }));
  };

  const handleNextPage = () => {
    if (pagination.currentPage >= pagination.totalPage) return;

    setFilters((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  useEffect(() => {
    fetchCoupons();
  }, [filters]);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý mã giảm giá
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý mã giảm giá, thời gian áp dụng, lượt dùng và trạng thái
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="size-4" />
          Thêm mã giảm giá
        </button>
      </div>

      <CouponStats
        totalCoupon={pagination.totalCoupon}
        showingCoupon={coupons.length}
        activeCoupon={coupons.filter((coupon) => coupon.isActive).length}
        expiredCoupon={
          coupons.filter(
            (coupon) => coupon.endAt && new Date(coupon.endAt) < new Date(),
          ).length
        }
      />

      <CouponFilters
        filters={filters}
        limit={filters.limit}
        onChangeFilter={handleChangeFilter}
        onChangeLimit={handleChangeLimit}
        onReset={handleResetFilter}
      />

      <CouponTable
        coupons={coupons}
        loading={loading}
        onEdit={handleOpenUpdate}
        onDelete={handleOpenDelete}
        onToggleActive={handleToggleActive}
        onCopy={handleCopyCode}
      />

      <CouponPagination
        pagination={pagination}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

      {openCouponForm && (
        <AddCouponForm
          coupon={selectedCoupon}
          onClose={handleCloseCouponForm}
          onSuccess={fetchCoupons}
        />
      )}

      {openDeleteForm && (
        <DeleteForm
          coupon={selectedCoupon}
          onClose={handleCloseDeleteForm}
          onConfirm={handleDeleteCoupon}
        />
      )}
    </div>
  );
};

export default AdminCoupons;
