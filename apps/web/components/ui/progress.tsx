"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "~/lib/trpc"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        `
          relative
          flex
          h-2
          w-full
          items-center
          overflow-hidden
          rounded-none
          border
          border-zinc-700
          bg-black
        `,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="
          h-full
          w-full
          bg-white
          transition-all
          duration-300
        "
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }