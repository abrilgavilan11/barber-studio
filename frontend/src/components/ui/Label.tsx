import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  className?: string;
}

export default function Label({ children, className = "", ...props }: LabelProps) {
  return (
    <label 
      className={`block text-sm font-medium text-foreground mb-2 ${className}`} 
      {...props}
    >
      {children}
    </label>
  );
}