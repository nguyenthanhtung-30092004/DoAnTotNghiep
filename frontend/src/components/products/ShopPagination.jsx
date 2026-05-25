import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/Button";

const ShopPagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 ${
            p === page ? "bg-[#22C55E] hover:bg-[#1da850] text-white" : ""
          }`}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShopPagination;
