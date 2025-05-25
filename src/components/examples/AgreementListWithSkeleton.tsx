import { useState, useEffect } from "react"
import { AgreementCardSkeletonList } from "@/components/skeletons"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Example component showing how to use skeleton loading states
export function AgreementListWithSkeleton() {
  const [isLoading, setIsLoading] = useState(true)
  const [agreements, setAgreements] = useState<any[]>([])

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock data
        setAgreements([
          { id: 1, title: "Employment Agreement", status: "pending", description: "Standard employment agreement" },
          { id: 2, title: "NDA", status: "signed", description: "Non-disclosure agreement" },
          { id: 3, title: "Contractor Agreement", status: "pending", description: "Independent contractor agreement" }
        ])
      } catch (error) {
        console.error("Error fetching agreements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Agreements</h2>
        <Button>New Agreement</Button>
      </div>

      {/* Show skeleton while loading */}
      {isLoading ? (
        <AgreementCardSkeletonList />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agreements.map(agreement => (
            <Card key={agreement.id} className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{agreement.title}</h3>
                    <p className="text-sm text-muted-foreground">Status: {agreement.status}</p>
                  </div>
                </div>
                <p className="text-sm">{agreement.description}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button size="sm">Sign</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
