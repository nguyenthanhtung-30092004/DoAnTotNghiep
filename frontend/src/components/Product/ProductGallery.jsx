import { useState } from "react";

const ProductGallery = ({ images, name }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex md:flex-col gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all 
              ${activeIndex === i ? "border-black shadow-md" : "border-transparent hover:border-gray-300"}`}
          >
            <img
              src={img}
              alt={`${name} ${i}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      <div className="flex-1 relative">
        <div className="h-[500px] rounded-2xl bg-gray-100 overflow-hidden">
          <img
            src={images[activeIndex]}
            alt={name}
            className="w-full h-full object-cover p-6"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
