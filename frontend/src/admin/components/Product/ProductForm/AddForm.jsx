import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductService from "../../../../services/product.service";

const emptySize = {
  size: "",
  sku: "",
  price: "",
  salePrice: "",
  stock: "",
};

const emptyVariant = {
  color: "Mặc định",
  colorCode: "#d1d5db",
  images: [],
  sizes: [{ ...emptySize }],
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getImageUrl = (image) => {
  if (!image) return "";
  if (image instanceof File) return URL.createObjectURL(image);
  if (typeof image === "string") return image;
  return image.url || image.secure_url || "";
};

const normalizeProductVariants = (product) => {
  if (!Array.isArray(product?.variants) || product.variants.length === 0) {
    return [{ ...emptyVariant }];
  }

  return product.variants.map((variant) => ({
    _id: variant._id,
    color: variant.color || "Mặc định",
    colorCode: variant.colorCode || "#d1d5db",
    images: Array.isArray(variant.images) ? variant.images : [],
    sizes:
      Array.isArray(variant.sizes) && variant.sizes.length > 0
        ? variant.sizes.map((item) => ({
            _id: item._id,
            size: item.size || "",
            sku: item.sku || "",
            price: item.price ?? "",
            salePrice: item.salePrice ?? "",
            stock: item.stock ?? "",
          }))
        : [{ ...emptySize }],
  }));
};

const AddForm = ({
  product,
  brands = [],
  categories = [],
  onClose,
  onSuccess,
}) => {
  const safeBrands = Array.isArray(brands) ? brands : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const isEdit = Boolean(product?._id);

  const [loading, setLoading] = useState(false);
  const [hasSize, setHasSize] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    isPublished: true,
    thumbnail: null,
    thumbnailPreview: "",
  });

  const [variants, setVariants] = useState([{ ...emptyVariant }]);

  useEffect(() => {
    if (!product) {
      setForm({
        name: "",
        description: "",
        category: "",
        brand: "",
        isPublished: true,
        thumbnail: null,
        thumbnailPreview: "",
      });

      setVariants([{ ...emptyVariant }]);
      setHasSize(true);
      return;
    }

    const productVariants = normalizeProductVariants(product);

    const isNoSize = productVariants.every((variant) =>
      variant.sizes.every((item) => item.size === "FREESIZE"),
    );

    setForm({
      name: product.name || "",
      description: product.description || "",
      category: getId(product.category),
      brand: getId(product.brand),
      isPublished: product.isPublished ?? true,
      thumbnail: null,
      thumbnailPreview: getImageUrl(product.thumbnail),
    });

    setVariants(productVariants);
    setHasSize(!isNoSize);
  }, [product]);

  const changeForm = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeThumbnail = (file) => {
    setForm((prev) => ({
      ...prev,
      thumbnail: file || null,
      thumbnailPreview: file
        ? URL.createObjectURL(file)
        : prev.thumbnailPreview,
    }));
  };

  const changeVariant = (variantIndex, name, value) => {
    const newVariants = [...variants];

    newVariants[variantIndex] = {
      ...newVariants[variantIndex],
      [name]: value,
    };

    setVariants(newVariants);
  };

  const changeSize = (variantIndex, sizeIndex, name, value) => {
    const newVariants = [...variants];

    newVariants[variantIndex].sizes[sizeIndex] = {
      ...newVariants[variantIndex].sizes[sizeIndex],
      [name]: value,
    };

    setVariants(newVariants);
  };

  const changeVariantImages = (variantIndex, files) => {
    const imageList = Array.from(files || []);

    if (imageList.length === 0) return;

    const newVariants = [...variants];

    newVariants[variantIndex] = {
      ...newVariants[variantIndex],
      images: [...newVariants[variantIndex].images, ...imageList],
    };

    setVariants(newVariants);

    if (!form.thumbnail && !form.thumbnailPreview) {
      changeThumbnail(imageList[0]);
    }
  };

  const handleQuickImages = (files) => {
    const imageList = Array.from(files || []);

    if (imageList.length === 0) return;

    setVariants((prev) => {
      const newVariants = [...prev];

      newVariants[0] = {
        ...newVariants[0],
        images: [...newVariants[0].images, ...imageList],
      };

      return newVariants;
    });

    if (!form.thumbnail && !form.thumbnailPreview) {
      changeThumbnail(imageList[0]);
    }

    toast.success(`Đã thêm ${imageList.length} ảnh`);
  };

  const removeImage = (variantIndex, imageIndex) => {
    const newVariants = [...variants];

    newVariants[variantIndex].images.splice(imageIndex, 1);

    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        color: "",
        colorCode: "#d1d5db",
        images: [],
        sizes: [{ ...emptySize }],
      },
    ]);
  };

  const removeVariant = (variantIndex) => {
    if (variants.length === 1) {
      toast.warning("Phải có ít nhất 1 biến thể");
      return;
    }

    setVariants((prev) => prev.filter((_, index) => index !== variantIndex));
  };

  const addSize = (variantIndex) => {
    const newVariants = [...variants];

    newVariants[variantIndex].sizes.push({ ...emptySize });

    setVariants(newVariants);
  };

  const removeSize = (variantIndex, sizeIndex) => {
    const newVariants = [...variants];

    if (newVariants[variantIndex].sizes.length === 1) {
      toast.warning("Mỗi biến thể phải có ít nhất 1 dòng");
      return;
    }

    newVariants[variantIndex].sizes.splice(sizeIndex, 1);

    setVariants(newVariants);
  };

  const handleChangeHasSize = (value) => {
    setHasSize(value);

    if (!value) {
      setVariants((prev) =>
        prev.map((variant) => ({
          ...variant,
          sizes: [
            {
              ...variant.sizes[0],
              size: "FREESIZE",
              sku: variant.sizes[0]?.sku || "",
              price: variant.sizes[0]?.price || "",
              salePrice: variant.sizes[0]?.salePrice || "",
              stock: variant.sizes[0]?.stock || "",
            },
          ],
        })),
      );
    } else {
      setVariants((prev) =>
        prev.map((variant) => ({
          ...variant,
          sizes: [
            {
              ...variant.sizes[0],
              size:
                variant.sizes[0]?.size === "FREESIZE"
                  ? ""
                  : variant.sizes[0]?.size || "",
              sku: variant.sizes[0]?.sku || "",
              price: variant.sizes[0]?.price || "",
              salePrice: variant.sizes[0]?.salePrice || "",
              stock: variant.sizes[0]?.stock || "",
            },
          ],
        })),
      );
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return false;
    }

    if (!form.category) {
      toast.error("Vui lòng chọn danh mục");
      return false;
    }

    if (!form.brand) {
      toast.error("Vui lòng chọn thương hiệu");
      return false;
    }

    if (!form.thumbnail && !form.thumbnailPreview) {
      toast.error("Vui lòng chọn ảnh đại diện");
      return false;
    }

    for (const variant of variants) {
      if (!variant.color.trim()) {
        toast.error("Vui lòng nhập màu hoặc tên biến thể");
        return false;
      }
      if (!variant.colorCode || !/^#[0-9A-Fa-f]{6}$/.test(variant.colorCode)) {
        toast.error("Vui lòng nhập mã màu hợp lệ, ví dụ #000000");
        return false;
      }
      for (const item of variant.sizes) {
        if (hasSize && !item.size.trim()) {
          toast.error("Vui lòng nhập size");
          return false;
        }

        if (!item.sku.trim()) {
          toast.error("Vui lòng nhập SKU");
          return false;
        }

        if (!item.price || item.stock === "") {
          toast.error("Vui lòng nhập giá và tồn kho");
          return false;
        }

        if (Number(item.price) < 0 || Number(item.stock) < 0) {
          toast.error("Giá và tồn kho không được âm");
          return false;
        }

        if (item.salePrice && Number(item.salePrice) > Number(item.price)) {
          toast.error("Giá khuyến mãi không được lớn hơn giá gốc");
          return false;
        }
      }
    }

    return true;
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("brand", form.brand);
    formData.append("isPublished", form.isPublished);

    if (form.thumbnail) {
      formData.append("thumbnail", form.thumbnail);
    }

    const variantsData = variants.map((variant) => ({
      _id: variant._id,
      color: variant.color || "Mặc định",
      colorCode: variant.colorCode || "#d1d5db",
      images: variant.images.filter((image) => !(image instanceof File)),
      sizes: variant.sizes.map((item) => ({
        _id: item._id,
        size: hasSize ? item.size : "FREESIZE",
        sku: item.sku.trim(),
        price: Number(item.price),
        salePrice: Number(item.salePrice || 0),
        stock: Number(item.stock),
      })),
    }));

    formData.append("variants", JSON.stringify(variantsData));

    variants.forEach((variant, variantIndex) => {
      variant.images.forEach((image) => {
        if (image instanceof File) {
          formData.append(`variantImages-${variantIndex}`, image);
        }
      });
    });

    return formData;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      setLoading(true);

      const formData = buildFormData();

      if (isEdit) {
        await ProductService.updateProduct(product._id, formData);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await ProductService.createProduct(formData);
        toast.success("Thêm sản phẩm thành công");
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          (isEdit ? "Cập nhật sản phẩm thất bại" : "Thêm sản phẩm thất bại"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-5xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isEdit
                ? "Thông tin cũ sẽ được hiển thị lên form để chỉnh sửa."
                : "Thêm sản phẩm có size hoặc không size, upload nhiều ảnh một lần."}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-700 disabled:opacity-60"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-5">
          <section className="border border-slate-200 rounded-2xl p-4">
            <h3 className="font-semibold text-slate-900 mb-4">
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tên sản phẩm *</label>
                <input
                  value={form.name}
                  onChange={(e) => changeForm("name", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ảnh đại diện *</label>

                {form.thumbnailPreview && (
                  <div className="mt-2 mb-2">
                    <img
                      src={form.thumbnailPreview}
                      alt="thumbnail"
                      className="h-16 w-16 rounded-lg object-cover border"
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => changeThumbnail(e.target.files[0])}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Danh mục *</label>
                <select
                  value={form.category}
                  onChange={(e) => changeForm("category", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="">Chọn danh mục</option>
                  {safeCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Thương hiệu *</label>
                <select
                  value={form.brand}
                  onChange={(e) => changeForm("brand", e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="">Chọn thương hiệu</option>
                  {safeBrands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.nameBrand || brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Trạng thái</label>
                <select
                  value={String(form.isPublished)}
                  onChange={(e) =>
                    changeForm("isPublished", e.target.value === "true")
                  }
                  className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="true">Đang bán</option>
                  <option value="false">Nháp</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Loại sản phẩm</label>
                <select
                  value={hasSize ? "yes" : "no"}
                  onChange={(e) =>
                    handleChangeHasSize(e.target.value === "yes")
                  }
                  className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="yes">Có size</option>
                  <option value="no">Không có size</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => changeForm("description", e.target.value)}
                  className="mt-1 min-h-[90px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>
            </div>
          </section>

          <section className="border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">
                Biến thể sản phẩm
              </h3>

              <button
                type="button"
                onClick={addVariant}
                className="h-9 px-3 rounded-lg border text-sm font-semibold hover:bg-slate-100 flex items-center gap-2"
              >
                <Plus className="size-4" />
                Thêm màu / phiên bản
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, variantIndex) => (
                <div
                  key={variant._id || variantIndex}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex justify-between mb-3">
                    <p className="font-semibold text-sm text-slate-800">
                      Biến thể {variantIndex + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeVariant(variantIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="text-sm font-medium">
                        Màu / phiên bản *
                      </label>
                      <input
                        value={variant.color}
                        onChange={(e) =>
                          changeVariant(variantIndex, "color", e.target.value)
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
                        placeholder="Đen, trắng, xanh..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Mã màu *</label>

                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="color"
                          value={variant.colorCode || "#d1d5db"}
                          onChange={(e) =>
                            changeVariant(
                              variantIndex,
                              "colorCode",
                              e.target.value,
                            )
                          }
                          className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                        />

                        <input
                          value={variant.colorCode || ""}
                          onChange={(e) =>
                            changeVariant(
                              variantIndex,
                              "colorCode",
                              e.target.value,
                            )
                          }
                          className="h-10 flex-1 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Ảnh cho biến thể
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          changeVariantImages(variantIndex, e.target.files)
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  {variant.images.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {variant.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={getImageUrl(image)}
                            alt="product"
                            className="h-16 w-16 rounded-lg object-cover border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(variantIndex, index)}
                            className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-white"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 px-1">
                      {hasSize && <div className="col-span-2">Size</div>}
                      <div className="col-span-3">SKU</div>
                      <div className={hasSize ? "col-span-2" : "col-span-3"}>
                        Giá
                      </div>
                      <div className="col-span-2">Giá KM</div>
                      <div className={hasSize ? "col-span-2" : "col-span-3"}>
                        Tồn kho
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    {variant.sizes.map((item, sizeIndex) => (
                      <div
                        key={item._id || sizeIndex}
                        className="grid grid-cols-12 gap-2 items-center"
                      >
                        {hasSize && (
                          <input
                            value={item.size}
                            onChange={(e) =>
                              changeSize(
                                variantIndex,
                                sizeIndex,
                                "size",
                                e.target.value,
                              )
                            }
                            className="col-span-2 h-9 rounded-lg border border-slate-300 px-2 text-sm"
                            placeholder="Size"
                          />
                        )}

                        <input
                          value={item.sku}
                          onChange={(e) =>
                            changeSize(
                              variantIndex,
                              sizeIndex,
                              "sku",
                              e.target.value,
                            )
                          }
                          className="col-span-3 h-9 rounded-lg border border-slate-300 px-2 text-sm"
                          placeholder="SKU"
                        />

                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            changeSize(
                              variantIndex,
                              sizeIndex,
                              "price",
                              e.target.value,
                            )
                          }
                          className={
                            hasSize
                              ? "col-span-2 h-9 rounded-lg border border-slate-300 px-2 text-sm"
                              : "col-span-3 h-9 rounded-lg border border-slate-300 px-2 text-sm"
                          }
                          placeholder="Giá"
                        />

                        <input
                          type="number"
                          value={item.salePrice}
                          onChange={(e) =>
                            changeSize(
                              variantIndex,
                              sizeIndex,
                              "salePrice",
                              e.target.value,
                            )
                          }
                          className="col-span-2 h-9 rounded-lg border border-slate-300 px-2 text-sm"
                          placeholder="Giá KM"
                        />

                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) =>
                            changeSize(
                              variantIndex,
                              sizeIndex,
                              "stock",
                              e.target.value,
                            )
                          }
                          className={
                            hasSize
                              ? "col-span-2 h-9 rounded-lg border border-slate-300 px-2 text-sm"
                              : "col-span-3 h-9 rounded-lg border border-slate-300 px-2 text-sm"
                          }
                          placeholder="Tồn"
                        />

                        <button
                          type="button"
                          onClick={() => removeSize(variantIndex, sizeIndex)}
                          className="col-span-1 h-9 rounded-lg hover:bg-red-100 text-red-500 flex items-center justify-center"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}

                    {hasSize && (
                      <button
                        type="button"
                        onClick={() => addSize(variantIndex)}
                        className="h-9 px-3 rounded-lg border bg-white text-sm font-semibold hover:bg-slate-100 flex items-center gap-2"
                      >
                        <Plus className="size-4" />
                        Thêm size
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="h-10 px-5 rounded-lg border text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-10 px-5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading
              ? isEdit
                ? "Đang cập nhật..."
                : "Đang thêm..."
              : isEdit
                ? "Cập nhật sản phẩm"
                : "Thêm sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddForm;
