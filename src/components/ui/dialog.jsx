import React from "react";

/* Minimal modal system used by your pages.
   - Dialog({open, onOpenChange, children}) renders children when open === true
   - DialogContent/DialogHeader/DialogTitle are simple wrappers
*/
export function Dialog({ open = false, onOpenChange = () => {}, children }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">{children}</div>;
}

export const DialogContent = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${className}`}>{children}</div>
);
export const DialogHeader = ({ children }) => <div className="mb-2">{children}</div>;
export const DialogTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-bold ${className}`}>{children}</h3>
);
