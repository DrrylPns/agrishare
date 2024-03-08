import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ToggleIcon?: string | JSX.Element;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ToggleIcon, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            "z-0 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />

        {ToggleIcon && (
          <span className="flex justify-end -mt-10 ml-[235px] lg:ml-[315px] xl:ml-[415px] z-0 w-fit">{ToggleIcon}</span>
        )}
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }
