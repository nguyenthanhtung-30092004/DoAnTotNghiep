import { useState, useMemo } from "react";
import { Star, BadgeCheck, PenSquare } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { Button } from "../ui/Button";
import ReviewForm from "./ReviewForm";

const ProductReviews = ({
  reviews: initialReviews,
  rating: initialRating,
  reviewCount,
  productName = "sản phẩm này",
}) => {
  const ref = useScrollReveal();
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Tính toán lại rating trung bình
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return initialRating;
    const baseTotal = initialRating * reviewCount;
    const addedReviews = reviews.length - initialReviews.length;
    const newTotal =
      baseTotal + addedReviews * (reviews[0]?.rating || initialRating);
    const totalReviewers = reviewCount + addedReviews;
    return totalReviewers > 0
      ? (newTotal / totalReviewers).toFixed(1)
      : initialRating;
  }, [reviews, initialRating, reviewCount, initialReviews.length]);

  const totalCount = reviewCount + (reviews.length - initialReviews.length);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
  }));

  const handleSubmit = (data) => {
    const newReview = {
      id: Date.now(),
      name: "Bạn",
      initials: "YO",
      rating: data.rating,
      date: "Vừa xong",
      title: data.title,
      text: data.text,
      verified: true,
    };
    setReviews((prev) => [newReview, ...prev]);
    setHasReviewed(true);
    setShowForm(false);
  };

  return (
    <section
      ref={ref}
      className="py-16 opacity-0 transition-opacity duration-700"
    >
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${hasReviewed ? "border-gray-300 text-gray-500" : "bg-green-500 text-white"}`}
            >
              <PenSquare className="h-4 w-4" />
              {hasReviewed ? "Đã đánh giá" : "Viết đánh giá"}
            </Button>
          )}
        </div>

        {/* Tóm tắt rating */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10 pb-10 border-b">
          <div className="text-center sm:text-left shrink-0">
            <p className="text-5xl font-black">{avgRating}</p>
            <div className="flex items-center gap-0.5 mt-2 justify-center sm:justify-start text-green-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(avgRating) ? "fill-current" : "text-gray-200"}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">{totalCount} nhận xét</p>
          </div>

          <div className="flex-1 space-y-2">
            {distribution.map(({ star, count }) => {
              const pct =
                reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm w-3 text-right">{star}</span>
                  <Star className="h-3.5 w-3.5 fill-green-500 text-green-500" />
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-6 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {showForm && (
          <div className="mb-8">
            <ReviewForm
              productName={productName}
              hasReviewed={hasReviewed}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Danh sách các review */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border p-6 space-y-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                    {review.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{review.name}</p>
                      {review.verified && (
                        <span className="flex items-center gap-0.5 text-[12px] font-medium text-green-500">
                          <BadgeCheck className="h-3.5 w-3.5" /> Xác thực
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex text-green-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current" : "text-gray-200"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="font-semibold text-sm">{review.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
