import { Star } from "lucide-react";

const RatingStars = ({ value = 0, onChange, size = "h-4 w-4" }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        if (onChange) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="transition hover:scale-110"
            >
              <Star
                className={`${size} ${
                  active
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          );
        }

        return (
          <Star
            key={star}
            className={`${size} ${
              active ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
