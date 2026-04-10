import { PencilLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface MobileNetworkCardItem {
  id: string;
  name: string;
  phone: string;
  dateText: string;
  locationText: string;
}

interface MobileNetworkCardListProps {
  items: MobileNetworkCardItem[];
  onRowClick?: (item: MobileNetworkCardItem) => void;
  onEditClick?: (item: MobileNetworkCardItem) => void;
  onDeleteClick?: (item: MobileNetworkCardItem) => void;
  deleteLabel?: string;
  editStyle?: "button" | "icon";
  size?: "compact" | "large";
  emptyMessage?: string;
}

export function MobileNetworkCardList({
  items,
  onRowClick,
  onEditClick,
  onDeleteClick,
  deleteLabel = "Delete user",
  editStyle = "icon",
  size = "compact",
  emptyMessage = "No users found.",
}: MobileNetworkCardListProps) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-border-stroke bg-white px-3 py-4 text-sm text-inactive-text">
        {emptyMessage}
      </div>
    );
  }

  const isLarge = size === "large";

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-xl border border-border-stroke bg-white px-3 ${
            isLarge ? "py-1.5" : "py-1.5"
          } flex items-start justify-between`}
        >
          <button
            type="button"
            className="text-left flex-1"
            onClick={() => onRowClick?.(item)}
          >
            <p
              className={`font-semibold text-heading-color leading-tight ${
                isLarge ? "text-[31px]" : "text-[20px]"
              }`}
            >
              {item.name}
            </p>
            <p
              className={`${isLarge ? "text-sm" : "text-xs"} text-inactive-text mt-0.5`}
            >
              {item.phone}
            </p>
            <p
              className={`${isLarge ? "text-xs mt-1.5" : "text-[11px] mt-1"} text-inactive-text`}
            >
              {item.dateText} • {item.locationText}
            </p>
          </button>

          {editStyle === "button" ? (
            <div className="flex shrink-0 gap-2">
              {onEditClick && (
                <Button
                  size="sm"
                  className="bg-button-1-bg hover:bg-button-1-bg/90 text-icon-1-color"
                  onClick={() => onEditClick(item)}
                >
                  <PencilLine size={12} />
                </Button>
              )}
              {onDeleteClick && (
                <Button
                  size="sm"
                  className="bg-button-2-bg hover:bg-button-2-bg/90 text-icon-2-color"
                  onClick={() => onDeleteClick(item)}
                  aria-label={deleteLabel}
                >
                  <Trash2 size={12} />
                </Button>
              )}
            </div>
          ) : onEditClick ? (
            <button
              type="button"
              className="mt-2 text-icon-1-color"
              onClick={() => onEditClick(item)}
              aria-label="Edit user"
            >
              <PencilLine size={14} />
            </button>
          ) : null}
        </article>
      ))}
    </div>
  );
}
