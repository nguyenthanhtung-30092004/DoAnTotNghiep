import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";

const ProductInfo = ({
  product,
  selectedSize,
  onSizeChange,
  quantity,
  onQuantityChange,
}) => {
  // Tính % giảm giá để hiển thị UI
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Brand + Name */}
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-green-500 mb-1">
          {product.brand}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900">
          {product.name}
        </h1>
      </div>

      {/* Rating UI */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? "fill-green-500 text-green-500"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold">{product.rating}</span>
        <span className="text-sm text-gray-500">
          ({product.reviewCount} nhận xét)
        </span>
      </div>

      {/* Price Section */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-gray-900">
          ${product.price}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-gray-400 line-through">
              ${product.originalPrice}
            </span>
            <span className="text-sm font-bold text-green-600 bg-accent px-2 py-0.5 rounded-full">
              −{discount}%
            </span>
          </>
        )}
      </div>

      {/* Size Selection UI */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Chọn Size</h3>
          <button className="text-sm text-green-500 hover:underline underline-offset-4">
            Bảng quy đổi size
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`h-11 rounded-xl border text-sm font-medium transition-all duration-200 
                ${
                  selectedSize === size
                    ? "border-green-500 bg-green-500 text-white shadow-md scale-95"
                    : "border-gray-200 hover:border-gray-400 text-gray-900"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity UI */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-900">Số lượng</h3>
        <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="h-11 w-11 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-bold tabular-nums">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
            className="h-11 w-11 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Buttons Action UI */}
      <div className="flex gap-3 pt-2">
        <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl hover:bg-green-600 transition-all font-bold shadow-lg active:scale-95">
          <ShoppingCart className="h-5 w-5" />
          Thêm vào giỏ hàng
        </button>
        <button className="px-5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Trust Badges UI */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        {[
          { icon: Truck, label: "Miễn phí ship", sub: "Đơn từ $75" },
          { icon: RotateCcw, label: "Đổi trả 30 ngày", sub: "Dễ dàng" },
          { icon: Shield, label: "Bảo hành 1 năm", sub: "Chính hãng" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="text-center">
            <Icon className="size-7 text-green-500 mx-auto mb-1" />
            <p className="text-[11px] font-bold text-gray-900">{label}</p>
            <p className="text-[9px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfo;
