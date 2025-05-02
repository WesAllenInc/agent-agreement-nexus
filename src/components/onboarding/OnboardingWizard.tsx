import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { t } from '../../utils/i18n';

interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
}

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: OnboardingStep[] = [
    {
      title: 'Welcome to Agent Agreement Nexus',
      description: 'We\'ll guide you through the key features of our platform to help you get started quickly.',
      image: '/onboarding/welcome.svg',
    },
    {
      title: 'Create and Manage Agreements',
      description: 'Learn how to create, edit, and manage your agreements with just a few clicks.',
      image: '/onboarding/agreements.svg',
    },
    {
      title: 'Invite Signers',
      description: 'Easily invite others to sign your agreements and track their progress.',
      image: '/onboarding/signers.svg',
    },
    {
      title: 'Ready to Get Started?',
      description: 'You\'re all set! Explore the platform and reach out to support if you need any assistance.',
      image: '/onboarding/complete.svg',
    },
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="onboarding-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {steps[currentStep].title}
          </h2>
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Skip onboarding"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-grow overflow-auto p-6">
          <div className="flex flex-col items-center">
            {steps[currentStep].image && (
              <div className="mb-6">
                <img
                  src={steps[currentStep].image}
                  alt={steps[currentStep].title}
                  className="max-h-64 object-contain"
                />
              </div>
            )}
            
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-lg">
              {steps[currentStep].description}
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            {currentStep > 0 ? (
              <button
                onClick={handlePrevious}
                className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ChevronLeft size={16} className="mr-1" />
                {t('onboarding.previous')}
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t('onboarding.skip')}
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-1" aria-hidden="true">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep
                    ? 'bg-blue-600 w-4'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNext}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
          >
            {currentStep < steps.length - 1 ? (
              <>
                {t('onboarding.next')}
                <ChevronRight size={16} className="ml-1" />
              </>
            ) : (
              t('onboarding.getStarted')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
