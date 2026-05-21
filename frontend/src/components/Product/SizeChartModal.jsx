import { X } from "lucide-react";

const sizeRows = [
  { size: "S", foot: "22 - 23 cm", eu: "36 - 37" },
  { size: "M", foot: "23.5 - 25 cm", eu: "38 - 40" },
  { size: "L", foot: "25.5 - 27 cm", eu: "41 - 43" },
  { size: "XL", foot: "27.5 - 29 cm", eu: "44 - 46" },
];

const SizeChartModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
        aria-label="Đóng bảng size"
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Size chart</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Chiều dài chân</th>
                <th className="px-4 py-3 font-semibold">EU tham khảo</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sizeRows.map((row) => (
                <tr key={row.size}>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {row.size}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.foot}</td>
                  <td className="px-4 py-3 text-gray-700">{row.eu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs leading-5 text-gray-500">
          Bảng size chỉ mang tính tham khảo. Nên đo chiều dài chân vào cuối ngày
          và chọn lớn hơn nếu nằm giữa hai size.
        </p>
      </div>
    </div>
  );
};

export default SizeChartModal;
