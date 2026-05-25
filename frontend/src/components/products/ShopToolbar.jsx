import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

const ShopToolbar = ({
  sort,
  onSortChange,
  onOpenMobileMenu,
  showingProduct,
  totalProduct,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <Button
        variant="outline"
        className="lg:hidden gap-2"
        onClick={onOpenMobileMenu}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Bộ lọc
      </Button>

      <p className="hidden lg:block text-sm text-gray-500">
        Hiển thị{" "}
        <span className="font-medium text-gray-900">{showingProduct}</span> /{" "}
        <span className="font-medium text-gray-900">{totalProduct}</span> sản
        phẩm
      </p>

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 bg-white border">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="oldest">Cũ nhất</SelectItem>
          <SelectItem value="price_asc">Giá: Thấp → Cao</SelectItem>
          <SelectItem value="price_desc">Giá: Cao → Thấp</SelectItem>
          <SelectItem value="name_asc">Tên: A → Z</SelectItem>
          <SelectItem value="name_desc">Tên: Z → A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ShopToolbar;
