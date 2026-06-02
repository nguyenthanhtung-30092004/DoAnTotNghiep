import React from 'react';
import { ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";

const ProductGallery = ({
  product,
  activeImages,
  selectedImage,
  setSelectedImage,
  selectedImageIndex,
  isDraggingImage,
  dragDistance,
  handleImagePointerDown,
  handleImagePointerMove,
  handleImagePointerUp,
  handleImagePointerCancel,
  handleImagePointerLeave,
  handleArrowPrevClick,
  handleArrowNextClick,
}) => {
  return (
    <div className="flex flex-col-reverse gap-4 lg:grid lg:grid-cols-[76px_1fr] lg:gap-5">
      <div className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[680px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1">
        {activeImages.map((image, index) => {
          const isActive = selectedImage === image;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              className={`flex h-16 w-16 shrink-0 items-center justify-center border bg-white p-2 transition-all lg:h-[68px] lg:w-[68px] ${
                isActive
                  ? "border-zinc-950"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <img
                src={image}
                alt={`${product?.name} ${index + 1}`}
                className="h-full w-full object-contain mix-blend-multiply"
                draggable={false}
              />
            </button>
          );
        })}
      </div>

      <div
        role="button"
        tabIndex={0}
        onPointerDown={handleImagePointerDown}
        onPointerMove={handleImagePointerMove}
        onPointerUp={handleImagePointerUp}
        onPointerCancel={handleImagePointerCancel}
        onPointerLeave={handleImagePointerLeave}
        style={{
          touchAction: "pan-y",
        }}
        className={`relative flex h-[360px] select-none items-center justify-center overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-50/70 p-6 sm:h-[480px] sm:p-10 lg:h-[620px] lg:rounded-[34px] lg:p-14 ${
          activeImages.length > 1
            ? isDraggingImage
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
        }`}
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={product?.name}
            draggable={false}
            style={{
              transform: `translateX(${dragDistance * 0.35}px) scale(${
                isDraggingImage ? 0.98 : 1
              })`,
            }}
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-bold uppercase tracking-widest text-zinc-400">
            Không có ảnh
          </div>
        )}

        {activeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handleArrowPrevClick}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center text-zinc-400 transition-all hover:-translate-x-1 hover:text-zinc-950 sm:left-5"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-9 w-9 stroke-[1.4] sm:h-11 sm:w-11" />
            </button>

            <button
              type="button"
              onClick={handleArrowNextClick}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center text-zinc-400 transition-all hover:translate-x-1 hover:text-zinc-950 sm:right-5"
              aria-label="Ảnh sau"
            >
              <ChevronRightIcon className="h-9 w-9 stroke-[1.4] sm:h-11 sm:w-11" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {activeImages.map((image, index) => (
                <button
                  key={`dot-${image}-${index}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(image);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`h-1.5 rounded-full transition-all ${
                    selectedImageIndex === index
                      ? "w-6 bg-zinc-950"
                      : "w-1.5 bg-zinc-300 hover:bg-zinc-500"
                  }`}
                  aria-label={`Chọn ảnh ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
