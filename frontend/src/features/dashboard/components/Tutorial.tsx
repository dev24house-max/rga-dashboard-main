import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialProps {
  steps: TutorialStep[];
  currentStepIndex: number;
  onStepChange: (stepIndex: number) => void;
  onComplete: () => void;
  onSkip: () => void;
}

const TOOLTIP_WIDTH = 340;
const TOOLTIP_HEIGHT = 220;
const SPOTLIGHT_PADDING = 12;
const OFFSET = 16;

const Tutorial: React.FC<TutorialProps> = ({
  steps,
  currentStepIndex,
  onStepChange,
  onComplete,
  onSkip,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef<HTMLElement | null>(null);

  const currentStep = Math.min(Math.max(0, currentStepIndex), steps.length - 1);
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  // ── Mobile detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    let timerId: ReturnType<typeof setTimeout>;
    const debouncedCheck = () => {
      clearTimeout(timerId);
      timerId = setTimeout(check, 150);
    };

    window.addEventListener('resize', debouncedCheck);
    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timerId);
    };
  }, []);

  // ── Get current tooltip dimensions (measured, with fallback) ──────────────
  const getTooltipDims = useCallback(() => {
    if (tooltipRef.current) {
      return {
        width: tooltipRef.current.offsetWidth || TOOLTIP_WIDTH,
        height: tooltipRef.current.offsetHeight || TOOLTIP_HEIGHT,
      };
    }
    return { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT };
  }, []);

  // ── Position computation ──────────────────────────────────────────────────
  const computePosition = useCallback(() => {
    // Always query fresh — never re-use stale targetRef when step changes
    const target = document.querySelector(step.target) as HTMLElement | null;
    if (!target) {
      setHighlightRect(null);
      targetRef.current = null;
      return;
    }
    targetRef.current = target;

    const rect = target.getBoundingClientRect();
    setHighlightRect(rect);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { width: tw, height: th } = getTooltipDims();

    const spotBottom = rect.bottom + SPOTLIGHT_PADDING;
    const spotTop = rect.top - SPOTLIGHT_PADDING;
    const spotLeft = rect.left - SPOTLIGHT_PADDING;
    const spotRight = rect.right + SPOTLIGHT_PADDING;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const prefer: 'top' | 'bottom' | 'left' | 'right' =
      step.position === 'center' ? 'bottom' : step.position;

    let top = 0;
    let left = 0;
    let nextPlacement: 'top' | 'bottom' | 'left' | 'right' = prefer;

    if (prefer === 'bottom') {
      top = spotBottom + OFFSET;
      left = centerX - tw / 2;
      if (top + th > vh - 16) { top = spotTop - th - OFFSET; nextPlacement = 'top'; }
    } else if (prefer === 'top') {
      top = spotTop - th - OFFSET;
      left = centerX - tw / 2;
      if (top < 16) { top = spotBottom + OFFSET; nextPlacement = 'bottom'; }
    } else if (prefer === 'right') {
      top = centerY - th / 2;
      left = spotRight + OFFSET;
      if (left + tw > vw - 16) { left = spotLeft - tw - OFFSET; nextPlacement = 'left'; }
    } else {
      // left
      top = centerY - th / 2;
      left = spotLeft - tw - OFFSET;
      if (left < 16) { left = spotRight + OFFSET; nextPlacement = 'right'; }
    }

    left = Math.max(16, Math.min(left, vw - tw - 16));
    top = Math.max(16, Math.min(top, vh - th - 16));

    setPlacement(nextPlacement);
    setTooltipPos({ top, left });
  }, [step, getTooltipDims]);

  // ── Actions (stable refs) ─────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (isLastStep) { onComplete(); setIsVisible(false); }
    else { onStepChange(currentStep + 1); }
  }, [isLastStep, currentStep, onComplete, onStepChange]);

  const handleBack = useCallback(() => {
    onStepChange(Math.max(0, currentStep - 1));
  }, [currentStep, onStepChange]);

  // FIX: handleSkip defined before useEffect so the keydown closure captures
  //      the latest version via a stable ref pattern.
  const handleSkip = useCallback(() => {
    onSkip();
    setIsVisible(false);
  }, [onSkip]);

  const handleSkipRef = useRef(handleSkip);
  useEffect(() => { handleSkipRef.current = handleSkip; }, [handleSkip]);

  // ── Scroll + event wiring per step ───────────────────────────────────────
  useEffect(() => {
    // Reset so computePosition always does a fresh querySelector
    targetRef.current = null;
    setHighlightRect(null);

    const target = document.querySelector(step.target) as HTMLElement | null;
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    // Measure after scroll settles; also measure immediately for non-scroll cases
    computePosition();
    const settleTimer = setTimeout(computePosition, 350);

    // Use RAF-throttled handler (no double debounce)
    const scheduleCompute = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(computePosition);
    };

    // FIX: use ref so keydown always calls the latest handleSkip
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkipRef.current();
    };

    window.addEventListener('resize', scheduleCompute);
    window.addEventListener('scroll', scheduleCompute, { passive: true, capture: true });
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(settleTimer);
      window.removeEventListener('resize', scheduleCompute);
      window.removeEventListener('scroll', scheduleCompute, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [step, computePosition]); // handleSkip intentionally omitted — accessed via ref

  if (!isVisible) return null;

  // ── Derived values (memoised) ─────────────────────────────────────────────
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  const sr = useMemo(() => {
    if (!highlightRect) return null;
    return {
      x: highlightRect.left - SPOTLIGHT_PADDING,
      y: highlightRect.top - SPOTLIGHT_PADDING,
      w: highlightRect.width + SPOTLIGHT_PADDING * 2,
      h: highlightRect.height + SPOTLIGHT_PADDING * 2,
      r: 12,
    };
  }, [highlightRect]);

  const arrowStyle: React.CSSProperties = useMemo(() => {
    if (isMobile || !sr) return {};

    const { width: tw, height: th } = getTooltipDims();
    const centerX = sr.x + sr.w / 2;
    const centerY = sr.y + sr.h / 2;
    const style: React.CSSProperties = {};

    if (placement === 'bottom') {
      style.top = tooltipPos.top - 8;
      style.left = Math.min(Math.max(tooltipPos.left + 20, centerX - 8), tooltipPos.left + tw - 36);
    } else if (placement === 'top') {
      style.top = tooltipPos.top + th;
      style.left = Math.min(Math.max(tooltipPos.left + 20, centerX - 8), tooltipPos.left + tw - 36);
    } else if (placement === 'right') {
      style.top = Math.min(Math.max(tooltipPos.top + 20, centerY - 8), tooltipPos.top + th - 36);
      style.left = tooltipPos.left - 8;
    } else {
      style.top = Math.min(Math.max(tooltipPos.top + 20, centerY - 8), tooltipPos.top + th - 36);
      style.left = tooltipPos.left + tw;
    }
    return style;
  }, [isMobile, sr, placement, tooltipPos, getTooltipDims]);

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep, steps.length]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        key="tutorial-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] pointer-events-none"
      >
        {/* SVG overlay with spotlight cutout */}
        {sr && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ display: 'block' }}
            width={vw}
            height={vh}
          >
            <defs>
              <mask id="tutorial-spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect x={sr.x} y={sr.y} width={sr.w} height={sr.h} rx={sr.r} fill="black" />
              </mask>
            </defs>

            <rect
              x="0" y="0" width="100%" height="100%"
              fill="rgba(15, 23, 42, 0.6)"
              mask="url(#tutorial-spotlight-mask)"
            />

            {/* Focus ring */}
            <rect
              x={sr.x} y={sr.y} width={sr.w} height={sr.h} rx={sr.r}
              fill="none" stroke="rgba(249,115,22,0.7)" strokeWidth="2"
            />

            {/* Pulsing glow */}
            <rect
              x={sr.x - 4} y={sr.y - 4} width={sr.w + 8} height={sr.h + 8} rx={sr.r + 4}
              fill="none" stroke="rgba(249,115,22,0.3)" strokeWidth="1.5"
            >
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </rect>
          </svg>
        )}

        {/* Click-to-dismiss backdrop */}
        <div
          className="absolute inset-0 pointer-events-auto"
          style={{ zIndex: 0 }}
          onClick={handleSkip}
        />

        {/* Arrow connector */}
        {!isMobile && highlightRect && sr && (
          <div
            className="absolute pointer-events-none"
            style={{ ...arrowStyle, width: 16, height: 16, zIndex: 10 }}
          >
            <svg viewBox="0 0 16 16" width="16" height="16">
              {placement === 'bottom' && <polygon points="8,0 16,16 0,16" fill="white" />}
              {placement === 'top'    && <polygon points="0,0 16,0 8,16"  fill="white" />}
              {placement === 'right'  && <polygon points="0,0 16,8 0,16"  fill="white" />}
              {placement === 'left'   && <polygon points="16,0 0,8 16,16" fill="white" />}
            </svg>
          </div>
        )}

        {/* Tooltip — mobile (bottom sheet) */}
        {isMobile ? (
          <motion.div
            key={step.id}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(_, info) => info.offset.y > 80 && handleSkip()}
            className="absolute bottom-0 left-0 right-0 pointer-events-auto bg-white rounded-t-2xl shadow-2xl"
            style={{ zIndex: 20, paddingBottom: 'env(safe-area-inset-bottom)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            <div className="px-5 pt-3 pb-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-orange-500 tracking-widest uppercase">
                    Step {currentStep + 1}/{steps.length}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{step.title}</h3>
                </div>
                <button
                  onClick={handleSkip}
                  className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
                  aria-label="Close tutorial"
                >
                  ✕
                </button>
              </div>

              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>

              <div className="flex gap-2 pt-1">
                {currentStep > 0 && (
                  <button onClick={handleBack} className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                    ← Back
                  </button>
                )}
                <button onClick={handleNext} className="flex-1 py-3 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition">
                  {isLastStep ? 'Done ✓' : 'Next →'}
                </button>
              </div>
            </div>
          </motion.div>

        ) : (
          /* Tooltip — desktop */
          <motion.div
            key={step.id}
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="absolute pointer-events-auto bg-white rounded-2xl"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              width: TOOLTIP_WIDTH,
              zIndex: 20,
              boxShadow: '0 24px 64px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <button
                  onClick={handleSkip}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs transition"
                  aria-label="Close tutorial"
                >
                  ✕
                </button>
              </div>

              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: i === currentStep ? 20 : 6,
                      height: 6,
                      background: i === currentStep ? '#f97316' : '#e2e8f0',
                    }}
                  />
                ))}
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{step.description}</p>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {currentStep > 0 && (
                    <button onClick={handleBack} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                      ← Back
                    </button>
                  )}
                  <button onClick={handleSkip} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition">
                    Skip
                  </button>
                </div>
                <button onClick={handleNext} className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 active:scale-95 transition">
                  {isLastStep ? 'Done ✓' : 'Next →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Tutorial;