
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center flex flex-col items-center">
          <img 
            src="/placeholder.svg" 
            alt="Ireland Pay Logo" 
            className="h-12 mb-4"
          />
          <p className="mt-2 text-sm text-gray-600">
            Sales Agent Agreement Portal
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
