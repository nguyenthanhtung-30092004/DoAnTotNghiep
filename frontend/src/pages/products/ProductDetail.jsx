import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronRight,
  Heart,
  Loader2,
  Minus,
  Plus,
  Send,
  ShoppingCart,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";

import CartService from "../../services/cart.service";
import ProductService from "../../services/product.service";
import reviewService from "../../services/review.service";
import SizeChartModal from "../../components/products/SizeChartModal";
import ProductGallery from "../../components/products/ProductGallery";
import ProductDescription from "../../components/products/ProductDescription";
import RatingStars from "../../components/products/RatingStars";
import socket from "../../socket/socket";

import { useDispatch, useSelector } from "react-redux";
import {
  addGuestCart,
  openCartDrawer,
  setCart,
} from "../../redux/slices/cartSlice";

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

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
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
  const dispatch = useDispatch();

  const [addingToCart, setAddingToCart] = useState(false);
  const { productSlug, productId, id } = useParams();
  const currentId = productSlug || productId || id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewPagination, setReviewPagination] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const selectedVariant = variants[selectedVariantIndex];

  const selectedSize = useMemo(() => {
    return selectedVariant?.sizes?.find((item) => item._id === selectedSizeId);
  }, [selectedVariant, selectedSizeId]);

  const allImages = useMemo(() => {
    return getAllImages(product);
  }, [product]);

  const variantThumbnail = getImageUrl(selectedVariant?.images?.[0]);

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

  const ratingAverage = Number(product?.ratingAverage || product?.rating || 0);
  const ratingCount = Number(product?.ratingCount || product?.reviewCount || 0);

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
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lấy chi tiết sản phẩm thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async (productIdValue) => {
    if (!productIdValue) return;

    try {
      setLoadingReviews(true);

      const res = await reviewService.getProductReviews(productIdValue, {
        page: 1,
        limit: 10,
      });

      const data = getResponseData(res);

      setReviews(data.reviews || []);
      setReviewPagination(data.pagination || null);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lấy đánh giá sản phẩm thất bại",
      );
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.warning("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }

    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      toast.warning("Vui lòng chọn số sao từ 1 đến 5");
      return;
    }

    if (reviewContent.trim().length > 1000) {
      toast.warning("Nội dung đánh giá không được vượt quá 1000 ký tự");
      return;
    }

    try {
      setSubmittingReview(true);

      await reviewService.createReview({
        productId: product._id,
        rating: reviewRating,
        content: reviewContent.trim(),
      });

      toast.success("Gửi đánh giá thành công, vui lòng chờ admin duyệt");

      setReviewRating(5);
      setReviewContent("");

      await fetchProductReviews(product._id);
      await fetchProductDetail();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmittingReview(false);
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

  const handlePreviewVariant = (variantIndex) => {
    const firstVariantImage = getImageUrl(variants[variantIndex]?.images?.[0]);

    if (firstVariantImage) {
      setSelectedImage(firstVariantImage);
    }
  };

  const handleNextImage = () => {
    if (activeImages.length <= 1) return;

    const currentIndex = activeImages.indexOf(selectedImage);
    const nextIndex =
      currentIndex >= 0 ? (currentIndex + 1) % activeImages.length : 0;

    setSelectedImage(activeImages[nextIndex]);
  };

  const handlePrevImage = () => {
    if (activeImages.length <= 1) return;

    const currentIndex = activeImages.indexOf(selectedImage);
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : activeImages.length - 1;

    setSelectedImage(activeImages[prevIndex]);
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

  const handleAddToCart = async () => {
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

    const cartPayload = {
      productId: product._id,
      variantId: selectedVariant._id,
      sizeId: selectedSize._id,
      quantity,
    };

    try {
      setAddingToCart(true);

      if (user) {
        const res = await CartService.addToCart(cartPayload);
        const data = getResponseData(res);

        dispatch(setCart(data));
      } else {
        dispatch(
          addGuestCart({
            localId: `${product._id}-${selectedVariant._id}-${selectedSize._id}`,
            ...cartPayload,
            productName: product.name,
            productSlug: product.slug,
            image: variantThumbnail,
            color: selectedVariant.color,
            size: selectedSize.size,
            sku: selectedSize.sku,
            price: selectedSize.price,
            salePrice: selectedSize.salePrice,
            maxQuantity: selectedStock,
            isAvailable: selectedStock > 0,
          }),
        );
      }

      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      dispatch(openCartDrawer());
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Thêm vào giỏ hàng thất bại",
      );
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    if (currentId) {
      fetchProductDetail();
    }
  }, [currentId]);

  useEffect(() => {
    if (product?._id) {
      fetchProductReviews(product._id);
    }
  }, [product?._id]);

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

  useEffect(() => {
    if (!product?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-product-room", product._id);

    const handleReviewPublished = (data) => {
      const newReview = data.review;

      const reviewProductId =
        typeof newReview?.product === "string"
          ? newReview.product
          : newReview?.product?._id;

      if (!newReview || reviewProductId !== product._id) return;

      setReviews((prev) => {
        const exists = prev.some((item) => item._id === newReview._id);

        if (exists) return prev;

        return [newReview, ...prev];
      });

      fetchProductDetail();

      toast.success("Có đánh giá mới vừa được duyệt");
    };

    const handleReviewRemoved = (data) => {
      const productId =
        typeof data.productId === "string"
          ? data.productId
          : data.productId?.toString();

      if (productId !== product._id) return;

      setReviews((prev) => prev.filter((item) => item._id !== data.reviewId));

      fetchProductDetail();
    };

    socket.on("review:published", handleReviewPublished);
    socket.on("review:removed", handleReviewRemoved);

    return () => {
      socket.emit("leave-product-room", product._id);
      socket.off("review:published", handleReviewPublished);
      socket.off("review:removed", handleReviewRemoved);
    };
  }, [product?._id]);

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
            <ProductGallery
              activeImages={activeImages}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              handlePrevImage={handlePrevImage}
              handleNextImage={handleNextImage}
              productName={product.name}
            />

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
                      {ratingAverage > 0 ? ratingAverage.toFixed(1) : "0.0"}
                    </span>
                    <span className="text-gray-500">
                      ({ratingCount} đánh giá)
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

                    <button
                      type="button"
                      onClick={() => setSizeChartOpen(true)}
                    >
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
                        onMouseEnter={() => handlePreviewVariant(index)}
                        onClick={() => handleChangeVariant(index)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                          selectedVariantIndex === index
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-green-500 hover:bg-green-50 hover:text-green-700"
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
                      disabled={addingToCart}
                      className="h-11 px-4 rounded-xl bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold flex items-center gap-2"
                    >
                      {addingToCart ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                      {addingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
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
              <ProductDescription description={product.description} />

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

            <div className="mt-12 rounded-3xl border bg-gray-50 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Đánh giá sản phẩm
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Xem nhận xét thật từ khách hàng đã mua sản phẩm.
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
                      <span className="text-4xl font-bold text-gray-900">
                        {ratingAverage > 0 ? ratingAverage.toFixed(1) : "0.0"}
                      </span>
                    </div>

                    <div>
                      <RatingStars value={Math.round(ratingAverage)} />
                      <p className="text-sm text-gray-500 mt-1">
                        {ratingCount} đánh giá
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleCreateReview}
                  className="w-full lg:max-w-md rounded-2xl bg-white border p-5"
                >
                  <h3 className="font-bold text-gray-900 mb-4">
                    Viết đánh giá của bạn
                  </h3>

                  {!user && (
                    <div className="mb-4 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-700">
                      Bạn cần đăng nhập để gửi đánh giá.
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số sao
                      </label>

                      <RatingStars
                        value={reviewRating}
                        onChange={setReviewRating}
                        size="h-6 w-6"
                      />
                    </div>

                    <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
                      Bạn chỉ có thể đánh giá sản phẩm đã mua và đơn hàng đã
                      giao.
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nội dung đánh giá
                      </label>

                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Sản phẩm có tốt không? Size có vừa không?"
                        rows={4}
                        maxLength={1000}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none resize-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview || !user}
                      className="w-full h-11 rounded-xl bg-green-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-green-700"
                    >
                      {submittingReview ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}

                      {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">
                    Bình luận mới nhất
                  </h3>

                  {reviewPagination && (
                    <span className="text-sm text-gray-500">
                      {reviewPagination.totalReview || 0} đánh giá
                    </span>
                  )}
                </div>

                {loadingReviews ? (
                  <div className="flex items-center justify-center py-10 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Đang tải đánh giá...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="rounded-2xl bg-white border p-8 text-center text-gray-500">
                    Sản phẩm chưa có đánh giá nào.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="rounded-2xl bg-white border p-5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-bold text-gray-900">
                              {review.user?.name ||
                                review.user?.email ||
                                "Khách hàng"}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                              <RatingStars value={review.rating} />
                              <span className="text-xs text-gray-400">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mt-3 leading-6">
                          {review.content ||
                            "Khách hàng không để lại nội dung."}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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

      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
