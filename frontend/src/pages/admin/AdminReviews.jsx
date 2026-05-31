import {
  Check,
  Loader2,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import reviewService from "../../services/review.service";
import socket from "../../socket/socket";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
};

const RatingStars = ({ value = 0 }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-3.5 ${
            star <= value
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const params = {
        page: 1,
        limit: 50,
      };

      if (statusFilter === "approved") {
        params.isApproved = true;
      }

      if (statusFilter === "pending") {
        params.isApproved = false;
      }

      if (ratingFilter) {
        params.rating = ratingFilter;
      }

      const res = await reviewService.adminGetReviews(params);
      const data = getResponseData(res);

      setReviews(data.reviews || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lấy danh sách đánh giá thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId, isApproved) => {
    try {
      await reviewService.adminApproveReview(reviewId, isApproved);

      toast.success(isApproved ? "Đã duyệt đánh giá" : "Đã từ chối đánh giá");

      fetchReviews();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Cập nhật đánh giá thất bại");
    }
  };

  const handleDelete = async (reviewId) => {
    const ok = window.confirm("Bạn có chắc muốn xóa đánh giá này?");

    if (!ok) return;

    try {
      await reviewService.adminDeleteReview(reviewId);

      toast.success("Xóa đánh giá thành công");

      fetchReviews();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Xóa đánh giá thất bại");
    }
  };

  const filteredReviews = useMemo(() => {
    let data = [...reviews];

    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();

      data = data.filter((review) => {
        const content = review.content?.toLowerCase() || "";
        const userName = review.user?.name?.toLowerCase() || "";
        const userEmail = review.user?.email?.toLowerCase() || "";
        const productName = review.product?.name?.toLowerCase() || "";
        const orderCode = review.order?.orderCode?.toLowerCase() || "";

        return (
          content.includes(q) ||
          userName.includes(q) ||
          userEmail.includes(q) ||
          productName.includes(q) ||
          orderCode.includes(q)
        );
      });
    }

    if (sort === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (sort === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sort === "highest") {
      data.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    if (sort === "lowest") {
      data.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
    }

    return data;
  }, [reviews, keyword, sort]);

  const totalReview = pagination?.totalReview || reviews.length;
  const approvedCount = reviews.filter((item) => item.isApproved).length;
  const pendingCount = reviews.filter((item) => !item.isApproved).length;

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, ratingFilter]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-admin-room");

    const handleNewReview = (data) => {
      const newReview = data.review;

      if (!newReview) return;

      setReviews((prev) => {
        const exists = prev.some((item) => item._id === newReview._id);

        if (exists) return prev;

        return [newReview, ...prev];
      });

      toast.info(data.message || "Có đánh giá mới đang chờ duyệt");
    };

    socket.on("review:new", handleNewReview);

    return () => {
      socket.off("review:new", handleNewReview);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đánh giá</h1>

          <p className="text-sm text-slate-500 mt-1">
            {totalReview} đánh giá tổng cộng
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`inline-flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm font-semibold border transition-colors ${
            statusFilter === "all"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
          }`}
        >
          Tất cả
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              statusFilter === "all"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {totalReview}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("pending")}
          className={`inline-flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm font-semibold border transition-colors ${
            statusFilter === "pending"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
          }`}
        >
          Chờ duyệt
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              statusFilter === "pending"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter("approved")}
          className={`inline-flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm font-semibold border transition-colors ${
            statusFilter === "approved"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
          }`}
        >
          Đã duyệt
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              statusFilter === "approved"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {approvedCount}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Tìm theo nội dung, khách hàng, sản phẩm, mã đơn..."
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highest">Sao cao nhất</option>
            <option value="lowest">Sao thấp nhất</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider inline-flex items-center gap-1">
            <SlidersHorizontal className="size-3.5" />
            Sao:
          </span>

          <button
            onClick={() => setRatingFilter("")}
            className={`inline-flex items-center gap-1 h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
              ratingFilter === ""
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"
            }`}
          >
            Tất cả
          </button>

          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setRatingFilter(String(star))}
              className={`inline-flex items-center gap-1 h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
                ratingFilter === String(star)
                  ? "bg-amber-500 border-amber-500 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"
              }`}
            >
              {star}
              <Star
                className={`size-3 ${
                  ratingFilter === String(star)
                    ? "fill-white text-white"
                    : "text-slate-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-600">
          Hiển thị
          <span className="font-bold text-slate-900">
            {" "}
            {filteredReviews.length}
          </span>
          / {totalReview} đánh giá
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 flex items-center justify-center text-slate-500">
          <Loader2 className="size-6 animate-spin mr-2" />
          Đang tải đánh giá...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
          Không có đánh giá nào.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => {
            const productName =
              review.product?.name || "Sản phẩm không xác định";

            const customerName =
              review.user?.name || review.user?.email || "Khách hàng";

            return (
              <div
                key={review._id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="font-semibold text-slate-900">
                        {customerName}
                      </p>

                      <span className="text-slate-300">•</span>

                      <p className="text-sm text-slate-600 line-clamp-1">
                        {productName}
                      </p>

                      {review.isApproved ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-700">
                          Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-amber-100 text-amber-700">
                          Chờ duyệt
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <RatingStars value={review.rating} />

                      <span className="text-xs text-slate-500 ml-2">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 leading-6">
                      {review.content || "Không có nội dung đánh giá."}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                      {review.order?.orderCode && (
                        <span>Đơn hàng: {review.order.orderCode}</span>
                      )}

                      {review.order?.orderStatus && (
                        <span>Trạng thái đơn: {review.order.orderStatus}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review._id, true)}
                        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        title="Duyệt"
                      >
                        <Check className="size-4" />
                      </button>
                    )}

                    {review.isApproved && (
                      <button
                        onClick={() => handleApprove(review._id, false)}
                        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                        title="Từ chối"
                      >
                        <X className="size-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(review._id)}
                      className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      title="Xóa"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;