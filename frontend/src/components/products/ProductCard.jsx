import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "../../components/ui/Button";

const formatPrice = (price) => {
  if (price === undefined || price === null) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getBrandName = (brand) => {
  if (!brand) return "Không có thương hiệu";
  if (typeof brand === "string") return brand;
  return brand.nameBrand || brand.name || "Không có thương hiệu";
};

const getProductImage = (product) => {
  return (
    product?.thumbnail?.url ||
    product?.variants?.[0]?.images?.[0]?.url ||
    "/placeholder-product.png"
  );
};

const getProductPrice = (product) => {
  return product?.minPrice ?? product?.variants?.[0]?.sizes?.[0]?.price ?? 0;
};

const getOriginalPrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];
  if (!firstSize) return null;
  const price = Number(firstSize.price || 0);
  const salePrice = Number(firstSize.salePrice || 0);
  if (salePrice > 0 && salePrice < price) {
    return price;
  }
  return null;
};

const getSalePrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];
  if (!firstSize) return getProductPrice(product);
  const price = Number(firstSize.price || 0);
  const salePrice = Number(firstSize.salePrice || 0);
  if (salePrice > 0 && salePrice < price) {
    return salePrice;
  }
  return product?.minPrice ?? price;
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const image = getProductImage(product);
  const price = getSalePrice(product);
  const originalPrice = getOriginalPrice(product);
  const variants = Array.isArray(product.variants) ? product.variants : [];

  return (
    <Link
      to={`/product/${product.slug || product._id}`}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
    >
      {product.isPublished === false && (
        <span className="absolute top-3 left-3 z-10 bg-gray-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          Nháp
        </span>
      )}

      <div className="aspect-square bg-[#F8F9FA] overflow-hidden relative">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <Button
            type="button"
            size="sm"
            className="shadow-lg text-sm gap-1.5 bg-[#22C55E] hover:bg-[#1da850] text-white"
            onClick={(e) => {
              e.preventDefault();
              navigate("/product/" + (product.slug || product._id));
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1 bg-white">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-500">
          {getBrandName(product.brand)}
        </p>

        <h3 className="font-semibold text-[15px] leading-snug text-gray-900 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {variants.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5">
              {variants.slice(0, 5).map((variant, index) => (
                <span
                  key={variant._id || index}
                  title={variant.color}
                  className="h-4 w-4 rounded-full border border-gray-300 shadow-sm"
                  style={{
                    backgroundColor: variant.colorCode || "#d1d5db",
                  }}
                />
              ))}

              {variants.length > 5 && (
                <span className="text-xs font-medium text-gray-500">
                  +{variants.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 mt-auto pt-1">
          <Star className="h-3.5 w-3.5 fill-[#EAB308] text-[#EAB308]" />
          <span className="text-sm font-medium text-gray-700">
            {product.rating || 5}
          </span>
          <span className="text-sm text-gray-400">
            ({product.reviewCount || 0})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-red-500">{formatPrice(price)}</span>

          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
