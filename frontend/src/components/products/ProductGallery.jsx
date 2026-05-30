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
    <div className="lg:sticky lg:top-24 self-start">
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex items-center justify-center h-[450px]">
          <img
            src={selectedImage || "/placeholder-product.png"}
            alt={productName}
            className="size-[80%] object-contain"
          />
        </div>

        {activeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </>
        )}
      </div>

      {activeImages.length > 1 && (
        <div className="grid grid-cols-5 gap-3 mt-4">
          {activeImages.slice(0, 10).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`aspect-square rounded-xl border overflow-hidden bg-card transition-all ${
                selectedImage === image
                  ? "border-primary ring-2 ring-primary/20 shadow-sm"
                  : "border-border hover:border-primary/50 opacity-80 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`${productName}-${index}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
