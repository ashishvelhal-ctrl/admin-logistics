import { MoveLeft } from "lucide-react";

interface FormHeaderProps {
  title: string;
  description: string;
  onBack?: () => void;
  backText?: string;
}

export function FormHeader({
  title,
  description,
  onBack,
  backText = "Back to Promoter List",
}: FormHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-xl md:text-2xl text-heading-color font-bold text-foreground">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {onBack && (
        <div
          className="pt-3 flex items-center gap-2 cursor-pointer"
          onClick={onBack}
        >
          <MoveLeft className="h-4 w-4 md:h-5 md:w-5 back-button-color" />
          <span className="text-xs md:text-sm back-button-color">
            {backText}
          </span>
        </div>
      )}
    </div>
  );
}
