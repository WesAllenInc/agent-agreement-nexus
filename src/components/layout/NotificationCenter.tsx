import { useState, useEffect } from "react";
import { Bell, Check, Clock, FileText, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "agreement" | "system" | "user";
  status: "read" | "unread";
  createdAt: Date;
  link?: string;
  relatedId?: string;
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from an API or real-time subscription
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New Agreement Assigned",
        message: "You have been assigned a new sales agreement to review.",
        type: "agreement",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        link: "/agent/agreement",
        relatedId: "AGR-001",
      },
      {
        id: "2",
        title: "Agreement Signed",
        message: "Client John Smith has signed the sales agreement.",
        type: "agreement",
        status: "unread",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        link: "/agent/documents",
        relatedId: "AGR-002",
      },
      {
        id: "3",
        title: "Profile Updated",
        message: "Your profile information has been updated successfully.",
        type: "system",
        status: "read",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: "4",
        title: "New Comment",
        message: "Admin has added a comment to your agreement draft.",
        type: "agreement",
        status: "read",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        link: "/agent/agreement",
        relatedId: "AGR-003",
      },
      {
        id: "5",
        title: "System Maintenance",
        message: "The system will be under maintenance on Sunday from 2-4 AM EST.",
        type: "system",
        status: "read",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
    ];

    setNotifications(mockNotifications);
    updateUnreadCount(mockNotifications);
    
    // Real-time subscription setup would go here
    // This would be a WebSocket or Supabase subscription in a real app
    const setupRealtimeSubscription = async () => {
      try {
        // Example of how you might set up a Supabase subscription
        // const subscription = supabase
        //   .channel('notifications')
        //   .on('postgres_changes', { 
        //     event: 'INSERT', 
        //     schema: 'public', 
        //     table: 'notifications',
        //     filter: `user_id=eq.${userId}`
        //   }, (payload) => {
        //     // Handle new notification
        //     const newNotification = transformPayloadToNotification(payload.new);
        //     setNotifications(prev => [newNotification, ...prev]);
        //     updateUnreadCount([...notifications, newNotification]);
        //   })
        //   .subscribe();
        
        // return () => {
        //   subscription.unsubscribe();
        // };
      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
      }
    };
    
    // setupRealtimeSubscription();
    
    // Simulate receiving a new notification after 5 seconds
    const timer = setTimeout(() => {
      const newNotification: Notification = {
        id: "6",
        title: "New Agreement Template",
        message: "A new agreement template has been added to the system.",
        type: "system",
        status: "unread",
        createdAt: new Date(),
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      updateUnreadCount([newNotification, ...notifications]);
      
      if (!open) {
        toast.info("New notification: " + newNotification.title, {
          action: {
            label: "View",
            onClick: () => setOpen(true),
          },
        });
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const updateUnreadCount = (notifs: Notification[]) => {
    setUnreadCount(notifs.filter(n => n.status === "unread").length);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: "read" } 
          : notification
      )
    );
    
    updateUnreadCount(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, status: "read" } 
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: "read" }))
    );
    setUnreadCount(0);
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    toast.success("All notifications cleared");
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    handleMarkAsRead(notification.id);
    
    // Navigate to link if available
    if (notification.link) {
      // In a real app, you would use router.push or similar
      console.log(`Navigating to: ${notification.link}`);
    }
    
    // Close popover
    setOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "agreement":
        return <FileText className="h-4 w-4 text-primary" />;
      case "user":
        return <User className="h-4 w-4 text-blue-500" />;
      case "system":
        return <Bell className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return notification.status === "unread";
    return notification.type === activeTab;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center bg-red-500 text-white" 
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="h-8 px-2 text-xs"
              >
                <Check className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                className="h-8 px-2 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full rounded-none border-b">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-1 h-4 px-1 bg-primary text-xs" variant="default">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="agreement" className="text-xs">Agreements</TabsTrigger>
            <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px]">
            <TabsContent value={activeTab} className="m-0">
              {filteredNotifications.length > 0 ? (
                <div>
                  {filteredNotifications.map((notification) => (
                    <div key={notification.id}>
                      <button
                        className={cn(
                          "w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors",
                          notification.status === "unread" && "bg-primary-50/50"
                        )}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className={cn(
                                "text-sm font-medium",
                                notification.status === "unread" && "text-primary-900"
                              )}>
                                {notification.title}
                              </p>
                              {notification.status === "unread" && (
                                <Badge 
                                  className="h-5 px-1.5 bg-primary/10 text-primary text-[10px] font-medium border-primary/20" 
                                  variant="outline"
                                >
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>
                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/50 mb-3" />
                  <p className="text-sm font-medium mb-1">No notifications</p>
                  <p className="text-xs text-muted-foreground">
                    {activeTab === "all" 
                      ? "You don't have any notifications yet"
                      : activeTab === "unread"
                        ? "You've read all your notifications"
                        : `You don't have any ${activeTab} notifications`}
                  </p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-2 border-t bg-muted/10">
          <Button variant="ghost" size="sm" className="w-full text-xs justify-start text-muted-foreground">
            Notification Settings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
