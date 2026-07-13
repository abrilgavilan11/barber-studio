interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden ${className}`}>
      {children}
    </div>
  );
}