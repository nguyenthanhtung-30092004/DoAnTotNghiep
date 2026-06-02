import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  Send,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import CartService from "../../services/cart.service";
import ProductService from "../../services/product.service";
import reviewService from "../../services/review.service";
import SizeChartModal from "../../components/products/SizeChartModal";
import ProductDescription from "../../components/products/ProductDescription";
import RatingStars from "../../components/products/RatingStars";
import socket from "../../socket/socket";

import { useDispatch, useSelector } from "react-redux";
import {
  addGuestCart,
  openCartDrawer,
  setCart,
} from "../../redux/slices/cartSlice";

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

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);

  const dragStartXRef = useRef(0);
  const dragCurrentXRef = useRef(0);

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

  const selectedImageIndex = useMemo(() => {
    return activeImages.findIndex((image) => image === selectedImage);
  }, [activeImages, selectedImage]);

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

  const selectedStock = Number(selectedSize?.stock || 0);

  const ratingAverage = Number(product?.ratingAverage || product?.rating || 0);
  const ratingCount = Number(product?.ratingCount || product?.reviewCount || 0);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);

      const res = await ProductService.getDetailProduct(currentId);
      const data = res;

      setProduct(data);

      const images = getAllImages(data);
      setSelectedImage(images[0] || "");

      setSelectedVariantIndex(0);
      setSelectedSizeId(data?.variants?.[0]?.sizes?.[0]?._id || "");
      setQuantity(1);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lấy chi tiết sản phẩm thất bại"
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

      const data = res;

      setReviews(data.reviews || []);
      setReviewPagination(data.pagination || null);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lấy đánh giá sản phẩm thất bại"
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

  const handleArrowPrevClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handlePrevImage();
  };

  const handleArrowNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNextImage();
  };

  const handleImagePointerDown = (e) => {
    if (activeImages.length <= 1) return;

    if (e.pointerType === "mouse" && e.button !== 0) return;

    setIsDraggingImage(true);
    setDragDistance(0);

    dragStartXRef.current = e.clientX;
    dragCurrentXRef.current = e.clientX;

    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleImagePointerMove = (e) => {
    if (!isDraggingImage) return;

    dragCurrentXRef.current = e.clientX;

    const distance = dragCurrentXRef.current - dragStartXRef.current;

    setDragDistance(distance);
  };

  const handleImagePointerUp = (e) => {
    if (!isDraggingImage) return;

    const distance = dragCurrentXRef.current - dragStartXRef.current;
    const minSwipeDistance = 45;

    setIsDraggingImage(false);
    setDragDistance(0);

    e.currentTarget.releasePointerCapture?.(e.pointerId);

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance < 0) {
      handleNextImage();
    } else {
      handlePrevImage();
    }
  };

  const handleImagePointerCancel = () => {
    setIsDraggingImage(false);
    setDragDistance(0);
  };

  const handleImagePointerLeave = (e) => {
    if (e.pointerType === "mouse") {
      handleImagePointerCancel();
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
        const data = res;

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
          })
        );
      }

      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      dispatch(openCartDrawer());
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Thêm vào giỏ hàng thất bại"
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
        top: 150,
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center text-zinc-500">
          <Loader2 className="mb-3 h-9 w-9 animate-spin text-zinc-950" />
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-950">
            Đang tải...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-950">
            Không tìm thấy sản phẩm
          </h2>

          <Link
            to="/shop"
            className="mt-6 inline-flex h-12 items-center justify-center bg-zinc-950 px-8 text-xs font-black uppercase tracking-[0.15em] text-white transition-all hover:bg-teal-600"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <main>
        <section className="border-b border-zinc-200">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
            <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-zinc-400 sm:text-[10px] sm:tracking-[0.2em]">
              <Link
                to="/"
                className="shrink-0 transition-colors hover:text-zinc-950"
              >
                Trang chủ
              </Link>

              <ChevronRight className="h-3 w-3 shrink-0" />

              <Link
                to="/shop"
                className="shrink-0 transition-colors hover:text-zinc-950"
              >
                Cửa hàng
              </Link>

              <ChevronRight className="h-3 w-3 shrink-0" />

              <span className="line-clamp-1 text-zinc-950">{product.name}</span>
            </nav>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-5 pt-6 sm:px-6 lg:pt-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="flex flex-col-reverse gap-4 lg:grid lg:grid-cols-[76px_1fr] lg:gap-5">
                <div className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[680px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1">
                  {activeImages.map((image, index) => {
                    const isActive = selectedImage === image;

                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`flex h-16 w-16 shrink-0 items-center justify-center border bg-white p-2 transition-all lg:h-[68px] lg:w-[68px] ${
                          isActive
                            ? "border-zinc-950"
                            : "border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-contain mix-blend-multiply"
                          draggable={false}
                        />
                      </button>
                    );
                  })}
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onPointerDown={handleImagePointerDown}
                  onPointerMove={handleImagePointerMove}
                  onPointerUp={handleImagePointerUp}
                  onPointerCancel={handleImagePointerCancel}
                  onPointerLeave={handleImagePointerLeave}
                  style={{
                    touchAction: "pan-y",
                  }}
                  className={`relative flex h-[360px] select-none items-center justify-center overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-50/70 p-6 sm:h-[480px] sm:p-10 lg:h-[620px] lg:rounded-[34px] lg:p-14 ${
                    activeImages.length > 1
                      ? isDraggingImage
                        ? "cursor-grabbing"
                        : "cursor-grab"
                      : "cursor-default"
                  }`}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.name}
                      draggable={false}
                      style={{
                        transform: `translateX(${dragDistance * 0.35}px) scale(${
                          isDraggingImage ? 0.98 : 1
                        })`,
                      }}
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-bold uppercase tracking-widest text-zinc-400">
                      Không có ảnh
                    </div>
                  )}

                  {activeImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handleArrowPrevClick}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center text-zinc-400 transition-all hover:-translate-x-1 hover:text-zinc-950 sm:left-5"
                        aria-label="Ảnh trước"
                      >
                        <ChevronLeft className="h-9 w-9 stroke-[1.4] sm:h-11 sm:w-11" />
                      </button>

                      <button
                        type="button"
                        onClick={handleArrowNextClick}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center text-zinc-400 transition-all hover:translate-x-1 hover:text-zinc-950 sm:right-5"
                        aria-label="Ảnh sau"
                      >
                        <ChevronRightIcon className="h-9 w-9 stroke-[1.4] sm:h-11 sm:w-11" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                        {activeImages.map((image, index) => (
                          <button
                            key={`dot-${image}-${index}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image);
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            className={`h-1.5 rounded-full transition-all ${
                              selectedImageIndex === index
                                ? "w-6 bg-zinc-950"
                                : "w-1.5 bg-zinc-300 hover:bg-zinc-500"
                            }`}
                            aria-label={`Chọn ảnh ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="mb-8">
                <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-teal-600">
                  {getBrandName(product.brand)}
                </p>

                <h1 className="text-2xl font-black leading-tight tracking-tighter text-zinc-950 sm:text-3xl lg:text-4xl">
                  {product.name}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-zinc-950">
                      {ratingAverage > 0 ? ratingAverage.toFixed(1) : "0.0"}
                    </span>
                    <span>({ratingCount} đánh giá)</span>
                  </div>

                  <span className="h-1 w-1 bg-zinc-300" />

                  <span>
                    Danh mục:{" "}
                    <span className="text-zinc-950">
                      {getCategoryName(product.category)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-200 py-8">
                <div className="flex flex-wrap items-end gap-4">
                  <p className="text-[28px] font-black tracking-tighter text-red-500">
                    {formatPrice(displayPrice)}
                  </p>

                  {originalPrice && (
                    <p className="mb-1 text-lg font-bold text-zinc-400 line-through">
                      {formatPrice(originalPrice)}
                    </p>
                  )}
                </div>

                <div className="mt-5">
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-950">
                    Màu sắc
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {variants.map((variant, index) => (
                      <button
                        key={variant._id || index}
                        type="button"
                        onMouseEnter={() => handlePreviewVariant(index)}
                        onClick={() => handleChangeVariant(index)}
                        className={`flex h-11 items-center gap-3 border px-5 text-xs font-bold uppercase tracking-wider transition-all ${
                          selectedVariantIndex === index
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-950"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full border shadow-sm ${
                            selectedVariantIndex === index
                              ? "border-zinc-700"
                              : "border-zinc-200"
                          }`}
                          style={{
                            backgroundColor: variant.colorCode || "#d1d5db",
                          }}
                        />
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-950">
                      Kích cỡ
                    </h3>

                    <button
                      type="button"
                      onClick={() => setSizeChartOpen(true)}
                      className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 underline transition-colors hover:text-teal-600"
                    >
                      Bảng size
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4">
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
                          className={`flex items-center justify-center border px-[7px] py-[10px] text-sm font-bold uppercase transition-all ${
                            selectedSizeId === item._id
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-zinc-200 bg-white text-zinc-950 hover:border-zinc-950"
                          } ${
                            isOutOfStock
                              ? "cursor-not-allowed opacity-30 line-through hover:border-zinc-200"
                              : ""
                          }`}
                        >
                          {item.size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-950">
                      Số lượng
                    </h3>

                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Còn lại:{" "}
                      <span className="text-zinc-950">{selectedStock}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex h-14 w-full items-center border border-zinc-200 bg-white sm:w-36">
                      <button
                        type="button"
                        onClick={handleDecreaseQuantity}
                        className="flex h-full w-12 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="flex-1 text-center font-bold text-zinc-950">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={handleIncreaseQuantity}
                        className="flex h-full w-12 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap bg-zinc-950 px-4 text-[11px] font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:flex-1 sm:gap-3 sm:px-8 sm:text-xs sm:tracking-[0.15em]"
                    >
                      {addingToCart ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-5 w-5 shrink-0" />
                      )}
                      {addingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-4 py-[20px] sm:px-6 lg:py-[30px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                <ProductDescription description={product.description} />
              </div>

              <div className="lg:col-span-4">
                <h2 className="mb-6 text-xl font-black uppercase tracking-tight text-zinc-950">
                  Thông tin nhanh
                </h2>

                <div className="border border-zinc-200 bg-white">
                  <div className="flex flex-col border-b border-zinc-200 p-6 last:border-0">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      Thương hiệu
                    </p>
                    <p className="font-bold text-zinc-950">
                      {getBrandName(product.brand)}
                    </p>
                  </div>

                  <div className="flex flex-col border-b border-zinc-200 p-6 last:border-0">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      Danh mục
                    </p>
                    <p className="font-bold text-zinc-950">
                      {getCategoryName(product.category)}
                    </p>
                  </div>

                  <div className="flex flex-col border-b border-zinc-200 p-6 last:border-0">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      Phiên bản
                    </p>
                    <p className="font-bold text-zinc-950">
                      {variants.length} màu / thiết kế
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 lg:mt-32">
              <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
                <div className="lg:w-1/3">
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-950">
                    Đánh giá
                  </h2>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                    Đọc nhận xét thực tế từ khách hàng đã mua sản phẩm này.
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-10 w-10 fill-yellow-400 text-yellow-400" />

                      <span className="text-6xl font-black tracking-tighter text-zinc-950">
                        {ratingAverage > 0 ? ratingAverage.toFixed(1) : "0.0"}
                      </span>
                    </div>

                    <div>
                      <RatingStars value={Math.round(ratingAverage)} />

                      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Từ {ratingCount} lượt mua
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleCreateReview}
                  className="border border-zinc-200 bg-white p-6 sm:p-8 lg:w-2/3"
                >
                  <h3 className="mb-6 text-sm font-black uppercase tracking-[0.1em] text-zinc-950">
                    Viết đánh giá của bạn
                  </h3>

                  {!user && (
                    <div className="mb-6 border border-zinc-950 bg-zinc-950 px-5 py-4 text-xs font-bold uppercase tracking-wider text-white">
                      Vui lòng đăng nhập để gửi đánh giá.
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">
                        Đánh giá sao
                      </label>

                      <RatingStars
                        value={reviewRating}
                        onChange={setReviewRating}
                        size="h-6 w-6"
                      />
                    </div>

                    <div>
                      <label className="mb-3 block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">
                        Chia sẻ cảm nhận
                      </label>

                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Chất liệu thế nào? Kích thước có vừa vặn không?"
                        rows={4}
                        maxLength={1000}
                        className="w-full resize-none border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm outline-none transition-all focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview || !user}
                      className="flex h-12 w-full items-center justify-center gap-3 bg-zinc-950 px-10 text-xs font-black uppercase tracking-[0.15em] text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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

              <div className="mt-16 lg:mt-24">
                <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-4">
                  <h3 className="text-xl font-black uppercase tracking-tight text-zinc-950">
                    Bình luận mới nhất
                  </h3>

                  {reviewPagination && (
                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400">
                      {reviewPagination.totalReview || 0} bình luận
                    </span>
                  )}
                </div>

                {loadingReviews ? (
                  <div className="flex items-center justify-center py-16 text-zinc-400">
                    <Loader2 className="mr-3 h-6 w-6 animate-spin text-zinc-950" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Đang tải...
                    </span>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="border border-zinc-200 bg-white p-12 text-center">
                    <p className="text-sm font-bold text-zinc-500">
                      Sản phẩm chưa có đánh giá nào.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border border-zinc-200 bg-white p-6 sm:p-8"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-bold text-zinc-950">
                              {review.user?.name ||
                                review.user?.email ||
                                "Khách hàng"}
                            </p>

                            <div className="mt-2 flex items-center gap-3">
                              <RatingStars value={review.rating} />

                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-5 text-sm leading-relaxed text-zinc-600">
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

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white p-4 lg:hidden">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500">
              {product.name}
            </p>

            <p className="text-lg font-black tracking-tight text-zinc-950">
              {formatPrice(displayPrice)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="flex h-12 shrink-0 items-center gap-2 bg-teal-600 px-5 text-xs font-black uppercase tracking-[0.1em] text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
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
