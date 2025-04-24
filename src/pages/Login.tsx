
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Ireland Pay</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sales Agent Agreement Portal
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
