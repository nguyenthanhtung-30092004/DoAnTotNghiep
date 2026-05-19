import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";

import ProductService from "../services/product.service";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const formatPrice = (price) => {
  if (price === undefined || price === null) return "Liên hệ";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price));
};

const getBrandName = (brand) => {
  if (!brand) return "Không có thương hiệu";
  if (typeof brand === "string") return brand;

  return brand.nameBrand || brand.name || "Không có thương hiệu";
};

const getCategoryName = (category) => {
  if (!category) return "Không có danh mục";
  if (typeof category === "string") return category;

  return category.name || "Không có danh mục";
};

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;

  return image.url || image.secure_url || "";
};

const getAllImages = (product) => {
  const images = [];

  if (product?.thumbnail?.url) {
    images.push(product.thumbnail.url);
  }

  product?.variants?.forEach((variant) => {
    variant.images?.forEach((image) => {
      const url = getImageUrl(image);

      if (url && !images.includes(url)) {
        images.push(url);
      }
    });
  });

  return images;
};

const getMinPrice = (product) => {
  const prices = [];

  product?.variants?.forEach((variant) => {
    variant.sizes?.forEach((size) => {
      const price = Number(size.price || 0);
      const salePrice = Number(size.salePrice || 0);

      if (salePrice > 0 && salePrice < price) {
        prices.push(salePrice);
      } else if (price > 0) {
        prices.push(price);
      }
    });
  });

  if (prices.length === 0) return 0;

  return Math.min(...prices);
};

