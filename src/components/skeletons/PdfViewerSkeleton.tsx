import { SkeletonCard, Skeleton } from "@/components/ui/skeleton-enhanced"

interface PdfViewerSkeletonProps {
  className?: string
}

export function PdfViewerSkeleton({ className }: PdfViewerSkeletonProps) {
  return (
    <SkeletonCard className={className}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center space-x-2">
          <Skeleton variant="rectangular" width="md" height="md" />
          <Skeleton variant="rectangular" width="md" height="md" />
          <Skeleton variant="rectangular" width="md" height="md" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton variant="rectangular" width="xs" height="sm" />
          <Skeleton variant="rectangular" width="md" height="sm" />
          <Skeleton variant="rectangular" width="xs" height="sm" />
        </div>
      </div>

      {/* PDF Content */}
      <div className="p-4 flex flex-col items-center space-y-4">
        {/* Page */}
        <Skeleton 
          variant="rectangular" 
          className="w-full max-w-2xl aspect-[3/4]" 
        />
        
        {/* Page Controls */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Skeleton variant="circular" width="md" height="md" />
          <Skeleton variant="rectangular" width="md" height="sm" />
          <Skeleton variant="circular" width="md" height="md" />
        </div>
      </div>
    </SkeletonCard>
  )
}

export function SignatureAreaSkeleton() {
  return (
    <SkeletonCard>
      <div className="p-4 space-y-4">
        <Skeleton variant="rectangular" height="sm" width="1/3" />
        <Skeleton variant="rectangular" height="xl" customHeight="8rem" width="full" />
        <div className="flex justify-end space-x-2">
          <Skeleton variant="rectangular" height="md" width="md" customWidth="6rem" />
          <Skeleton variant="rectangular" height="md" width="md" customWidth="6rem" />
        </div>
      </div>
    </SkeletonCard>
  )
}

export function AgreementViewerSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <PdfViewerSkeleton />
      </div>
      <div className="space-y-6">
        <SkeletonCard>
          <div className="p-4 space-y-4">
            <Skeleton variant="rectangular" height="md" width="2/3" />
            <div className="space-y-2">
              <Skeleton variant="rectangular" height="sm" width="full" />
              <Skeleton variant="rectangular" height="sm" width="full" />
              <Skeleton variant="rectangular" height="sm" width="3/4" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton variant="rectangular" height="sm" width="1/3" />
              <Skeleton variant="circular" width="md" height="md" />
            </div>
          </div>
        </SkeletonCard>
        <SignatureAreaSkeleton />
      </div>
    </div>
  )
}
