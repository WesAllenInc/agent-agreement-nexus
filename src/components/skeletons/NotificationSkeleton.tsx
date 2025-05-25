import { SkeletonText, SkeletonCircle } from "@/components/ui/skeleton-enhanced"

export function NotificationItemSkeleton() {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-md">
      <SkeletonCircle size="sm" />
      <div className="space-y-1 flex-1">
        <SkeletonText height="sm" width="full" />
        <SkeletonText height="xs" width="2/3" />
      </div>
      <SkeletonText height="xs" width="sm" customWidth="4rem" />
    </div>
  )
}

export function NotificationListSkeleton() {
  return (
    <div className="w-full max-w-sm p-2 space-y-1">
      <div className="flex justify-between items-center px-3 py-2">
        <SkeletonText height="md" width="md" customWidth="6rem" />
        <SkeletonText height="xs" width="sm" customWidth="4rem" />
      </div>
      <div className="divide-y">
        <NotificationItemSkeleton />
        <NotificationItemSkeleton />
        <NotificationItemSkeleton />
        <NotificationItemSkeleton />
      </div>
      <div className="pt-2 px-3">
        <SkeletonText height="sm" width="full" />
      </div>
    </div>
  )
}

export function NotificationBadgeSkeleton() {
  return (
    <div className="relative">
      <SkeletonCircle size="md" />
      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-muted animate-shimmer relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-shimmer" />
    </div>
  )
}
