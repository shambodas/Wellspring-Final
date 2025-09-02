import React from "react";

export const Button = ({ children, className = "", variant, size, ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2";
  // variant/size are not required here — pages can pass className
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
};
