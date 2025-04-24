
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
            Sign In
          </Button>
        </div>
      </header>
      
      <main className="flex-1 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl font-bold text-navy-600 leading-tight">
              Sales Agent Agreement Portal
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your onboarding process and manage agreements efficiently with Ireland Pay's secure platform.
            </p>
            <div className="pt-8">
              <Button 
                onClick={() => navigate("/login")} 
                className="px-8 py-6 text-lg bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy-600 mb-3">Agent Onboarding</h3>
                <p className="text-gray-600">
                  Seamless digital onboarding process for new sales agents
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
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy-600 mb-3">Digital Signatures</h3>
                <p className="text-gray-600">
                  Secure e-signatures for quick and legally binding agreements
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
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-navy-600 mb-3">Agreement Management</h3>
                <p className="text-gray-600">
                  Centralized dashboard to track all agreements and their status
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
