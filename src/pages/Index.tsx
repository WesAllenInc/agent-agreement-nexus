
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy-600">Ireland Pay</h1>
          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
            className="border-brand-600 text-brand-600 hover:bg-brand-50"
          >
            Already have an account? Sign In
          </Button>
        </div>
      </header>
      
      <main className="flex-1 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl font-bold text-navy-600 leading-tight">
              Welcome to Ireland Pay's<br />Sales Agent Program
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our growing network of successful sales agents. Complete your onboarding in just a few simple steps and start earning with Ireland Pay.
            </p>
            <div className="pt-8">
              <Button 
                onClick={() => navigate("/login")} 
                className="px-8 py-6 text-lg bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-600"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy-600 mb-3">Quick Application</h3>
                <p className="text-gray-600">
                  Complete your agent application in minutes with our streamlined digital process
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-600"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy-600 mb-3">Fast Onboarding</h3>
                <p className="text-gray-600">
                  Get approved quickly and start selling with our comprehensive onboarding support
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy-600 mb-3">Start Earning</h3>
                <p className="text-gray-600">
                  Begin earning competitive commissions while helping businesses succeed with payment solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-navy-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2023 WLJ Innovations LLC d/b/a Ireland Pay. All rights reserved.</p>
          <p className="text-gray-300">5000 SW 75th Ave, Suite 402, Miami, FL 33155</p>
        </div>
      </footer>
    </div>
  );
}
