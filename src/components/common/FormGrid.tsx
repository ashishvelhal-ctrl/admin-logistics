interface FormGridProps {
  children: React.ReactNode;
  className?: string;
  gap?: string;
}

export default function FormGrid({
  children,
  className = "",
  gap = "gap-4",
}: FormGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${gap} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
