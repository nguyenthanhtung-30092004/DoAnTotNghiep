import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const RelatedProducts = ({ products }) => {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-16 bg-gray-50 opacity-0 transition-opacity duration-700"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Có thể bạn sẽ thích</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-transparent hover:border-gray-200"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                {p.image}
              </div>
              <div className="p-4 space-y-1.5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  {p.brand}
                </p>
                <h3 className="font-semibold text-sm line-clamp-1">{p.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs font-medium">{p.rating}</span>
                  <span className="text-xs text-gray-400">({p.reviews})</span>
                </div>
                <p className="font-bold text-lg">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
