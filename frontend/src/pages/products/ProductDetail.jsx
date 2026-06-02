import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronRight,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { toast } from "react-toastify";

import CartService from "../../services/cart.service";
import ProductService from "../../services/product.service";
import reviewService from "../../services/review.service";
import SizeChartModal from "../../components/products/SizeChartModal";
import ProductDescription from "../../components/products/ProductDescription";
import ProductGallery from "../../components/products/ProductGallery";
import ProductInfo, { getBrandName, getCategoryName } from "../../components/products/ProductInfo";
import ProductReviews from "../../components/products/ProductReviews";
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
              <ProductGallery
                product={product}
                activeImages={activeImages}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                selectedImageIndex={selectedImageIndex}
                isDraggingImage={isDraggingImage}
                dragDistance={dragDistance}
                handleImagePointerDown={handleImagePointerDown}
                handleImagePointerMove={handleImagePointerMove}
                handleImagePointerUp={handleImagePointerUp}
                handleImagePointerCancel={handleImagePointerCancel}
                handleImagePointerLeave={handleImagePointerLeave}
                handleArrowPrevClick={handleArrowPrevClick}
                handleArrowNextClick={handleArrowNextClick}
              />
            </div>

            <div className="lg:col-span-5">
              <ProductInfo
                product={product}
                variants={variants}
                selectedVariantIndex={selectedVariantIndex}
                selectedVariant={selectedVariant}
                selectedSizeId={selectedSizeId}
                quantity={quantity}
                selectedStock={selectedStock}
                displayPrice={displayPrice}
                originalPrice={originalPrice}
                ratingAverage={ratingAverage}
                ratingCount={ratingCount}
                formatPrice={formatPrice}
                handlePreviewVariant={handlePreviewVariant}
                handleChangeVariant={handleChangeVariant}
                setSelectedSizeId={setSelectedSizeId}
                setSizeChartOpen={setSizeChartOpen}
                setQuantity={setQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleAddToCart={handleAddToCart}
                addingToCart={addingToCart}
              />
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

            <ProductReviews
              user={user}
              ratingAverage={ratingAverage}
              ratingCount={ratingCount}
              reviews={reviews}
              reviewPagination={reviewPagination}
              loadingReviews={loadingReviews}
              submittingReview={submittingReview}
              reviewRating={reviewRating}
              setReviewRating={setReviewRating}
              reviewContent={reviewContent}
              setReviewContent={setReviewContent}
              handleCreateReview={handleCreateReview}
            />
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
