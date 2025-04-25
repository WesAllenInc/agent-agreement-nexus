
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AcceptInvitationForm from "@/components/auth/AcceptInvitationForm";
import { toast } from "sonner";
import { validateToken } from "@/api/mockEdgeFunctions";

export default function AcceptInvitation() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token and email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    const emailParam = queryParams.get("email");
    
    if (!tokenParam || !emailParam) {
      toast.error("Invalid invitation link");
      setIsValidating(false);
      return;
    }
    
    setToken(tokenParam);
    setEmail(emailParam);
    
    // Validate the token (using mock in development, real in production)
    const checkToken = async () => {
      try {
        const result = await validateToken(tokenParam, emailParam);
        
        if (!result.valid) {
          toast.error(result.error || "This invitation link has expired or is invalid");
          setIsValidating(false);
          return;
        }
        
        setIsValid(true);
        setIsValidating(false);
      } catch (error: any) {
        toast.error("Error validating invitation: " + (error.message || "Please try again"));
        setIsValidating(false);
      }
    };
    
    checkToken();
  }, [location.search]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-center">
          <p className="text-lg font-medium">Validating invitation...</p>
        </div>
      </div>
    );
  }
  
  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h2>
          <p className="text-gray-600 mb-4">
            This invitation link is invalid or has expired.
          </p>
          <button
            className="text-primary hover:text-primary-600"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Ireland Pay</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome! Create your account to get started.
          </p>
        </div>
        <AcceptInvitationForm token={token} email={email} />
      </div>
    </div>
  );
}
