import { Star, BadgeCheck, PenSquare } from "lucide-react";
import { Button } from "../ui/Button";

const ProductReviews = () => {
  return (
    <section className="py-16 opacity-100 transition-opacity duration-700">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>

          <Button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white">
            <PenSquare className="h-4 w-4" />
            Viết đánh giá
          </Button>
        </div>

        {/* Rating summary */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10 pb-10 border-b">
          <div className="text-center sm:text-left shrink-0">
            <p className="text-5xl font-black">4.5</p>

            <div className="flex items-center gap-0.5 mt-2 justify-center sm:justify-start text-green-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-gray-200" />
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-1">5 nhận xét</p>
          </div>

          {/* Rating bars */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-6 text-right">{star}</span>
                <Star className="h-3.5 w-3.5 fill-green-500 text-green-500" />

                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "40%" }}
                  />
                </div>

                <span className="text-xs text-gray-400 w-6 text-right">10</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                  NT
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">Nguyễn Thanh Tùng</p>

                    <span className="flex items-center gap-0.5 text-[12px] font-medium text-green-500">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Xác thực
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">2023-10-15</p>
                </div>
              </div>

              <div className="flex text-green-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-gray-200" />
                ))}
              </div>
            </div>

            <p className="font-semibold text-sm">Đánh giá sản phẩm</p>

            <p className="text-sm text-gray-600 leading-relaxed">
              Sản phẩm rất tốt, mình rất hài lòng với chất lượng và dịch vụ của
              cửa hàng. Sẽ tiếp tục ủng hộ shop trong tương lai!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
