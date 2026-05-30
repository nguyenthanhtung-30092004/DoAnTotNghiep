import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ProductDescription = ({ description }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold text-foreground tracking-tight">Mô tả sản phẩm</h2>

      <div
        className={`relative overflow-hidden rounded-2xl border border-border mt-6 bg-card shadow-sm transition-all duration-300 ${
          isDescriptionExpanded ? "max-h-none" : "max-h-[360px]"
        }`}
      >
        <div
          className="
            p-6 lg:p-8 text-muted-foreground leading-relaxed
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:my-3
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4
            [&_li]:my-2
            [&_strong]:font-bold [&_strong]:text-foreground
            [&_hr]:my-8 [&_hr]:border-border
            [&_br]:hidden
          "
          dangerouslySetInnerHTML={{
            __html: description || "<p>Sản phẩm chưa có mô tả chi tiết.</p>",
          }}
        />

        {!isDescriptionExpanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
        )}
      </div>

      <div className="px-6 py-4 text-center mt-2">
        <button
          type="button"
          onClick={() => setIsDescriptionExpanded((current) => !current)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-primary px-8 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
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
