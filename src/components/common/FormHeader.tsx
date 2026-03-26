import { MoveLeft } from "lucide-react";

interface FormHeaderProps {
  title: string;
  description: string;
  onBack?: () => void;
}

export function FormHeader({ title, description, onBack }: FormHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl text-heading-color font-bold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {onBack && (
        <div className="pt-3">
          <MoveLeft
            className="h-5 w-5 cursor-pointer text-foreground hover:text-muted-foreground"
            onClick={onBack}
          />
        </div>
      )}
    </div>
  );
}
