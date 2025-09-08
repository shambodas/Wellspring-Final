import React from "react";

export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return <textarea ref={ref} className={`border rounded px-3 py-2 ${className}`} {...props} />;
});
Textarea.displayName = "Textarea";
