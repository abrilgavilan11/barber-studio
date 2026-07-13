import React from "react";

interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

export default function Title({ children, level = 2, className = "" }: TitleProps) {
  const baseStyles = "font-bold text-foreground font-['Merriweather_Sans']";
  
  const sizes = {
    1: "text-4xl sm:text-5xl mb-4",
    2: "text-3xl sm:text-4xl mb-4",
    3: "text-2xl mb-3",
    4: "text-xl mb-2",
  };

  const Tag = `h${level}` as React.ElementType;

  return (
    <Tag className={`${baseStyles} ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
}