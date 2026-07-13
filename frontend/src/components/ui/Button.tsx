import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all font-medium cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-primary-foreground text-white hover:bg-primary/90 shadow-md hover:shadow-lg transform hover:scale-105",
    outline: "border-2 border-primary text-primary hover:bg-primary text-primary-foreground hover:text-white",
    ghost: "bg-transparent text-primary hover:bg-secondary/50",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}