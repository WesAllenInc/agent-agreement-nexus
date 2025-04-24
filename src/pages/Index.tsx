
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      <div className="max-w-md w-full px-6 animate-fade-in">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-navy-800 mb-4">
              IrelandPay Portal
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join our network of sales agents and start earning today
            </p>
          </div>
          <div className="space-y-6">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full text-lg py-6 bg-gradient-to-r from-navy-600 to-navy-700 hover:from-navy-700 hover:to-navy-800 shadow-lg transition-all duration-300 group"
            >
              Get Started
              <Star className="ml-2 w-5 h-5 transition-transform group-hover:rotate-45" />
            </Button>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline"
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
