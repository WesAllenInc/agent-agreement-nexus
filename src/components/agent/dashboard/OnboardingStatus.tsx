import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, CircleDashed, Landmark } from "lucide-react";

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  path: string;
  icon: React.ReactNode;
}

export default function OnboardingStatus() {
  const [hasAchInfo, setHasAchInfo] = useState(false);
  const [hasSignedAgreement, setHasSignedAgreement] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      try {
        // Check if user has ACH info
        const { data: achData, error: achError } = await supabase
          .from("ach_info")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!achError && achData) {
          setHasAchInfo(true);
        }

        // Check if user has signed agreement
        const { data: agreementData, error: agreementError } = await supabase
          .from("agreements")
          .select("id, status")
          .eq("user_id", user.id)
          .eq("status", "signed")
          .single();

        if (!agreementError && agreementData) {
          setHasSignedAgreement(true);
        }

        // Calculate completion percentage
        let completed = 0;
        if (hasAchInfo) completed++;
        if (hasSignedAgreement) completed++;
        
        setCompletionPercentage(Math.round((completed / 2) * 100));
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, hasAchInfo, hasSignedAgreement]);

  const onboardingItems: OnboardingItem[] = [
    {
      id: "agreement",
      title: "Sign Agent Agreement",
      description: "Review and sign your agent agreement",
      completed: hasSignedAgreement,
      path: "/agent/agreement",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      id: "banking",
      title: "Add Banking Information",
      description: "Provide your ACH information for commission payments",
      completed: hasAchInfo,
      path: "/agent/banking",
      icon: <Landmark className="h-5 w-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Onboarding Progress</h3>
          <CircleDashed className="h-5 w-5 animate-spin text-gray-400" />
        </div>
        <Progress value={0} className="h-2" />
      </div>
    );
  }

  // If everything is completed, show a success message
  if (hasAchInfo && hasSignedAgreement) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Onboarding Complete</h3>
          <span className="text-green-600 font-medium flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-1" />
            100%
          </span>
        </div>
        <Progress value={100} className="h-2" />
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">All set!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>You've completed all the required onboarding steps.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Onboarding Progress</h3>
        <span className="text-brand-600 font-medium">{completionPercentage}%</span>
      </div>
      <Progress value={completionPercentage} className="h-2" />

      <div className="space-y-4 mt-4">
        {onboardingItems.map((item) => (
          <div
            key={item.id}
            className={`border rounded-md p-4 ${
              item.completed
                ? "bg-green-50 border-green-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-medium ${
                      item.completed ? "text-green-800" : "text-gray-900"
                    }`}
                  >
                    {item.title}
                  </h3>
                  {!item.completed && (
                    <Button asChild size="sm" variant="outline">
                      <Link to={item.path}>Complete</Link>
                    </Button>
                  )}
                </div>
                <p
                  className={`mt-1 text-sm ${
                    item.completed ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
