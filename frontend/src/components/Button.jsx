import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function Button({ children, isPrimary = true, className, ...props }) {
  return (
    <button
      className={twMerge(
        clsx(
          "rounded-md py-2 px-4 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer disabled:opacity-50 flex items-center gap-2",
          isPrimary
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
            : "bg-white text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        ),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
