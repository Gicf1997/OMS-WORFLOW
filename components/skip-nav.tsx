"use client"

import { forwardRef, type ElementRef, type ComponentPropsWithoutRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const SkipNavLink = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a"> & { contentId?: string }>(
  ({ className, contentId = "skip-nav-content", children = "Saltar al contenido", ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={`#${contentId}`}
        className={cn(
          "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-accent focus:text-accent-foreground focus:p-3 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:top-4 focus:left-4",
          className,
        )}
        {...props}
      >
        {children}
      </a>
    )
  },
)
SkipNavLink.displayName = "SkipNavLink"

const SkipNavContent = forwardRef<ElementRef<"div">, HTMLAttributes<HTMLDivElement> & { id?: string }>(
  ({ className, id = "skip-nav-content", ...props }, ref) => {
    return <div id={id} ref={ref} className={cn("outline-none", className)} tabIndex={-1} {...props} />
  },
)
SkipNavContent.displayName = "SkipNavContent"

export { SkipNavLink, SkipNavContent }
