import { SkeletonCard, SkeletonText, SkeletonCircle } from "@/components/ui/skeleton-enhanced"
import { AgreementCardSkeletonList } from "./AgreementCardSkeleton"

interface StatCardSkeletonProps {
  className?: string
}

export function StatCardSkeleton({ className }: StatCardSkeletonProps) {
  return (
    <SkeletonCard className={className}>
      <div className="flex flex-col space-y-3 p-2">
        <SkeletonText height="xs" width="xs" className="w-10" />
        <div className="flex items-end justify-between">
          <SkeletonText height="xl" width="1/3" />
          <SkeletonCircle size="lg" />
        </div>
        <SkeletonText height="xs" width="md" customWidth="5rem" />
      </div>
    </SkeletonCard>
  )
}

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <SkeletonCard className="w-full">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonText height="md" width="1/3" />
          <div className="flex space-x-2">
            <SkeletonText height="sm" width="md" customWidth="5rem" />
            <SkeletonText height="sm" width="md" customWidth="5rem" />
          </div>
        </div>
        <div className="h-64 w-full">
          <div className="h-full w-full flex items-end space-x-2 pt-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="flex-1 bg-muted animate-shimmer relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-shimmer"
                style={{ height: `${Math.max(15, Math.floor(Math.random() * 100))}%` }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonText key={i} height="xs" width="xs" customWidth="2.5rem" />
          ))}
        </div>
      </div>
    </SkeletonCard>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <StatsRowSkeleton />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      {/* Recent Agreements */}
      <div className="space-y-4">
        <SkeletonText height="lg" width="1/4" />
        <AgreementCardSkeletonList />
      </div>
      
      {/* Activity Feed */}
      <div className="space-y-4">
        <SkeletonText height="lg" width="1/4" />
        <SkeletonCard>
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <SkeletonCircle size="md" />
                <div className="space-y-2 flex-1">
                  <SkeletonText height="sm" width="2/3" />
                  <SkeletonText height="xs" width="xs" customWidth="2.5rem" />
                </div>
                <SkeletonText height="xs" width="md" className="w-20" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  )
}
