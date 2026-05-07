import Tutorial from '@/features/dashboard/components/Tutorial';
import { useTutorialFlow } from './useTutorialFlow';

export function TutorialFlow() {
  const {
    isActive,
    currentStepIndex,
    steps,
    handleStepChange,
    handleComplete,
    handleSkip,
  } = useTutorialFlow();

  if (!isActive || steps.length === 0) {
    return null;
  }

  return (
    <Tutorial
      steps={steps}
      currentStepIndex={currentStepIndex}
      onStepChange={handleStepChange}
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}
