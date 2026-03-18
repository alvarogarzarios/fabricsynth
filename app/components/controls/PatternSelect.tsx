import React, { useMemo, useCallback } from "react";
import {
  textureByLabel,
  textureThumbByLabel,
  IMAGES_BASE,
  SVG_THUMBS_BASE,
} from "../../lib/assets";
import WebcamToggle from "./WebcamToggle";

type Props = {
  value: string;
  onChange: (label: string) => void;
  enabled: boolean;
  onToggleEnabled: () => void;
  className?: string;
  size?: number;
  webcamEnabled: boolean;
  onToggleWebcam: (enabled: boolean) => void;
};

export default function PatternSelect({
  value,
  onChange,
  enabled,
  className = "",
  size = 200,
  onToggleEnabled,
  webcamEnabled,
  onToggleWebcam,
}: Props) {
  // PRE-COMPUTE ALL URLS ONCE
  const PATTERNS = useMemo(
    () =>
      Object.entries(textureByLabel).map(([label]) => ({
        label,
        url: `${SVG_THUMBS_BASE}/${textureThumbByLabel[label]}.svg`,
      })),
    [],
  );

  const handlePatternClick = useCallback(
    (label: string) => {
      if (value === label) {
        // clicking again deselects
        onChange("None");
      } else {
        onChange(label);
      }
    },
    [value, onChange],
  );

  const handleToggleClick = useCallback(() => {
    onToggleEnabled();
  }, [onToggleEnabled]);

  const isOpen = enabled;

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 bg-neutral-700 text-white ${
          isOpen ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <span className="text-sm">Overlay</span>
        <button type="button" className="p-1">
          <svg
            onClick={handleToggleClick} // ← ADD THIS
            className={`w-4 h-4 ml-2 transition-transform duration-200 flex-shrink-0 cursor-pointer ${
              isOpen ? "rotate-180 -translate-y-[1px]" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>

      {/* Patterns Container */}
      <div
        className={`px-3 pb-3 pt-1 overflow-hidden transition-all duration-200 bg-neutral-700 ${
          isOpen ? "rounded-b-xl" : "rounded-b-none"
        }`}
        style={{
          maxHeight: isOpen ? `${size}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pb-3 grid grid-cols-6 gap-2">
          {PATTERNS.map((tex) => {
            const isSelected = tex.label === value;
            return (
              <button
                key={tex.label}
                type="button"
                onClick={() => handlePatternClick(tex.label)}
                className={`
                  relative aspect-square border rounded-lg overflow-hidden bg-no-repeat bg-cover bg-center
                  transition-all duration-100
                  ${
                    isSelected
                      ? "border-0 shadow-lg scale-[1.03] hover:scale-[1.00]  !filter-none opacity-100"
                      : "border-0 scale-[1.00] hover:scale-[1.03] brightness-40 grayscale hover:grayscale-0 opacity-50 hover:opacity-100"
                  }
                `}
                style={{
                  backgroundImage: `url(${tex.url})`,
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {isSelected && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/50 to-red-500/30 rounded-lg" />
                )}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <WebcamToggle enabled={webcamEnabled} onChange={onToggleWebcam} />
        </div>
      </div>
    </div>
  );
}
