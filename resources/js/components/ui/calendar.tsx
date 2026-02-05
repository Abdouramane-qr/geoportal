import * as React from "react";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<"input"> & {
  wrapperClassName?: string;
};

function Calendar({ className, wrapperClassName, type, ...props }: CalendarProps) {
  return (
    <div className={cn("p-3", wrapperClassName)}>
      <input
        type={type ?? "date"}
        className={cn(
          "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring",
          className,
        )}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
