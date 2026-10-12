import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "bg-primary/10 text-primary border-primary/30",
  secondary: "bg-secondary text-secondary-foreground border-transparent",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
  income: "bg-income/10 text-income border-income/30",
  expense: "bg-expense/10 text-expense border-expense/30",
  business: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  personal: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-income/10 text-income border-income/30",
  outline: "border-border bg-transparent text-foreground",
}

function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
