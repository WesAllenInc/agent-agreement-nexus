import type { ButtonHTMLAttributes } from "react"
import { forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-primary-foreground hover:bg-primary-600 active:bg-primary-700",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/100",
        outline:
          "border border-input bg-background hover:bg-accent-50 hover:text-accent-600 active:bg-accent-100",
        secondary:
          "bg-secondary-500 text-secondary-foreground hover:bg-secondary-600 active:bg-secondary-700",
        ghost: "hover:bg-accent-50 hover:text-accent-600 active:bg-accent-100",
        link: "text-primary-500 underline-offset-4 hover:underline hover:text-primary-600",
        // New variants using design tokens
        accent: "bg-accent-500 text-accent-foreground hover:bg-accent-600 active:bg-accent-700",
        glass: "glass hover:glass-md active:glass-lg text-foreground",
        'glass-primary': "glass-primary hover:bg-primary-500/20 active:bg-primary-500/30 text-primary-700 dark:text-primary-300",
        'glass-accent': "glass-accent hover:bg-accent-500/20 active:bg-accent-500/30 text-accent-700 dark:text-accent-300",
        gradient: "bg-primary-to-accent text-white hover:brightness-105 active:brightness-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-12 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
        'icon-sm': "h-8 w-8",
        'icon-lg': "h-12 w-12",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        ping: "animate-ping",
        'fade-in': "animate-fade-in",
        'fade-up': "animate-fade-up",
        'slide-in': "animate-slide-in",
        float: "animate-float",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        DEFAULT: "shadow",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        '2xl': "shadow-2xl",
        'primary-sm': "shadow-primary-sm",
        'primary-md': "shadow-primary-md",
        'primary-lg': "shadow-primary-lg",
        'accent-sm': "shadow-accent-sm",
        'accent-md': "shadow-accent-md",
        'accent-lg': "shadow-accent-lg",
        elevation: "shadow-elevation-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      shadow: "none",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, shadow, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, shadow, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

