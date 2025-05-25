import { Skeleton, SkeletonText } from "@/components/ui/skeleton-enhanced"
import { cn } from "@/lib/utils"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
  className?: string
  cellClassName?: string
  headerClassName?: string
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
  cellClassName,
  headerClassName,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-md border", className)}>
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          {showHeader && (
            <thead className={cn("bg-muted/50", headerClassName)}>
              <tr className="border-b transition-colors">
                {Array.from({ length: columns }).map((_, index) => (
                  <th
                    key={`header-${index}`}
                    className="h-12 px-4 text-left align-middle font-medium"
                  >
                    <SkeletonText height="xs" width="2/3" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className="border-b transition-colors hover:bg-muted/50"
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn("p-4", cellClassName)}
                  >
                    <SkeletonText 
                      height="sm" 
                      width={colIndex === 0 ? "3/4" : colIndex === columns - 1 ? "1/4" : "1/2"} 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AgreementTableSkeleton() {
  return <TableSkeleton rows={5} columns={5} />
}

export function UserTableSkeleton() {
  return <TableSkeleton rows={6} columns={4} />
}

export function TrainingTableSkeleton() {
  return <TableSkeleton rows={4} columns={6} />
}
