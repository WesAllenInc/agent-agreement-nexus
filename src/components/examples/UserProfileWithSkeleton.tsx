import { useState, useEffect } from "react"
import { UserProfileSkeleton } from "@/components/skeletons"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Example component showing how to use user profile skeleton loading states
export function UserProfileWithSkeleton() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock data
        setUserData({
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Agent",
          phone: "+1 (555) 123-4567",
          department: "Sales",
          joinDate: "2024-01-15",
          status: "Active",
          agreements: {
            total: 24,
            signed: 18,
            pending: 6
          },
          recentActivity: [
            { id: 1, type: "Signed", document: "Employment Agreement", date: "2025-05-20" },
            { id: 2, type: "Viewed", document: "NDA", date: "2025-05-18" },
            { id: 3, type: "Signed", document: "Benefits Form", date: "2025-05-15" }
          ]
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {isLoading ? (
        <UserProfileSkeleton />
      ) : (
        <>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}&background=random`} />
                  <AvatarFallback>{userData.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.role}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline">Edit Profile</Button>
                <Button>Message</Button>
              </div>
            </div>
          </Card>
          
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agreements">Agreements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p>{userData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                      <p>{userData.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                      <p>{userData.department}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Join Date</h3>
                      <p>{new Date(userData.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {userData.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Agreement Stats</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="bg-muted/50 p-3 rounded-md text-center">
                          <p className="text-2xl font-bold">{userData.agreements.total}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md text-center">
                          <p className="text-2xl font-bold">{userData.agreements.signed}</p>
                          <p className="text-xs text-muted-foreground">Signed</p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md text-center">
                          <p className="text-2xl font-bold">{userData.agreements.pending}</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="agreements" className="mt-4">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Agreements</h3>
                <p className="text-muted-foreground">This tab would display a list of all agreements associated with this user.</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {userData.recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{activity.document}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type} on {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
