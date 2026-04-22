import { Star, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

const ReviewForm = ({ productName, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Vui lòng chọn sao!");
    onSubmit({ rating, title, text });
  };

  return (
    <div className="bg-white rounded-2xl border p-6 shadow-lg">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-lg">Viết đánh giá cho {productName}</h3>
        <button onClick={onCancel}>
          <X />
        </button>
      </div>

      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`cursor-pointer ${n <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
            onClick={() => setRating(n)}
          />
        ))}
      </div>

      <input
        className="w-full border rounded-lg p-2 mb-3"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border rounded-lg p-2 mb-4"
        placeholder="Nội dung..."
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} className="px-4 py-2">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
