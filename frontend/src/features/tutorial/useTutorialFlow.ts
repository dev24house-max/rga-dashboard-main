import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { tutorialRegistry, TutorialConfig, resolveTutorialRoute } from './tutorial-registry';

const PROTECTED_MATCHER_PATHS = new Set(['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']);

function normalizePath(path: string) {
  const cleaned = path.split('?')[0].replace(/\/+$/u, '');
  return cleaned === '' ? '/' : cleaned;
}

export function useTutorialFlow() {
  const [location, setLocation] = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [manualPagePath, setManualPagePath] = useState<string | null>(null);

  const currentPath = normalizePath(location);
  const tutorialPath = resolveTutorialRoute(currentPath);
  const currentTutorialKey = manualPagePath || tutorialPath;
  const config: TutorialConfig | undefined = tutorialRegistry[currentTutorialKey];
  const storageKey = config?.storageKey || '';
  const steps = config?.steps || [];
  const currentStep = steps[currentStepIndex] ?? steps[0];

  const canAutoStart = useMemo(() => {
    if (isComplete) return false;
    if (manualPagePath) return false;
    if (PROTECTED_MATCHER_PATHS.has(currentPath)) return false;
    const completed = localStorage.getItem(storageKey) === 'true';
    return !completed && steps.length > 0;
  }, [currentPath, isComplete, steps.length, storageKey, manualPagePath]);

  useEffect(() => {
    const completed = localStorage.getItem(storageKey) === 'true';
    setIsComplete(completed);
    setCurrentStepIndex(0);

    if (steps.length && canAutoStart) {
      setIsActive(true);
    }
  }, [canAutoStart, steps.length, storageKey]);

  useEffect(() => {
    const onStart = (event: Event) => {
      const customEvent = event as CustomEvent<{ pagePath?: string }>;
      const requestedPath = customEvent?.detail?.pagePath ? normalizePath(customEvent.detail.pagePath) : currentPath;
      const tutorialRequestedPath = resolveTutorialRoute(requestedPath);
      const reqConfig = tutorialRegistry[tutorialRequestedPath];

      if (!reqConfig) return;

      setIsComplete(false);
      setCurrentStepIndex(0);
      setIsActive(true);
      setManualPagePath(tutorialRequestedPath);

      if (requestedPath !== currentPath && !PROTECTED_MATCHER_PATHS.has(requestedPath)) {
        setLocation(requestedPath);
      }
    };

    window.addEventListener('start-tutorial', onStart as EventListener);
    return () => window.removeEventListener('start-tutorial', onStart as EventListener);
  }, [currentPath, setLocation]);

  const handleStepChange = useCallback((nextIndex: number) => {
    setCurrentStepIndex(Math.min(Math.max(0, nextIndex), steps.length - 1));
  }, [steps.length]);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    setIsComplete(true);
    setManualPagePath(null);
    localStorage.setItem(storageKey, 'true');
  }, [storageKey]);

  const handleSkip = useCallback(() => {
    setIsActive(false);
    setManualPagePath(null);
    // Do not mark as completed on skip
  }, []);

  return {
    isActive,
    currentStepIndex,
    steps,
    handleStepChange,
    handleComplete,
    handleSkip,
  };
}
