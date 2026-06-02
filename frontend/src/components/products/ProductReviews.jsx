import React from 'react';
import { Loader2, Send, Star } from "lucide-react";
import RatingStars from "./RatingStars";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
};

const ProductReviews = ({
  user,
  ratingAverage,
  ratingCount,
  reviews,
  reviewPagination,
  loadingReviews,
  submittingReview,
  reviewRating,
  setReviewRating,
  reviewContent,
  setReviewContent,
  handleCreateReview,
}) => {
  return (
    <div className="mt-20 lg:mt-32">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-950">
            Đánh giá
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-zinc-500">
            Đọc nhận xét thực tế từ khách hàng đã mua sản phẩm này.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-10 w-10 fill-yellow-400 text-yellow-400" />

              <span className="text-6xl font-black tracking-tighter text-zinc-950">
                {ratingAverage > 0 ? ratingAverage.toFixed(1) : "0.0"}
              </span>
            </div>

            <div>
              <RatingStars value={Math.round(ratingAverage)} />

              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                Từ {ratingCount} lượt mua
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleCreateReview}
          className="border border-zinc-200 bg-white p-6 sm:p-8 lg:w-2/3"
        >
          <h3 className="mb-6 text-sm font-black uppercase tracking-[0.1em] text-zinc-950">
            Viết đánh giá của bạn
          </h3>

          {!user && (
            <div className="mb-6 border border-zinc-950 bg-zinc-950 px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
              Vui lòng đăng nhập để gửi đánh giá.
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">
                Đánh giá sao
              </label>

              <RatingStars
                value={reviewRating}
                onChange={setReviewRating}
                size="h-6 w-6"
              />
            </div>

            <div>
              <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">
                Chia sẻ cảm nhận
              </label>

              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Chất liệu thế nào? Kích thước có vừa vặn không?"
                rows={4}
                maxLength={1000}
                className="w-full resize-none border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm outline-none transition-all focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview || !user}
              className="flex h-12 w-full items-center justify-center gap-3 bg-zinc-950 px-10 text-xs font-black uppercase tracking-[0.15em] text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {submittingReview ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-16 lg:mt-24">
        <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-zinc-950">
            Bình luận mới nhất
          </h3>

          {reviewPagination && (
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">
              {reviewPagination.totalReview || 0} bình luận
            </span>
          )}
        </div>

        {loadingReviews ? (
          <div className="flex items-center justify-center py-16 text-zinc-400">
            <Loader2 className="mr-3 h-6 w-6 animate-spin text-zinc-950" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Đang tải...
            </span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="border border-zinc-200 bg-white p-12 text-center">
            <p className="text-sm font-bold text-zinc-500">
              Sản phẩm chưa có đánh giá nào.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border border-zinc-200 bg-white p-6 sm:p-8"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-zinc-950">
                      {review.user?.name ||
                        review.user?.email ||
                        "Khách hàng"}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <RatingStars value={review.rating} />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-zinc-600">
                  {review.content ||
                    "Khách hàng không để lại nội dung."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
