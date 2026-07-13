import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`block w-full px-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-card text-card-foreground text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50 disabled:bg-gray-50 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;