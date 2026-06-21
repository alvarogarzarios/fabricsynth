// components/controls/ModelSize.tsx
import { useState } from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  min?: number;
  max?: number;
  label?: string;
  formatValue?: (v: number) => string;
};

const defaultFormat = (v: number, min: number, max: number) => {
  const center = (min + max) / 2;
  return `${Math.round(100 + ((v - center) / (center - min)) * 50)}%`;
};

export default function ModelSize({
  value,
  onChange,
  className = "",
  min = 0.6,
  max = 3.6,
  label = "Model Scale",
  formatValue,
}: Props) {
  const [active, setActive] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue
    ? formatValue(value)
    : defaultFormat(value, min, max);

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
        {/* Base bar */}
        <div className="absolute inset-0 rounded-xl overflow-hidden border border-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] bg-black backdrop-blur-sm" />

        {/* Filled portion */}
        <div
          className={`
            absolute inset-y-0 left-0 rounded-xl transition-colors duration-150
            ${active
              ? "bg-gradient-to-r from-purple-400/50 via-purple-300/35 to-red-300/25"
              : "bg-white/20"}
          `}
          style={{ width: `${percentage}%` }}
        />

        {/* Left label */}
        <div
          className={`
            absolute left-4 text-[9px] uppercase font-victor text-neutral-200/80 pointer-events-none
            transition-opacity duration-150
            ${active ? "opacity-100" : "opacity-0"}
          `}
        >
          {label}
        </div>

        {/* Right value */}
        <div
          className={`
            absolute right-4 text-xs font-victor text-neutral-200/80 pointer-events-none
            transition-opacity duration-150
            ${active ? "opacity-100" : "opacity-0"}
          `}
        >
          {displayValue}
        </div>

        {/* Invisible native range */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={value}
          onChange={(e) => onChange(Math.max(min, Math.min(max, parseFloat(e.target.value))))}
          onTouchStart={() => setActive(true)}
          onTouchEnd={() => setActive(false)}
          className="relative w-full h-8 appearance-none bg-transparent cursor-pointer z-10 model-size-slider"
        />
      </div>

      <style>{`
        input[type="range"].model-size-slider { -webkit-appearance: none; appearance: none; }
        input[type="range"].model-size-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; background: transparent; box-shadow: none; }
        input[type="range"].model-size-slider::-moz-range-thumb { width: 0; height: 0; background: transparent; border: none; box-shadow: none; }
        input[type="range"].model-size-slider::-webkit-slider-runnable-track { background: transparent; }
        input[type="range"].model-size-slider::-moz-range-track { background: transparent; }
        input[type="range"].model-size-slider::-moz-range-progress { background: transparent; }
      `}</style>
    </div>
  );
}
