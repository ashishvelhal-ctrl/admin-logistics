import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ListHeaderProps {
  title: string;
  description: string;
  addButtonText?: string;
  onAdd?: () => void;
}

export function ListHeader({
  title,
  description,
  addButtonText = "Add",
  onAdd,
}: ListHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl text-heading-color font-bold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {onAdd && (
        <div className="pt-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-icon-text hover:text-white"
            onClick={onAdd}
          >
            <Plus size={16} />
            {addButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}
