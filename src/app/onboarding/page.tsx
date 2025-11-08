'use client';

import { useState } from 'react';
import StepOne from '@/components/onboarding/StepOne';
import StepTwo from '@/components/onboarding/StepTwo';
import StepThree from '@/components/onboarding/StepThree';
import { BasicInfo, ExtractedData } from '@/lib/types';

export default function OnboardingPage() {
  const [step, setStep] = useState<number>(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  const handleStepOne = (data: BasicInfo) => {
    setBasicInfo(data);
    setStep(2);
  };

  const handleStepTwo = (data: ExtractedData) => {
    setExtractedData(data);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-1/3 h-2 rounded-full mx-1 ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Step {step} of 3
            </p>
          </div>

          {/* Step content */}
          {step === 1 && <StepOne onNext={handleStepOne} />}
          {step === 2 && basicInfo && (
            <StepTwo
              basicInfo={basicInfo}
              onNext={handleStepTwo}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && extractedData && basicInfo && (
            <StepThree
              basicInfo={basicInfo}
              topics={extractedData.topics}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

