import { Button } from "@/components/ui/button";

interface FormActionRowProps {
  primaryLabel: string;
  cancelLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onCancel: () => void;
  onPrimaryClick?: () => void;
  primaryType?: "button" | "submit";
  className?: string;
}

export function FormActionRow({
  primaryLabel,
  cancelLabel = "Cancel",
  loadingLabel,
  isLoading = false,
  disabled = false,
  onCancel,
  onPrimaryClick,
  primaryType = "submit",
  className = "",
}: FormActionRowProps) {
  return (
    <div className={`mt-10 flex justify-end gap-3 ${className}`.trim()}>
      <Button
        type={primaryType}
        onClick={onPrimaryClick}
        disabled={disabled || isLoading}
        className="h-11 min-w-52 bg-icon-1-color hover:bg-icon-1-color/90 text-white"
      >
        {isLoading && loadingLabel ? loadingLabel : primaryLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-11 min-w-24 border-border-stroke text-icon-text hover:bg-gray-50"
      >
        {cancelLabel}
      </Button>
    </div>
  );
}
