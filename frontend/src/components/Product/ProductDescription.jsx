import { Check } from "lucide-react";
import useScrollReveal from "../../hooks/useScrollReveal";

const ProductDescription = ({ description, features }) => {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      className="bg-gray-50 py-16 opacity-0 transition-opacity duration-700"
    >
      <div className="container max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Thông tin sản phẩm</h2>
        <p className="text-gray-600 leading-relaxed mb-8">{description}</p>

        <h3 className="text-lg font-semibold mb-4">Đặc điểm nổi bật</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-green-600" />
              </span>
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProductDescription;
