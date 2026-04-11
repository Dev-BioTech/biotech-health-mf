import React from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const variants = {
    primary: "bg-[#2E7D32] text-white hover:bg-[#60AD5E] shadow-sm",
    secondary: "border border-[#2E7D32] text-[#2E7D32] bg-transparent hover:bg-gray-50",
    ghost: "bg-transparent text-gray-400 hover:text-gray-900",
  };

  const sizes = {
    default: "h-11 px-6 py-2 rounded-[8px]",
    lg: "h-12 px-10 py-3 rounded-[8px] text-[13px]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-bold uppercase tracking-widest text-[11px] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