const ProductDetail = () => {
  const { productId, id } = useParams();
  const currentId = productId || id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const selectedVariant = variants[selectedVariantIndex];

  const selectedSize = useMemo(() => {
    return selectedVariant?.sizes?.find((item) => item._id === selectedSizeId);
  }, [selectedVariant, selectedSizeId]);

  const allImages = useMemo(() => {
    return getAllImages(product);
  }, [product]);

  const activeImages = useMemo(() => {
    const variantImages =
      selectedVariant?.images
        ?.map((image) => getImageUrl(image))
        .filter(Boolean) || [];

    if (variantImages.length > 0) {
      return variantImages;
    }

    return allImages;
  }, [selectedVariant, allImages]);

  const displayPrice = selectedSize
    ? Number(selectedSize.salePrice || 0) > 0 &&
      Number(selectedSize.salePrice) < Number(selectedSize.price)
      ? selectedSize.salePrice
      : selectedSize.price
    : getMinPrice(product);

  const originalPrice =
    selectedSize &&
    Number(selectedSize.salePrice || 0) > 0 &&
    Number(selectedSize.salePrice) < Number(selectedSize.price)
      ? selectedSize.price
      : null;

  const totalStock =
    selectedVariant?.sizes?.reduce(
      (sum, item) => sum + Number(item.stock || 0),
      0,
    ) || 0;

  const selectedStock = Number(selectedSize?.stock || 0);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);

      const res = await ProductService.getDetailProduct(currentId);
      const data = getResponseData(res);

      setProduct(data);

      const images = getAllImages(data);
      setSelectedImage(images[0] || "");

      setSelectedVariantIndex(0);
      setSelectedSizeId(data?.variants?.[0]?.sizes?.[0]?._id || "");
      setQuantity(1);
      setIsDescriptionExpanded(false);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lấy chi tiết sản phẩm thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeVariant = (variantIndex) => {
    const variant = variants[variantIndex];

    setSelectedVariantIndex(variantIndex);
    setSelectedSizeId(variant?.sizes?.[0]?._id || "");
    setQuantity(1);

    const firstVariantImage = getImageUrl(variant?.images?.[0]);

    if (firstVariantImage) {
      setSelectedImage(firstVariantImage);
    }
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (selectedStock > 0 && quantity >= selectedStock) {
      toast.warning("Số lượng đã đạt tối đa tồn kho");
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.warning("Vui lòng chọn màu sản phẩm");
      return;
    }

    if (!selectedSize) {
      toast.warning("Vui lòng chọn size");
      return;
    }

    if (selectedStock <= 0) {
      toast.warning("Size này đã hết hàng");
      return;
    }

    if (quantity > selectedStock) {
      toast.warning("Số lượng vượt quá tồn kho");
      return;
    }

    toast.success(
      "Đã chọn sản phẩm, bước thêm giỏ hàng xử lý tiếp ở cart service",
    );
  };

  useEffect(() => {
    if (currentId) {
      fetchProductDetail();
    }
  }, [currentId]);

  useEffect(() => {
    if (product) {
      window.scrollTo({
        top: 50,
        behavior: "smooth",
      });
    }
  }, [product]);

  useEffect(() => {
    if (activeImages.length > 0 && !activeImages.includes(selectedImage)) {
      setSelectedImage(activeImages[0]);
    }
  }, [activeImages, selectedImage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-9 w-9 animate-spin mb-3" />
          <p>Đang tải chi tiết sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Không tìm thấy sản phẩm
          </h2>

          <Link
            to="/shop"
            className="inline-block mt-4 text-green-600 font-semibold hover:underline"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      <main>
        <section>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-1 text-sm text-gray-500">
              <Link to="/" className="hover:text-black transition-colors">
                Trang chủ
              </Link>

              <ChevronRight className="h-3.5 w-3.5" />

              <Link to="/shop" className="hover:text-black transition-colors">
                Cửa hàng
              </Link>

              <ChevronRight className="h-3.5 w-3.5" />

              <span className="text-black font-medium line-clamp-1">
                {product.name}
              </span>
            </nav>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="lg:sticky lg:top-24 self-start">
              <div className="rounded-3xl border bg-white overflow-hidden">
                <div className="flex items-center justify-center h-[450px]">
                  <img
                    src={selectedImage || "/placeholder-product.png"}
                    alt={product.name}
                    className="size-[80%] object-contain"
                  />
                </div>
              </div>

              {activeImages.length > 1 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {activeImages.slice(0, 10).map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square rounded-2xl border overflow-hidden bg-gray-50 transition ${
                        selectedImage === image
                          ? "border-green-500 ring-2 ring-green-100"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name}-${index}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                  {getBrandName(product.brand)}
                </p>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 leading-tight">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {product.rating || 5}
                    </span>
                    <span className="text-gray-500">
                      ({product.reviewCount || 0} đánh giá)
                    </span>
                  </div>

                  <span className="h-1 w-1 rounded-full bg-gray-300" />

                  <span className="text-gray-500">
                    Danh mục:{" "}
                    <span className="font-medium text-gray-800">
                      {getCategoryName(product.category)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-bold text-red-500">
                    {formatPrice(displayPrice)}
                  </p>

                  {originalPrice && (
                    <p className="text-lg text-gray-400 line-through mb-1">
                      {formatPrice(originalPrice)}
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Tồn kho:{" "}
                  <span className="font-semibold text-gray-900">
                    {totalStock}
                  </span>
                </p>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Màu sắc</h3>

                    <button type="button">
                      <span className="text-sm underline font-bold text-green-500">
                        Size chart
                      </span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {variants.map((variant, index) => (
                      <button
                        key={variant._id || index}
                        type="button"
                        onClick={() => handleChangeVariant(index)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                          selectedVariantIndex === index
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <span
                          className="h-5 w-5 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: variant.colorCode || "#d1d5db",
                          }}
                        />
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900">Size</h3>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                    {selectedVariant?.sizes?.map((item) => {
                      const isOutOfStock = Number(item.stock || 0) <= 0;

                      return (
                        <button
                          key={item._id}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedSizeId(item._id);
                            setQuantity(1);
                          }}
                          className={`h-11 rounded-xl border text-sm font-semibold transition ${
                            selectedSizeId === item._id
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-200 bg-white text-gray-800 hover:border-green-500"
                          } ${
                            isOutOfStock
                              ? "opacity-40 cursor-not-allowed line-through"
                              : ""
                          }`}
                        >
                          {item.size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900">Số lượng</h3>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-11 inline-flex items-center rounded-xl border overflow-hidden">
                      <button
                        type="button"
                        onClick={handleDecreaseQuantity}
                        className="h-full w-11 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-12 text-center font-semibold">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={handleIncreaseQuantity}
                        className="h-full w-11 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="h-11 flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Thêm vào giỏ hàng
                    </button>

                    <button
                      type="button"
                      className="h-11 w-11 rounded-xl border flex items-center justify-center hover:bg-gray-50"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Mô tả sản phẩm
                </h2>

                <div
                  className={`relative overflow-hidden rounded-3xl border mt-4 bg-white transition-all duration-300 ${
                    isDescriptionExpanded ? "max-h-none" : "max-h-[360px]"
                  }`}
                >
                  <div
                    className="
                      p-6 text-gray-700 leading-8
                      [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3
                      [&_p]:my-3
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4
                      [&_li]:my-2
                      [&_strong]:font-bold [&_strong]:text-gray-900
                      [&_hr]:my-7 [&_hr]:border-gray-200
                      [&_br]:hidden
                    "
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description ||
                        "<p>Sản phẩm chưa có mô tả chi tiết.</p>",
                    }}
                  />

                  {!isDescriptionExpanded && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>

                <div className="px-6 py-4 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      setIsDescriptionExpanded((current) => !current)
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-green-600 px-6 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                  >
                    {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isDescriptionExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thông tin nhanh
                </h2>

                <div className="mt-4 rounded-3xl border bg-gray-50 p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Thương hiệu</p>
                    <p className="font-semibold text-gray-900">
                      {getBrandName(product.brand)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Danh mục</p>
                    <p className="font-semibold text-gray-900">
                      {getCategoryName(product.category)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Số biến thể</p>
                    <p className="font-semibold text-gray-900">
                      {variants.length} màu / phiên bản
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="font-semibold text-gray-900">
                      {product.isPublished ? "Đang bán" : "Tạm ẩn"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-3xl border bg-gray-50 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Đánh giá sản phẩm
              </h2>

              <p className="text-gray-500 mt-2">
                Chức năng đánh giá có thể nối API reviews sau. Hiện tại hiển thị
                tổng quan từ sản phẩm.
              </p>

              <div className="mt-5 flex items-center justify-center gap-2">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <span className="text-3xl font-bold">
                  {product.rating || 5}
                </span>
                <span className="text-gray-500">
                  / 5 từ {product.reviewCount || 0} đánh giá
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur lg:hidden">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 line-clamp-1">{product.name}</p>
            <p className="font-bold text-red-500">
              {formatPrice(displayPrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="h-11 px-4 rounded-xl bg-green-600 text-white font-semibold flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
