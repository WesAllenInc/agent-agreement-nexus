import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-shimmer bg-muted relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-shimmer",
  {
    variants: {
      variant: {
        default: "rounded-md",
        circular: "rounded-full",
        rectangular: "rounded-none",
        card: "rounded-lg border border-border",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        "2xl": "",
        full: "w-full",
        auto: "w-auto",
      },
      height: {
        xs: "h-4",
        sm: "h-6",
        md: "h-8",
        lg: "h-12",
        xl: "h-16",
        "2xl": "h-24",
        full: "h-full",
        auto: "h-auto",
      },
      width: {
        xs: "w-4",
        sm: "w-6",
        md: "w-8",
        lg: "w-12",
        xl: "w-16",
        "2xl": "w-24",
        "1/2": "w-1/2",
        "1/3": "w-1/3",
        "2/3": "w-2/3",
        "1/4": "w-1/4",
        "3/4": "w-3/4",
        full: "w-full",
        auto: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "full",
      height: "md",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Custom width in pixels or CSS units
   * Will be applied as a style if provided
   */
  customWidth?: string;
  /**
   * Custom height in pixels or CSS units
   * Will be applied as a style if provided
   */
  customHeight?: string;
}

export function Skeleton({
  className,
  variant,
  size,
  height,
  width,
  customWidth,
  customHeight,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size, height, width, className }))}
      style={{
        ...(customWidth ? { width: customWidth } : {}),
        ...(customHeight ? { height: customHeight } : {}),
        ...props.style
      }}
      {...props}
    />
  )
}

export function SkeletonText({
  className,
  width = "full",
  height = "sm",
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      variant="default"
      width={width}
      height={height}
      className={cn("my-1.5", className)}
      {...props}
    />
  )
}

export function SkeletonCircle({
  className,
  size = "md",
  ...props
}: Omit<SkeletonProps, "width" | "height"> & { size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" }) {
  const sizeToWidthHeight = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-24 h-24",
  }

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeToWidthHeight[size], className)}
      {...props}
    />
  )
}

export function SkeletonCard({
  className,
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      variant="card"
      height="full"
      className={cn("p-6", className)}
      {...props}
    />
  )
}

export function SkeletonButton({
  className,
  width = "auto",
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      variant="default"
      width={width}
      height="md"
      className={cn("rounded-md", className)}
      {...props}
    />
  )
}

export function SkeletonAvatar({
  className,
  size = "md",
  ...props
}: Omit<SkeletonProps, "width" | "height"> & { size?: "xs" | "sm" | "md" | "lg" | "xl" }) {
  const sizeToWidthHeight = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeToWidthHeight[size], className)}
      {...props}
    />
  )
}

export function SkeletonImage({
  className,
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      variant="rectangular"
      height="full"
      width="full"
      className={cn("aspect-video", className)}
      {...props}
    />
  )
}
