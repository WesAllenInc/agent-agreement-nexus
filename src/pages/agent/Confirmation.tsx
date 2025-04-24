
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Confirmation() {
  return (
    <MainLayout>
      <div className="max-w-lg mx-auto">
        <Card className="border-green-100 shadow-lg">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="text-center text-green-800">
              Agreement Submitted Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">Thank you for completing your agreement!</h2>
              <p className="text-gray-600">
                Your sales agent agreement has been submitted successfully. Our team will review your application and be in touch shortly.
              </p>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-blue-800">
                <p>
                  <strong>What happens next?</strong>
                </p>
                <ul className="list-disc list-inside text-left mt-2">
                  <li>Our team will review your application</li>
                  <li>You'll receive an email confirmation</li>
                  <li>We'll contact you with next steps</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-green-100 bg-green-50">
            <Button asChild>
              <Link to="/agent/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
