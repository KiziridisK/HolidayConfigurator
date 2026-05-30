type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  labels: string[];
};

export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="mb-10 w-full">
      <ol className="flex items-center justify-between gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isComplete = step < currentStep;

          return (
            <li key={step} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors duration-500 ${
                      isComplete || isActive ? "bg-rose-deep" : "bg-rose/40"
                    }`}
                  />
                )}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500 ${
                    isActive
                      ? "scale-110 bg-rose-deep text-white shadow-lg shadow-rose/50"
                      : isComplete
                        ? "bg-rose-deep/80 text-white"
                        : "bg-white/80 text-plum/50 ring-1 ring-rose/30"
                  }`}
                >
                  {isComplete ? "♥" : step}
                </span>
                {i < totalSteps - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors duration-500 ${
                      isComplete ? "bg-rose-deep" : "bg-rose/40"
                    }`}
                  />
                )}
              </div>
              <span
                className={`hidden text-center text-xs sm:block ${
                  isActive ? "font-medium text-plum" : "text-plum/50"
                }`}
              >
                {labels[i]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
