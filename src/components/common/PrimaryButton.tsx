import { Button } from "@/components/ui/button";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-11 min-w-52 bg-icon-1-color hover:bg-icon-1-color/90 text-white rounded-lg transition-colors text-sm font-medium ${className}`.trim()}
    >
      {children}
    </Button>
  );
}
