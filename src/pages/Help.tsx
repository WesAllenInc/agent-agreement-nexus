import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle, FileText, Users, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqItems = [
    {
      question: "How do I upload a new agreement?",
      answer: "Navigate to the Agent Dashboard, click on 'New Agreement', fill out the required fields, and upload your PDF document. Once uploaded, you can assign it to clients and track its status."
    },
    {
      question: "How do I change my password?",
      answer: "Go to your Profile page by clicking on your avatar in the top-right corner, then select 'Profile'. Navigate to the Password tab where you can enter your current password and set a new one."
    },
    {
      question: "What file formats are supported for agreement uploads?",
      answer: "Currently, we support PDF files (.pdf) for all agreement uploads. Other formats like Word documents or images need to be converted to PDF before uploading."
    },
    {
      question: "How do I invite a new agent to the platform?",
      answer: "Administrators can invite new agents by going to the 'Invitations' page, clicking 'New Invitation', and entering the agent's email address. The system will send an invitation email with registration instructions."
    },
    {
      question: "Can I save a draft of an agreement?",
      answer: "Yes, when creating or editing an agreement, you can click the 'Save Draft' button at any time. Your progress will be saved, and you can resume from where you left off later."
    },
    {
      question: "How do I export agreement statistics?",
      answer: "From the Dashboard, click on 'Reports', select the date range and metrics you're interested in, then click 'Export'. You can download the data in CSV or Excel format."
    }
  ];
  
  const filteredFaqs = searchQuery 
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  return (
    <MainLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <Card className="border-none shadow-md">
          <CardHeader className="bg-primary-50 border-b">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              <CardTitle>Help Center</CardTitle>
            </div>
            <CardDescription>
              Find answers to common questions and learn how to use the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for help topics..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </Button>
              )}
            </div>
            
            <Tabs defaultValue="faq">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>FAQ</span>
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>User Guides</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings Help</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="faq">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="guides">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:bg-primary-50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Getting Started Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Learn the basics of navigating the platform and managing your agreements.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-primary-50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Agreement Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Detailed guide on creating, editing, and tracking agreements.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-primary-50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        How to update your profile information and security settings.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="cursor-pointer hover:bg-primary-50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Admin Functions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Administrative tasks including user management and system settings.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Account Settings</h3>
                    <p className="text-muted-foreground mb-4">
                      Manage your account settings including profile information, password, and notification preferences.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Update your profile information in the Profile section</li>
                      <li>Change your password regularly for security</li>
                      <li>Configure notification preferences to stay updated</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">System Preferences</h3>
                    <p className="text-muted-foreground mb-4">
                      Customize your experience with system-wide preferences and display options.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      <li>Toggle between light and dark mode</li>
                      <li>Set default views for agreements and documents</li>
                      <li>Configure dashboard widgets and layouts</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="mt-8 bg-primary-50 rounded-lg p-6 border border-primary-100">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Need more help?
          </h3>
          <p className="text-muted-foreground mb-4">
            If you couldn't find what you're looking for, our support team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Contact Support
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              View Documentation
            </Button>
          </div>
        </div>
      </div>
      
      <TooltipProvider>
        <div className="fixed bottom-6 right-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
                <HelpCircle className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Need help?</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </MainLayout>
  );
}
