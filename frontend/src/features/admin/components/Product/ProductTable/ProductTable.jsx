import { Edit, Trash2 } from "lucide-react";

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    if (!price && price !== 0) return "Chưa có giá";
    return Number(price).toLocaleString("vi-VN") + " ₫";
  };

  const getProductPrice = (product) => {
    if (product.minPrice !== undefined) return product.minPrice;

    let prices = [];

    product.variants?.forEach((variant) => {
      variant.sizes?.forEach((size) => {
        const price = size.salePrice > 0 ? size.salePrice : size.price;
        prices.push(price);
      });
    });

    if (prices.length === 0) return null;

    return Math.min(...prices);
  };

  const getProductStock = (product) => {
    if (product.totalStock !== undefined) return product.totalStock;

    let total = 0;

    product.variants?.forEach((variant) => {
      variant.sizes?.forEach((size) => {
        total += Number(size.stock || 0);
      });
    });

    return total;
  };

  return (
    <div className="overflow-auto mt-5 rounded-t-lg bg-white border-b-0 border">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-left">
          <tr>
            <th className="px-5 py-3 font-semibold text-slate-700">Sản phẩm</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Danh mục</th>
            <th className="px-5 py-3 font-semibold text-slate-700">
              Thương hiệu
            </th>
            <th className="px-5 py-3 font-semibold text-slate-700">Giá</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">
              Biến thể
            </th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">
              Tồn kho
            </th>
            <th className="px-5 py-3 font-semibold text-slate-700">
              Trạng thái
            </th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-right">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="8" className="px-5 py-10 text-center text-slate-500">
                Đang tải sản phẩm...
              </td>
            </tr>
          )}

          {!loading && products.length === 0 && (
            <tr>
              <td colSpan="8" className="px-5 py-10 text-center text-slate-500">
                Không có sản phẩm nào
              </td>
            </tr>
          )}

          {!loading &&
            products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-5 py-3 min-w-[260px]">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        product.thumbnail?.url ||
                        "https://placehold.co/80x80?text=No+Image"
                      }
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover bg-slate-100 border"
                    />

                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3 text-slate-700">
                  {product.category?.name || "Chưa có"}
                </td>

                <td className="px-5 py-3 text-slate-700">
                  {product.brand?.nameBrand || product.brand?.name || "Chưa có"}
                </td>

                <td className="px-5 py-3">
                  <p className="font-semibold text-indigo-600">
                    {formatPrice(getProductPrice(product))}
                  </p>
                </td>

                <td className="px-5 py-3 text-center text-slate-700">
                  {product.variants?.length || 0}
                </td>

                <td className="px-5 py-3 text-center">
                  <span className="font-medium text-slate-700">
                    {getProductStock(product)}
                  </span>
                </td>

                <td className="px-5 py-3">
                  {product.isPublished ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      Đang bán
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      Nháp
                    </span>
                  )}
                </td>

                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(product)}
                      className="size-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Edit className="size-4" />
                    </button>

                    <button
                      onClick={() => onDelete(product)}
                      className="size-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
