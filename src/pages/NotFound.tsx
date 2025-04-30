
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 py-12 px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-6xl font-bold text-primary-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary-600 text-white"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}

