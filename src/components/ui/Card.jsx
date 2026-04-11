import React from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className }) => (
  <div className={cn(
    "bg-white rounded-[12px] border border-gray-200 shadow-[0_4px_6px_rgba(0,0,0,0.05)] p-6",
    className
  )}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn("flex items-center gap-3 mb-6", className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn(
    "text-[14px] font-bold text-[#2E7D32] uppercase tracking-wider font-['Roboto',_sans-serif]",
    className
  )}>
    {children}
  </h3>
);
