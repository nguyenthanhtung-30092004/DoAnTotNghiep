import { CheckCircle, XCircle } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const status = searchParams.get("status");
  const method = searchParams.get("method");
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  const isSuccess = status === "success";

  useEffect(() => {
    if (isSuccess) {
      dispatch({ type: "cart/clearCartRedux" });
      localStorage.removeItem("guest_cart");
    }
  }, [isSuccess, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-soft px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-card">
        <div className="mb-5 flex justify-center">
          {isSuccess ? (
            <CheckCircle className="size-16 text-green-500" />
          ) : (
            <XCircle className="size-16 text-red-500" />
          )}
        </div>

        <h1 className="text-2xl font-bold">
          {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Phương thức: {method || "Không xác định"}
        </p>

        {orderId && (
          <p className="mt-1 text-sm text-muted-foreground">
            Mã đơn: {orderId}
          </p>
        )}

        {message && (
          <p className="mt-1 text-sm text-muted-foreground">Lý do: {message}</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {user && (
            <Link
              to="/account?tab=orders"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground"
            >
              Xem đơn hàng
            </Link>
          )}

          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 font-semibold"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
