import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import Header from "../components/Headers/Header";
import ProductInfo from "../components/Product/ProductInfo";
import ProductGallery from "../components/Product/ProductGallery";
import ProductDescription from "../components/Product/ProductDescription";
import ProductReviews from "../components/Product/ProductReviews";
import RelatedProducts from "../components/Product/RelatedProducts";
import StickyAddToCart from "../components/Product/StickyAddToCart";
import shoe1 from "../assets/shoe1.png"

// Mock Data
const productData = {
  id: 5,
  name: "Giày Chạy Trail Nam Altra Lone Peak 8 - Lime",
  brand: "Altra",
  price: "592,500₫",
  originalPrice: 219,
  rating: 4.9,
  reviewCount: 512,
  images: [
    shoe1,
  ],
  sizes: [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5],
  description:
    "The VelocityMax 3 is engineered for runners who demand peak performance...",
  features: [
    "ReactFoam™ midsole",
    "Carbon-fiber plate",
    "Continental™ rubber outsole",
  ],
  reviews: [
    {
      id: 1,
      name: "Marcus Chen",
      initials: "MC",
      rating: 5,
      date: "2 weeks ago",
      title: "Best marathon shoe",
      text: "Incredible energy return.",
      verified: true,
    },
  ],
  related: [
    {
      id: 1,
      name: "AeroStride Pro",
      brand: "RunVault",
      price: 159,
      rating: 4.8,
      reviews: 342,
      image: "🏃",
    },
  ],
  colors: [
    {
      name: "Lime",
      value: "#B7E4C7",
    },
    {
      name: "Black",
      value: "#111827",
    },
    {
      name: "Orange",
      value: "#F97316",
    },
  ]
};

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-[120px]">
        <div className="container py-4">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/shop" className="hover:text-black transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-black font-medium">{productData.name}</span>
          </nav>
        </div>

        <div className="container pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <ProductGallery
              images={productData.images}
              name={productData.name}
            />
            <ProductInfo
              product={productData}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              quantity={quantity}
              onQuantityChange={setQuantity}
            />
          </div>
        </div>

        <ProductDescription
          description={productData.description}
          features={productData.features}
        />
        <ProductReviews
          reviews={productData.reviews}
          rating={productData.rating}
          reviewCount={productData.reviewCount}
        />
        <RelatedProducts products={productData.related} />
      </main>

      <StickyAddToCart
        productId={productData.id}
        name={productData.name}
        price={productData.price}
        selectedSize={selectedSize}
      />
    </div>
  );
};

export default ProductDetail;
