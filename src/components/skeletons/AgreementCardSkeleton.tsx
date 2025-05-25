import { SkeletonCard, SkeletonText, SkeletonCircle, SkeletonButton } from "@/components/ui/skeleton-enhanced"

interface AgreementCardSkeletonProps {
  className?: string
}

export function AgreementCardSkeleton({ className }: AgreementCardSkeletonProps) {
  return (
    <SkeletonCard className={className}>
      <div className="flex flex-col space-y-4">
        {/* Header with title and status */}
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <SkeletonText height="md" width="3/4" />
            <SkeletonText height="xs" width="1/3" />
          </div>
          <SkeletonCircle size="sm" />
        </div>
        
        {/* Description */}
        <div className="space-y-1.5">
          <SkeletonText height="sm" />
          <SkeletonText height="sm" />
        </div>
        
        {/* Date and metadata */}
        <div className="flex justify-between items-center">
          <SkeletonText height="xs" width="1/3" />
          <SkeletonText height="xs" width="1/4" />
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <SkeletonButton width="1/4" />
          <SkeletonButton width="1/4" />
        </div>
      </div>
    </SkeletonCard>
  )
}

export function AgreementCardSkeletonList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AgreementCardSkeleton />
      <AgreementCardSkeleton />
      <AgreementCardSkeleton />
    </div>
  )
}
