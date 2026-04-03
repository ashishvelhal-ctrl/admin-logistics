interface DetailSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function DetailSection({
  children,
  className = "",
}: DetailSectionProps) {
  return (
    <div
      className={`border-t border-border-stroke mt-3 pt-4 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
