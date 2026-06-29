import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-neutral-300 bg-transparent px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-900 disabled:opacity-50 dark:border-neutral-700 dark:focus:border-neutral-300",
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = "Input"
