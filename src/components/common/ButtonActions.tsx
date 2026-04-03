interface ButtonActionsProps {
  children: React.ReactNode;
  className?: string;
}

export default function ButtonActions({
  children,
  className = "",
}: ButtonActionsProps) {
  return (
    <div className={`flex justify-end gap-3 ${className}`.trim()}>
      {children}
    </div>
  );
}
