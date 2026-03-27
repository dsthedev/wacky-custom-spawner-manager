import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300",
      {
        "bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900": variant === "default",
        "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50": variant === "secondary",
        "bg-red-500 text-slate-50 dark:bg-red-900 dark:text-red-50": variant === "destructive",
        "border border-slate-200 text-slate-950 dark:border-slate-800 dark:text-slate-50": variant === "outline",
      },
      className
    )}
    {...props}
  />
))
Badge.displayName = "Badge"

export { Badge }
