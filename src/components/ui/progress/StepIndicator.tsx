import React from 'react';

interface Step {
  title: string;
  description?: string;
  status: 'upcoming' | 'current' | 'completed';
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-neutral-200">
        <div
          className="h-full bg-green-primary transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      <div className="relative z-10 flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 
                ${step.status === 'completed' 
                  ? 'border-green-primary bg-green-primary text-white' 
                  : step.status === 'current'
                  ? 'border-green-primary bg-white text-green-primary'
                  : 'border-neutral-300 bg-white text-neutral-500'
                }`}
            >
              {step.status === 'completed' ? (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium 
                ${step.status === 'upcoming' ? 'text-neutral-500' : 'text-neutral-900'}`}>
                {step.title}
              </div>
              {step.description && (
                <div className="mt-1 text-caption text-neutral-500">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
