
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 font-sans">
      <div className="max-w-md w-full px-6 animate-fade-in">
        <div className="text-center space-y-8">
          <div className="space-y-4 flex flex-col items-center">
            <img 
              src="/placeholder.svg" 
              alt="Ireland Pay Logo" 
              className="h-16 mb-4"
            />
            <p className="text-xl text-gray-700 leading-relaxed">
              Join our network of sales agents and start earning today
            </p>
          </div>
          <div className="space-y-6">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full text-lg py-6 bg-primary hover:bg-primary-600 shadow-lg transition-all duration-300 group"
            >
              Get Started
              <Star className="ml-2 w-5 h-5 transition-transform group-hover:rotate-45" />
            </Button>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-primary hover:text-primary-700 font-medium underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
