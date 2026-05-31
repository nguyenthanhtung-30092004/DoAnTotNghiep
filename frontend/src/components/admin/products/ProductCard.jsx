import { Edit, Package, Tag, Trash2 } from "lucide-react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    if (!price && price !== 0) return "Chưa có giá";
    return Number(price).toLocaleString("vi-VN") + " ₫";
  };

  const getProductPrice = () => {
    if (product.minPrice !== undefined) {
      return product.minPrice;
    }

    const prices = [];

    product.variants?.forEach((variant) => {
      variant.sizes?.forEach((size) => {
        const finalPrice = size.salePrice > 0 ? size.salePrice : size.price;
        prices.push(finalPrice);
      });
    });

    if (prices.length === 0) return null;

    return Math.min(...prices);
  };

  const getProductStock = () => {
    if (product.totalStock !== undefined) {
      return product.totalStock;
    }

    let total = 0;

    product.variants?.forEach((variant) => {
      variant.sizes?.forEach((size) => {
        total += Number(size.stock || 0);
      });
    });

    return total;
  };

  const getTotalSold = () => {
    if (product.totalSold !== undefined) {
      return product.totalSold;
    }

    let total = 0;

    product.variants?.forEach((variant) => {
      variant.sizes?.forEach((size) => {
        total += Number(size.sold || 0);
      });
    });

    return total;
  };

  const price = getProductPrice();
  const stock = getProductStock();
  const sold = getTotalSold();

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-44 bg-slate-100">
        <img
          src={
            product.thumbnail?.url ||
            "https://placehold.co/500x400?text=No+Image"
          }
          alt={product.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-3 top-3">
          {product.isPublished ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              Đang bán
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              Nháp
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(product)}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            title="Sửa sản phẩm"
          >
            <Edit className="size-4" />
          </button>

          <button
            onClick={() => onDelete(product)}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Xóa sản phẩm"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500 flex items-center gap-1">
              <Tag className="size-4" />
              Thương hiệu
            </span>
            <span className="font-medium text-slate-800 truncate">
              {product.brand?.nameBrand || product.brand?.name || "Chưa có"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-500 flex items-center gap-1">
              <Package className="size-4" />
              Danh mục
            </span>
            <span className="font-medium text-slate-800 truncate">
              {product.category?.name || "Chưa có"}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">Giá thấp nhất</p>
          <p className="text-lg font-bold text-indigo-600 mt-1">
            {formatPrice(price)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Biến thể</p>
            <p className="font-bold text-slate-900 mt-1">
              {product.variants?.length || 0}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Tồn kho</p>
            <p className="font-bold text-slate-900 mt-1">{stock}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <p className="text-xs text-slate-500">Đã bán</p>
            <p className="font-bold text-slate-900 mt-1">{sold}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 h-9 rounded-lg border border-slate-300 text-sm font-semibold hover:bg-slate-100"
          >
            Sửa
          </button>

          <button
            onClick={() => onDelete(product)}
            className="flex-1 h-9 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
