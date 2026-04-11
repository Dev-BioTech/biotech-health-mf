import React from 'react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Label = ({ children, className, ...props }) => (
  <label
    className={cn(
      "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 inline-block px-1",
      className
    )}
    {...props}
  >
    {children}
  </label>
);
