import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ActivityLogs from '@/components/admin/ActivityLogs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

export default function ActivityLogsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [logsPerPage, setLogsPerPage] = useState(25);

  return (
    <MainLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Activity Logs</h1>
          
          <div className="flex items-center gap-2">
            <CalendarDateRangePicker />
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>
                    Customize which activity logs are displayed.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Logs per page</Label>
                    <RadioGroup 
                      defaultValue={logsPerPage.toString()}
                      onValueChange={(value) => setLogsPerPage(parseInt(value))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="10" id="logs-10" />
                        <Label htmlFor="logs-10">10</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="25" id="logs-25" />
                        <Label htmlFor="logs-25">25</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="50" id="logs-50" />
                        <Label htmlFor="logs-50">50</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="100" id="logs-100" />
                        <Label htmlFor="logs-100">100</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Actions to include</Label>
                    <div className="space-y-2">
                      {['create', 'update', 'delete', 'view', 'login', 'logout'].map((action) => (
                        <div key={action} className="flex items-center space-x-2">
                          <Checkbox id={`action-${action}`} defaultChecked />
                          <Label htmlFor={`action-${action}`} className="capitalize">{action}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Entities to include</Label>
                    <div className="space-y-2">
                      {['agreement', 'user', 'invitation', 'profile', 'training'].map((entity) => (
                        <div key={entity} className="flex items-center space-x-2">
                          <Checkbox id={`entity-${entity}`} defaultChecked />
                          <Label htmlFor={`entity-${entity}`} className="capitalize">{entity}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList>
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-4">
            <ActivityLogs limit={logsPerPage} />
          </TabsContent>
          
          <TabsContent value="agreements" className="pt-4">
            <ActivityLogs 
              limit={logsPerPage} 
              entityFilter="agreement"
            />
          </TabsContent>
          
          <TabsContent value="users" className="pt-4">
            <ActivityLogs 
              limit={logsPerPage} 
              entityFilter="user"
            />
          </TabsContent>
          
          <TabsContent value="invitations" className="pt-4">
            <ActivityLogs 
              limit={logsPerPage} 
              entityFilter="invitation"
            />
          </TabsContent>
          
          <TabsContent value="auth" className="pt-4">
            <ActivityLogs 
              limit={logsPerPage} 
              actionFilter="login,logout"
            />
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>System Activity Overview</CardTitle>
            <CardDescription>
              Summary of recent system activity across all components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="text-2xl font-bold">235</div>
                <div className="text-sm text-muted-foreground">Total actions today</div>
              </div>
              
              <div className="bg-background rounded-lg p-4 border">
                <div className="text-2xl font-bold">42</div>
                <div className="text-sm text-muted-foreground">Unique users active</div>
              </div>
              
              <div className="bg-background rounded-lg p-4 border">
                <div className="text-2xl font-bold">18</div>
                <div className="text-sm text-muted-foreground">New agreements</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Most Active Users</h3>
              <div className="space-y-2">
                {['john.doe@example.com', 'jane.smith@example.com', 'robert.johnson@example.com'].map((user, index) => (
                  <div key={user} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span>{user}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50) + 10} actions</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
