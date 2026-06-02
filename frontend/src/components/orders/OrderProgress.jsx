import React from 'react';
import { Check, House, Truck } from "lucide-react";
import { ORDER_PROGRESS_STEPS, ORDER_STATUS_LABELS } from "../../constants/order.constants";

const steps = [
  {
    key: ORDER_PROGRESS_STEPS[0],
    label: ORDER_STATUS_LABELS[ORDER_PROGRESS_STEPS[0]],
    icon: Check,
  },
  {
    key: ORDER_PROGRESS_STEPS[1],
    label: ORDER_STATUS_LABELS[ORDER_PROGRESS_STEPS[1]],
    icon: Check,
  },
  {
    key: ORDER_PROGRESS_STEPS[2],
    label: ORDER_STATUS_LABELS[ORDER_PROGRESS_STEPS[2]],
    icon: Truck,
  },
  {
    key: ORDER_PROGRESS_STEPS[3],
    label: ORDER_STATUS_LABELS[ORDER_PROGRESS_STEPS[3]],
    icon: House,
  },
];

const OrderProgress = ({ currentStep }) => {
  return (
    <div className="border border-zinc-200 bg-white p-8">
      <h2 className="mb-8 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
        Tiến trình đơn hàng
      </h2>

      <div className="hidden items-start justify-between sm:flex relative">
        <div className="absolute left-[calc(12.5%)] right-[calc(12.5%)] top-5 h-px bg-zinc-200"></div>

        <div
          className="absolute left-[calc(12.5%)] top-5 h-px bg-teal-600 transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 75}%`,
          }}
        ></div>

        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          const isActive = index <= currentStep;

          return (
            <div
              key={step.key}
              className="relative z-10 flex w-1/4 flex-col items-center"
            >
              <div
                className={`flex size-10 items-center justify-center transition-all duration-300 ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : "bg-zinc-50 text-zinc-400"
                } ${isCurrent ? "ring-1 ring-teal-600 ring-offset-2" : ""}`}
              >
                {isDone ? (
                  <Check className="size-5" />
                ) : (
                  <StepIcon className="size-5" />
                )}
              </div>

              <p
                className={`mt-4 text-[10px] font-black uppercase tracking-widest ${
                  isCurrent ? "text-teal-600" : "text-zinc-950"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-0 sm:hidden">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          const isActive = index <= currentStep;

          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center transition-all ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "bg-zinc-50 text-zinc-400"
                  } ${isCurrent ? "ring-1 ring-teal-600 ring-offset-2" : ""}`}
                >
                  {isDone ? (
                    <Check className="size-4" />
                  ) : (
                    <StepIcon className="size-4" />
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`min-h-[28px] w-px flex-1 ${
                      index < currentStep ? "bg-teal-600" : "bg-zinc-200"
                    }`}
                  />
                )}
              </div>

              <div className="pb-6">
                <p
                  className={`text-[10px] font-black uppercase tracking-widest mt-2 ${
                    isCurrent
                      ? "text-teal-600"
                      : isActive
                        ? "text-zinc-950"
                        : "text-zinc-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgress;
