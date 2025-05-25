import type { HTMLAttributes } from "react"
import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground transition-all",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        outline: "border-border bg-transparent",
        glass: "glass border-transparent",
        'glass-primary': "glass-primary border-transparent",
        'glass-accent': "glass-accent border-transparent",
        'glass-secondary': "glass-secondary border-transparent",
        primary: "bg-primary-50 border-primary-100 dark:bg-primary-950 dark:border-primary-900",
        accent: "bg-accent-50 border-accent-100 dark:bg-accent-950 dark:border-accent-900",
        secondary: "bg-secondary-50 border-secondary-100 dark:bg-secondary-950 dark:border-secondary-900",
        destructive: "bg-destructive/10 border-destructive/20 text-destructive dark:text-destructive-foreground",
        gradient: "bg-primary-to-accent border-transparent text-white",
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
      animation: {
        none: "",
        'fade-in': "animate-fade-in",
        'fade-up': "animate-fade-up",
        'slide-in': "animate-slide-in",
        float: "animate-float",
      },
      hover: {
        none: "",
        scale: "hover:scale-[1.02] active:scale-[0.98]",
        shadow: "hover:shadow-lg",
        border: "hover:border-primary-300 dark:hover:border-primary-700",
        brightness: "hover:brightness-105 active:brightness-95",
      },
    },
    defaultVariants: {
      variant: "default",
      shadow: "sm",
      animation: "none",
      hover: "none",
    },
  }
)

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, shadow, animation, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, shadow, animation, hover, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-h2 font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
