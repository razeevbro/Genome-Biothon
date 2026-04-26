import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none",
          selected
            ? "bg-dietPrimary text-white shadow-sm"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Chip.displayName = "Chip";

export { Chip };
