// components/controls/ModelSize.tsx
import React, { useState } from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  className?: string;
};

export default function ModelSize({
  value,
  onChange,
  className = "",
}: Props) {
  const [active, setActive] = useState(false);

  const min = 0.6;
  const max = 3.6;
  const center = (min + max) / 2; // 2.1
  const percentage = ((value - min) / (max - min)) * 100;

  const relativePercent =
    100 + ((value - center) / (center - min)) * 50; // 50–150%

  return (
    <div className={className}>
      <div
        className={`
          group relative flex items-center mt-[15px] 
          transition-all duration-200
          ${active ? "h-6" : "h-3"}
        `}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >

        {/* Base bar (neutral) */}
        <div
          className={`
            absolute inset-0 rounded-xl overflow-hidden
            border border-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]
            transition-colors duration-150
            bg-black backdrop-blur-sm
          `}
        />

        {/* Filled portion */}
        <div
          className={`
            absolute inset-y-0 left-0 rounded-xl
            transition-colors duration-150
            ${active
              ? "bg-gradient-to-r from-purple-400/50 via-purple-300/35 to-red-300/25"
              : "bg-neutral-700"}
          `}
          style={{ width: `${percentage}%` }}
        />

        {/* Label inside pill */}
        <div
          className={`
            absolute left-4 text-[9px] uppercase font-victor text-neutral-200/80 pointer-events-none
            transition-opacity duration-150
            ${active ? "opacity-100" : "opacity-0"}
          `}
        >
          Model Scale
        </div>

        {/* Relative percentage on the right */}
        <div
          className={`
            absolute right-4 text-xs font-victor text-neutral-200/80 pointer-events-none
            transition-opacity duration-150
            ${active ? "opacity-100" : "opacity-0"}
          `}
        >
          {Math.round(relativePercent)}%
        </div>

        {/* Invisible native range control */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setActive(true)}
          onMouseUp={() => setActive(false)}
          onTouchStart={() => setActive(true)}
          onTouchEnd={() => setActive(false)}
          className="relative w-full h-8 appearance-none bg-transparent cursor-pointer z-10 model-size-slider"
        />
      </div>

      <style>{`
        input[type="range"].model-size-slider {
          -webkit-appearance: none;
          appearance: none;
        }

        /* WebKit */
        input[type="range"].model-size-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 0;
          height: 0;
          border-radius: 999px;
          background: transparent;
          box-shadow: none;
        }

        /* Firefox */
        input[type="range"].model-size-slider::-moz-range-thumb {
          width: 0;
          height: 0;
          border-radius: 999px;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        input[type="range"].model-size-slider::-webkit-slider-runnable-track {
          background: transparent;
        }

        input[type="range"].model-size-slider::-moz-range-track {
          background: transparent;
        }

        input[type="range"].model-size-slider::-moz-range-progress {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
