import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import orderService from "../../services/order.service";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price || 0));
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN");
};

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderDetail(orderId);
        const data = getResponseData(res);
        setOrder(data?.order || data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Lấy chi tiết đơn hàng thất bại",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center text-slate-500">
        <Loader2 className="mr-2 size-5 animate-spin" />
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <Link to="/admin/orders" className="text-sm text-indigo-600">
          Quay lại đơn hàng
        </Link>
        <div className="mt-4 rounded-xl border bg-white p-8 text-center text-sm text-slate-500">
          Không tìm thấy đơn hàng.
        </div>
      </div>
    );
  }

  const address = order.shippingAddress || {};
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="space-y-6">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="size-4" />
        Quay lại đơn hàng
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Đơn hàng {order.orderCode}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Tạo lúc {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-sm text-slate-600">
            <p>Trạng thái: {order.orderStatus}</p>
            <p>Thanh toán: {order.paymentMethod} / {order.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-slate-900">Sản phẩm</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.product}-${item.sizeId}-${index}`}
                  className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {item.productThumbnail ? (
                      <img
                        src={item.productThumbnail}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.color} / Size {item.size} / SL {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.itemTotal)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-slate-900">Khách hàng</h2>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">
                {address.fullName || order.user?.fullName || order.user?.name}
              </p>
              <p>{order.user?.email}</p>
              <p>{address.phone}</p>
              <p>
                {address.detailAddress}, {address.ward}, {address.district},{" "}
                {address.province}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-slate-900">Tổng tiền</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Tạm tính</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giảm giá</span>
                <span>-{formatPrice(order.totalDiscount + order.couponDiscount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vận chuyển</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              <div className="border-t pt-3 font-bold">
                <div className="flex justify-between">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(order.finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
