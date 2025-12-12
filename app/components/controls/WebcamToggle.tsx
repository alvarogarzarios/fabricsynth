// components/controls/WebcamToggle.tsx
import React, { useState } from "react";

type Props = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
};

export default function WebcamToggle({
  enabled,
  onChange,
  className = "",
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blinkStage, setBlinkStage] = useState(0); // 0: open, 1: mid closing, 2: closed, 3: mid opening

  // Handle blinking animation
  React.useEffect(() => {
    if (!enabled) return;

    const blinkSequence = [
      { stage: 0, duration: 3500 }, // open for 3.5s (longest)
      { stage: 1, duration: 80 },   // closing mid
      { stage: 2, duration: 120 },  // closed
      { stage: 3, duration: 80 },   // opening mid
      { stage: 0, duration: 100 },  // fully open again before next cycle
    ];

    let currentIndex = 0;
    const timers: NodeJS.Timeout[] = [];

    const scheduleNext = () => {
      const { stage, duration } = blinkSequence[currentIndex];
      const timer = setTimeout(() => {
        setBlinkStage(stage);
        currentIndex = (currentIndex + 1) % blinkSequence.length;
        scheduleNext();
      }, duration);
      timers.push(timer);
    };

    scheduleNext();

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [enabled]);

  const handleToggle = async () => {
    if (enabled) {
      onChange(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      onChange(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to access webcam";
      setError(message);
      console.warn("[Webcam]", message);
    } finally {
      setIsLoading(false);
    }
  };

  const getEyeSvg = () => {
    if (!enabled) return "/svgs/eye-open.svg";
    switch (blinkStage) {
      case 1:
        return "/svgs/eye-mid.svg";
      case 2:
        return "/svgs/eye-closed.svg";
      case 3:
        return "/svgs/eye-mid.svg";
      default:
        return "/svgs/eye-open.svg";
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        className={`group relative w-full overflow-hidden rounded-xl px-4 py-3 transition-all duration-300 ${
          isLoading
            ? "opacity-60 cursor-not-allowed"
            : enabled
              ? "bg-neutral-700"
              : "bg-neutral-800 hover:bg-neutral-700"
        }`}
      >
        {/* Glass backdrop */}
        {enabled && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-red-500/3 to-transparent backdrop-blur-sm" />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15), rgba(239, 68, 68, 0.08), transparent 70%)",
              }}
            />
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, transparent 50%, rgba(239, 68, 68, 0.05) 100%)",
                backdropFilter: "blur(0.5px)",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent rounded-full" />
          </>
        )}

        <div className="relative flex items-center justify-between gap-3 z-10">
          {/* Label */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-white">Webcam</span>
            {enabled && (
              <span className="text-xs text-purple-300 animate-pulse">
                Camera active
              </span>
            )}
          </div>

          {/* Right: loading dots or eye */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isLoading ? (
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            ) : (
              <img
                src={getEyeSvg()}
                alt="webcam status"
                className="w-9 h-9 transition-all duration-100"
              />
            )}
          </div>
        </div>
      </button>

      {error && (
        <div className="mt-2 text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20 flex items-start gap-2">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
