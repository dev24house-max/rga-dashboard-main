import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { tutorialSteps, TutorialRouteStep } from './tutorial-config';

const STORAGE_KEY = 'rga-onboarding-tutorial-state';
const PROTECTED_MATCHER_PATHS = new Set(['/login', '/register', '/forgot-password', '/reset-password', '/verify-email']);

function normalizePath(path: string) {
  const cleaned = path.split('?')[0].replace(/\/+$/u, '');
  return cleaned === '' ? '/' : cleaned;
}

function routeMatches(currentPath: string, stepPath: string) {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedStep = normalizePath(stepPath);

  if (normalizedStep === '/dashboard') {
    return normalizedCurrent === '/dashboard' || normalizedCurrent === '/';
  }

  return normalizedCurrent === normalizedStep;
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { completed: boolean; currentStepIndex: number };
  } catch {
    return null;
  }
}

function saveState(completed: boolean, currentStepIndex: number) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ completed, currentStepIndex })
  );
}

export function useTutorialFlow() {
  const [location, setLocation] = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [manualPagePath, setManualPagePath] = useState<string | null>(null);

  const steps = useMemo(() => {
    if (!manualPagePath) return tutorialSteps;
    return tutorialSteps.filter((step) => routeMatches(manualPagePath, step.path));
  }, [manualPagePath]);

  const currentStep = steps[currentStepIndex] ?? steps[0];
  const currentPath = normalizePath(location);

  const canAutoStart = useMemo(() => {
    if (isComplete) return false;
    if (manualPagePath) return false;
    if (PROTECTED_MATCHER_PATHS.has(currentPath)) return false;
    return steps.some((step) => routeMatches(currentPath, step.path));
  }, [currentPath, isComplete, steps, manualPagePath]);

  useEffect(() => {
    const saved = loadSavedState();
    if (saved?.completed) {
      setIsComplete(true);
      setIsActive(false);
      return;
    }

    const hasSavedIndex = typeof saved?.currentStepIndex === 'number';
    setCurrentStepIndex(hasSavedIndex ? saved!.currentStepIndex : 0);

    if (steps.length && canAutoStart) {
      setIsActive(true);
    }
  }, [canAutoStart, steps.length]);

  useEffect(() => {
    if (!isActive || isComplete || manualPagePath) return;
    saveState(false, currentStepIndex);
  }, [currentStepIndex, isActive, isComplete, manualPagePath]);

  useEffect(() => {
    if (!isActive || isComplete) return;
    if (routeMatches(currentPath, currentStep.path)) return;
    if (PROTECTED_MATCHER_PATHS.has(currentPath)) return;
    setLocation(currentStep.path);
  }, [currentPath, currentStep.path, isActive, isComplete, setLocation]);

  useEffect(() => {
    const onStart = (event: Event) => {
      const customEvent = event as CustomEvent<{ pagePath?: string }>;
      const requestedPath = customEvent?.detail?.pagePath ? normalizePath(customEvent.detail.pagePath) : null;

      setIsComplete(false);
      setCurrentStepIndex(0);
      setIsActive(true);
      setManualPagePath(requestedPath);
      localStorage.removeItem(STORAGE_KEY);

      if (requestedPath && requestedPath !== currentPath && !PROTECTED_MATCHER_PATHS.has(requestedPath)) {
        setLocation(requestedPath);
      }
    };

    window.addEventListener('rga-tutorial-start', onStart as EventListener);
    return () => window.removeEventListener('rga-tutorial-start', onStart as EventListener);
  }, [currentPath, setLocation]);

  const handleStepChange = (nextIndex: number) => {
    setCurrentStepIndex(Math.min(Math.max(0, nextIndex), steps.length - 1));
  };

  const handleComplete = () => {
    setIsComplete(true);
    setIsActive(false);
    setManualPagePath(null);
    saveState(true, currentStepIndex);
  };

  const handleSkip = () => {
    setIsComplete(true);
    setIsActive(false);
    setManualPagePath(null);
    saveState(true, currentStepIndex);
  };

  return {
    isActive,
    currentStepIndex,
    steps,
    handleStepChange,
    handleComplete,
    handleSkip,
  };
}
