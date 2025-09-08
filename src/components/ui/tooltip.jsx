import React from "react";

export const TooltipProvider = ({ children }) => <>{children}</>;
export const Tooltip = ({ children }) => <>{children}</>;
export const TooltipTrigger = ({ children, asChild, ...props }) =>
  asChild ? React.cloneElement(children, props) : <span {...props}>{children}</span>;
export const TooltipContent = ({ children, className = "" }) => <div className={className}>{children}</div>;
