"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function Popover({
  children,
  className,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<"div"> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Use external state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Close popover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen }}>
      <div
        ref={popoverRef}
        data-slot="popover"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  const popoverContext = React.useContext(PopoverContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...props,
      type: "button",
      onClick: (e: React.MouseEvent) => {
        const originalOnClick = (children as React.ReactElement<any>).props
          .onClick;
        originalOnClick?.(e);
        popoverContext?.setOpen(!popoverContext?.open);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="popover-trigger"
      onClick={() => popoverContext?.setOpen(!popoverContext?.open)}
      {...props}
    >
      {children}
    </button>
  );
}

function PopoverContent({
  className,
  children,
  align = "center",
  side = "bottom",
  sideOffset = 4,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}) {
  const popoverContext = React.useContext(PopoverContext);

  if (!popoverContext?.open) return null;

  const getPositionStyle = () => {
    const base: React.CSSProperties = {
      position: "absolute",
    };

    switch (side) {
      case "top":
        return {
          ...base,
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginBottom: sideOffset,
        };
      case "bottom":
        return {
          ...base,
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: sideOffset,
        };
      case "left":
        return {
          ...base,
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginRight: sideOffset,
        };
      case "right":
        return {
          ...base,
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          marginLeft: sideOffset,
        };
      default:
        return {
          ...base,
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: sideOffset,
        };
    }
  };

  return (
    <div
      data-slot="popover-content"
      style={getPositionStyle()}
      className={cn(
        "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function PopoverAnchor({ ...props }: React.ComponentProps<"div">) {
  return <div data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
