
import { useWizard } from "./WizardContext";
import { cn } from "@/lib/utils";

export default function WizardStepper() {
  const { currentStep, goToStep, totalSteps } = useWizard();

  const steps = [
    { id: 1, name: "Partner Application" },
    { id: 2, name: "ACH Authorization" },
    { id: 3, name: "Sales Agent Agreement" },
    { id: 4, name: "Review & Sign" },
  ];

  return (
    <div className="mb-8">
      <div className="hidden sm:block">
        <ol className="flex items-center w-full">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={cn(
                stepIdx !== steps.length - 1 ? "w-full" : "",
                "relative"
              )}
            >
              <div className="group flex items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2",
                    currentStep > step.id
                      ? "border-brand-600 bg-brand-600 hover:bg-brand-700"
                      : currentStep === step.id
                      ? "border-brand-600 bg-white"
                      : "border-gray-300 bg-white"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      currentStep > step.id
                        ? "text-white"
                        : currentStep === step.id
                        ? "text-brand-600"
                        : "text-gray-500"
                    )}
                  >
                    {step.id}
                  </span>
                </div>
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={cn(
                      "hidden md:block w-full h-0.5 mx-3",
                      currentStep > step.id ? "bg-brand-600" : "bg-gray-300"
                    )}
                  />
                )}
              </div>
              <div className="hidden md:block absolute top-0 mt-10 w-32 text-center text-xs font-medium -ml-10">
                {step.name}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="sm:hidden">
        <p className="text-sm font-medium mb-2">
          Step {currentStep} of {totalSteps}: {steps[currentStep - 1].name}
        </p>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-brand-600"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
