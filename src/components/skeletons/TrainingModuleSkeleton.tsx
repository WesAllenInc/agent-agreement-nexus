import { SkeletonCard, SkeletonText, Skeleton } from "@/components/ui/skeleton-enhanced"

interface TrainingModuleSkeletonProps {
  className?: string
}

export function TrainingModuleCardSkeleton({ className }: TrainingModuleSkeletonProps) {
  return (
    <SkeletonCard className={className}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <SkeletonText height="md" width="2/3" />
            <SkeletonText height="xs" width="1/3" />
          </div>
          <Skeleton variant="circular" width="md" height="md" />
        </div>
        
        <div className="space-y-2">
          <SkeletonText height="sm" />
          <SkeletonText height="sm" width="3/4" />
        </div>
        
        <div className="space-y-2">
          <SkeletonText height="xs" width="1/4" />
          <Skeleton height="md" className="w-full rounded-md" />
        </div>
        
        <div className="flex justify-end">
          <SkeletonText height="md" width="1/4" />
        </div>
      </div>
    </SkeletonCard>
  )
}

export function TrainingModuleListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TrainingModuleCardSkeleton />
      <TrainingModuleCardSkeleton />
      <TrainingModuleCardSkeleton />
    </div>
  )
}

export function TrainingMaterialSkeleton() {
  return (
    <SkeletonCard>
      <div className="p-4 space-y-4">
        <SkeletonText height="lg" width="2/3" />
        
        <div className="flex items-center space-x-2">
          <Skeleton variant="circular" width="sm" height="sm" />
          <SkeletonText height="sm" width="1/4" />
        </div>
        
        <div className="border rounded-md p-4 space-y-4">
          <div className="aspect-video w-full">
            <Skeleton variant="rectangular" className="h-full w-full" />
          </div>
          
          <div className="space-y-2">
            <SkeletonText height="md" />
            <SkeletonText height="md" />
            <SkeletonText height="md" width="3/4" />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <SkeletonText height="md" width="1/4" />
          <SkeletonText height="md" width="1/4" />
        </div>
      </div>
    </SkeletonCard>
  )
}

export function TrainingManagerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SkeletonText height="lg" width="1/3" />
        <Skeleton variant="rectangular" height="md" width="md" customWidth="8rem" className="rounded-md" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard>
          <div className="p-4 space-y-4">
            <SkeletonText height="md" width="1/2" />
            
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton variant="circular" width="sm" height="sm" />
                  <SkeletonText height="sm" width="2/3" className="flex-1" />
                  <Skeleton variant="rectangular" width="sm" height="sm" customWidth="4rem" className="rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </SkeletonCard>
        
        <SkeletonCard>
          <div className="p-4 space-y-4">
            <SkeletonText height="md" width="1/2" />
            
            <div className="space-y-2">
              <SkeletonText height="sm" />
              <SkeletonText height="sm" />
              <SkeletonText height="sm" width="3/4" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Skeleton variant="rectangular" height="xl" customHeight="8rem" className="rounded-md" />
              <Skeleton variant="rectangular" height="xl" customHeight="8rem" className="rounded-md" />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Skeleton variant="rectangular" height="md" width="md" customWidth="6rem" className="rounded-md" />
              <Skeleton variant="rectangular" height="md" width="md" customWidth="6rem" className="rounded-md" />
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  )
}
