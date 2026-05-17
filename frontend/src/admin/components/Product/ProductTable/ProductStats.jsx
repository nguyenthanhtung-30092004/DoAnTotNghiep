const ProductStats = ({
  totalProduct,
  showingProduct,
  totalBrand,
  totalCategory,
}) => {
  const stats = [
    {
      label: "Tổng sản phẩm",
      value: totalProduct,
      className: "text-slate-900",
    },
    {
      label: "Đang hiển thị",
      value: showingProduct,
      className: "text-emerald-600",
    },
    {
      label: "Thương hiệu",
      value: totalBrand,
      className: "text-indigo-600",
    },
    {
      label: "Danh mục",
      value: totalCategory,
      className: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className={`text-2xl font-bold mt-1 ${item.className}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;
