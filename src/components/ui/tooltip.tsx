"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TooltipProvider = ({ children }) => {
  return <>{children}</>
}

const Tooltip = ({ children }) => {
  return <>{children}</>
}

const TooltipTrigger = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn(className)} {...props} />
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("z-50 rounded-md bg-popover p-2 text-sm text-popover-foreground shadow-md", className)} {...props} />
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
