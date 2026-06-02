import React from 'react';

const OrderItems = ({ items, formatPrice }) => {
  return (
    <div className="border border-zinc-200 bg-white p-8">
      <h2 className="mb-6 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
        Sản phẩm ({items.length})
      </h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.product}-${item.sizeId}-${index}`}
            className="flex items-center gap-4"
          >
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden border border-zinc-200 bg-zinc-50 text-2xl">
              {item.productThumbnail ? (
                <img
                  src={item.productThumbnail}
                  alt={item.productName}
                  className="h-full w-full object-cover mix-blend-multiply"
                />
              ) : (
                "👟"
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black uppercase tracking-widest text-zinc-950">
                {item.productName}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">
                Size: {item.size} | Màu: {item.color} | SL:{" "}
                {item.quantity}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                SKU: {item.sku}
              </p>
            </div>

            <p className="shrink-0 text-sm font-black text-teal-600">
              {formatPrice(item.itemTotal)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
