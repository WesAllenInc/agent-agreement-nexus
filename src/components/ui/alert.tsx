import { forwardRef, type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground transition-all",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-success-100 bg-success-50 text-success-900 dark:bg-success-900/10 dark:text-success-100 dark:border-success-900/30 [&>svg]:text-success-500",
        warning: "border-warning-100 bg-warning-50 text-warning-900 dark:bg-warning-900/10 dark:text-warning-100 dark:border-warning-900/30 [&>svg]:text-warning-500",
        info: "border-info-100 bg-info-50 text-info-900 dark:bg-info-900/10 dark:text-info-100 dark:border-info-900/30 [&>svg]:text-info-500",
        primary: "border-primary-100 bg-primary-50 text-primary-900 dark:bg-primary-900/10 dark:text-primary-100 dark:border-primary-900/30 [&>svg]:text-primary-500",
        accent: "border-accent-100 bg-accent-50 text-accent-900 dark:bg-accent-900/10 dark:text-accent-100 dark:border-accent-900/30 [&>svg]:text-accent-500",
        secondary: "border-secondary-100 bg-secondary-50 text-secondary-900 dark:bg-secondary-900/10 dark:text-secondary-100 dark:border-secondary-900/30 [&>svg]:text-secondary-500",
        glass: "glass border-transparent backdrop-blur-md [&>svg]:text-foreground",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        DEFAULT: "shadow",
        md: "shadow-md",
        elevation: "shadow-elevation-2",
      },
      animation: {
        none: "",
        'fade-in': "animate-fade-in",
        'fade-up': "animate-fade-up",
        'slide-in': "animate-slide-in",
        'pulse-border': "animate-pulse-border",
      },
    },
    defaultVariants: {
      variant: "default",
      shadow: "none",
      animation: "none",
    },
  }
)

const Alert = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, shadow, animation, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant, shadow, animation }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight text-base", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed opacity-90", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

