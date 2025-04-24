
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">IrelandPay Portal</h1>
            <p className="text-lg text-gray-600">
              Join our network of sales agents and start earning today
            </p>
          </div>
          <div className="space-y-4">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
