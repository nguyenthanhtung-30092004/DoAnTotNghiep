import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ProductDescription = ({ description }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold text-gray-900">Mô tả sản phẩm</h2>

      <div
        className={`relative overflow-hidden rounded-3xl border mt-4 bg-white transition-all duration-300 ${
          isDescriptionExpanded ? "max-h-none" : "max-h-[360px]"
        }`}
      >
        <div
          className="
            p-6 text-gray-700 leading-8
            [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:my-3
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4
            [&_li]:my-2
            [&_strong]:font-bold [&_strong]:text-gray-900
            [&_hr]:my-7 [&_hr]:border-gray-200
            [&_br]:hidden
          "
          dangerouslySetInnerHTML={{
            __html: description || "<p>Sản phẩm chưa có mô tả chi tiết.</p>",
          }}
        />

        {!isDescriptionExpanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      <div className="px-6 py-4 text-center">
        <button
          type="button"
          onClick={() => setIsDescriptionExpanded((current) => !current)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-green-600 px-6 text-sm font-semibold text-green-700 transition hover:bg-green-50"
        >
          {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isDescriptionExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ProductDescription;
