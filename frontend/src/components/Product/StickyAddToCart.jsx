import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/Button";

const StickyAddToCart = ({ price, selectedSize }) => {
  return (
    <div className="sticky bottom-0 z-40 lg:hidden border-t bg-white/80 backdrop-blur-md p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-black">${price}</span>
        <Button className="bg-black text-white px-6 py-3 rounded-full flex gap-2">
          <ShoppingCart size={18} /> Mua ngay
        </Button>
      </div>
    </div>
  );
};

export default StickyAddToCart;
