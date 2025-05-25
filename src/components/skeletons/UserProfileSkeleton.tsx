import { SkeletonCard, SkeletonText, SkeletonCircle, SkeletonButton } from "@/components/ui/skeleton-enhanced"

export function UserProfileSkeleton() {
  return (
    <SkeletonCard>
      <div className="p-6 space-y-6">
        {/* Header with avatar and name */}
        <div className="flex items-center space-x-4">
          <SkeletonCircle size="xl" />
          <div className="space-y-2">
            <SkeletonText height="lg" width="xl" customWidth="12rem" />
            <SkeletonText height="sm" width="lg" customWidth="8rem" />
          </div>
        </div>
        
        {/* User details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <SkeletonText height="xs" width="md" customWidth="6rem" />
            <SkeletonText height="md" width="xl" customWidth="12rem" />
          </div>
          <div className="space-y-2">
            <SkeletonText height="xs" width="md" customWidth="6rem" />
            <SkeletonText height="md" width="xl" customWidth="12rem" />
          </div>
          <div className="space-y-2">
            <SkeletonText height="xs" width="md" customWidth="6rem" />
            <SkeletonText height="md" width="xl" customWidth="12rem" />
          </div>
          <div className="space-y-2">
            <SkeletonText height="xs" width="md" customWidth="6rem" />
            <SkeletonText height="md" width="xl" customWidth="12rem" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 text-center">
            <SkeletonText height="lg" width="full" />
            <SkeletonText height="xs" width="full" />
          </div>
          <div className="space-y-2 text-center">
            <SkeletonText height="lg" width="full" />
            <SkeletonText height="xs" width="full" />
          </div>
          <div className="space-y-2 text-center">
            <SkeletonText height="lg" width="full" />
            <SkeletonText height="xs" width="full" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <SkeletonButton width="md" customWidth="6rem" />
          <SkeletonButton width="md" customWidth="6rem" />
        </div>
      </div>
    </SkeletonCard>
  )
}
