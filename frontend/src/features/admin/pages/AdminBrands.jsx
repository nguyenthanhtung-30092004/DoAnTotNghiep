import { Pencil, Plus, Search, Star, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import brandService from "../../../features/products/services/brand.service";
import AddBrandForm from "../components/BrandForm/AddBrandForm";
import DeleteBrandForm from "../components/BrandForm/DeleteBrandForm";

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);

      const res = await brandService.getAllBrands();
      console.log(res.data);

      setBrands(res.data.metadata || []);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lấy danh sách thương hiệu thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const keyword = search.toLowerCase();

      return (
        brand.nameBrand?.toLowerCase().includes(keyword) ||
        brand.slugBrand?.toLowerCase().includes(keyword)
      );
    });
  }, [brands, search]);

  const handleOpenAdd = () => {
    setSelectedBrand(null);
    setShowAddForm(true);
  };

  const handleOpenEdit = (brand) => {
    setSelectedBrand(brand);
    setShowAddForm(true);
  };

  const handleOpenDelete = (brand) => {
    setSelectedBrand(brand);
    setShowDeleteForm(true);
  };

  const handleCloseAdd = () => {
    setSelectedBrand(null);
    setShowAddForm(false);
  };

  const handleCloseDelete = () => {
    setSelectedBrand(null);
    setShowDeleteForm(false);
  };

  const handleSubmitBrand = async (formData) => {
    if (selectedBrand) {
      await brandService.updateBrand(selectedBrand._id, formData);
    } else {
      await brandService.createBrand(formData);
    }

    await fetchBrands();
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;

    await brandService.deleteBrand(selectedBrand._id);
    await fetchBrands();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thương hiệu</h1>
          <p className="text-sm text-slate-500 mt-1">
            {brands.length} thương hiệu đang quản lý
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 h-10 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft hover:shadow-card-hover active:scale-[0.97]"
        >
          <Plus className="size-4" />
          Thêm thương hiệu
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
        <div className="relative max-w-sm">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 pl-9"
            placeholder="Tìm theo tên hoặc slug..."
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          Đang tải danh sách thương hiệu...
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          Không có thương hiệu nào
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                    {brand.logoBrand ? (
                      <img
                        src={brand.logoBrand}
                        alt={brand.nameBrand}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-indigo-600">
                        {brand.nameBrand?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {brand.nameBrand}
                      </h3>

                      {brand.outStanding && (
                        <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-500 truncate">
                      {brand.slugBrand}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                    brand.outStanding
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {brand.outStanding ? "Nổi bật" : "Thường"}
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                {brand.description}
              </p>

              <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {brand.createdAt
                    ? `Tạo ${new Date(brand.createdAt).toLocaleDateString(
                        "vi-VN",
                      )}`
                    : "Chưa có ngày tạo"}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenEdit(brand)}
                    className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600"
                    title="Sửa thương hiệu"
                  >
                    <Pencil className="size-4" />
                  </button>

                  <button
                    onClick={() => handleOpenDelete(brand)}
                    className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600"
                    title="Xóa thương hiệu"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <AddBrandForm
          brand={selectedBrand}
          onClose={handleCloseAdd}
          onConfirm={handleSubmitBrand}
        />
      )}

      {showDeleteForm && (
        <DeleteBrandForm
          brand={selectedBrand}
          onClose={handleCloseDelete}
          onConfirm={handleDeleteBrand}
        />
      )}
    </div>
  );
};

export default AdminBrands;
