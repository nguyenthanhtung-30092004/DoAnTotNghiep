import { useEffect, useRef } from "react";

/**
 * Hook giúp tạo hiệu ứng xuất hiện (reveal) khi người dùng cuộn trang đến phần tử.
 * Sử dụng IntersectionObserver để tối ưu hiệu năng.
 */
export const useScrollReveal = () => {
  // Loại bỏ <HTMLElement> (TypeScript)
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Khởi tạo observer để theo dõi khi phần tử đi vào viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Khi phần tử xuất hiện 15% (threshold: 0.15), thực hiện animation hiện lên
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.filter = "blur(0px)";

          // Sau khi hiện lên thì ngừng theo dõi để tiết kiệm tài nguyên
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.15, // Kích hoạt khi 15% diện tích phần tử hiện ra
      },
    );

    // Thiết lập trạng thái ban đầu (ẩn đi)
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.filter = "blur(4px)";

    // Cấu hình transition bằng CSS để hiệu ứng mượt mà (Ease-out)
    el.style.transition = `
      opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), 
      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), 
      filter 0.7s cubic-bezier(0.16, 1, 0.3, 1)
    `;

    // Bắt đầu theo dõi phần tử
    observer.observe(el);

    // Dọn dẹp (Cleanup) khi component unmount
    return () => observer.disconnect();
  }, []);

  return ref;
};

export default useScrollReveal;
