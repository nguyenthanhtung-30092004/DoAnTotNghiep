import { ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

const ProductGallery = ({
  activeImages,
  selectedImage,
  setSelectedImage,
  handlePrevImage,
  handleNextImage,
  productName,
}) => {
  return (
    <div className="lg:sticky lg:top-24 self-start flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
      
      {/* Thumbnails (Left on desktop, Bottom on mobile) */}
      {activeImages.length > 1 && (
        <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar w-full md:w-20 lg:w-24 shrink-0">
          {activeImages.slice(0, 10).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square w-20 md:w-full shrink-0 bg-zinc-50 transition-all ${
                selectedImage === image
                  ? "opacity-100 ring-1 ring-zinc-950"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`${productName}-${index}`}
                className="h-full w-full object-contain mix-blend-multiply p-2"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image (Right on desktop, Top on mobile) */}
      <div className="relative flex-1 bg-zinc-50 overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
        <img
          src={selectedImage || "/placeholder-product.png"}
          alt={productName}
          className="size-[85%] object-contain mix-blend-multiply drop-shadow-xl"
        />

        {activeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 flex h-10 w-10 lg:h-12 lg:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-zinc-950 shadow-sm transition-all hover:bg-zinc-950 hover:text-white"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 flex h-10 w-10 lg:h-12 lg:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-zinc-950 shadow-sm transition-all hover:bg-zinc-950 hover:text-white"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

    </div>
  );
};

export default ProductGallery;
