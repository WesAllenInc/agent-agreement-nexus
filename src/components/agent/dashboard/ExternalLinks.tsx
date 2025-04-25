
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function ExternalLinks() {
  const links = [
    {
      name: "IrisCRM Login",
      url: "https://iriscrm.com/login",
      description: "Access client management system"
    },
    {
      name: "ADP Login",
      url: "https://workforcenow.adp.com/",
      description: "Access payroll and HR portal"
    },
    {
      name: "Internal Email",
      url: "https://mail.irelandpay.com",
      description: "Access your company email"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {links.map((link, index) => (
          <div key={index} className="flex flex-col space-y-1">
            <Button 
              variant="outline" 
              className="justify-between w-full"
              onClick={() => window.open(link.url, '_blank')}
            >
              {link.name}
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground">{link.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
