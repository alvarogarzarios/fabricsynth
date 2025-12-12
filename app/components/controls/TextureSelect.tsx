// components/controls/TextureSelect.tsx
import React from "react";
import { textureByLabel } from "../../lib/assets";

type Props = {
  value: string;                // "" means None
  onChange: (label: string) => void;
  className?: string;
};

// Map labels to compact codes
const TEXTURES = Object.keys(textureByLabel).map((label, index) => {
  const firstLetter = label[0]?.toUpperCase() ?? "T";
  const code = `${firstLetter}${index + 1}`;
  return { label, code };
});

export default function TextureSelect({
  value,
  onChange,
  className = "",
}: Props) {
  const handleClick = (label: string) => {
    if (value === label) {
      // Clicking the active one toggles it off -> None
      onChange("None");
    } else {
      onChange(label);
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-5 gap-[4px]">
        {TEXTURES.map((tex) => {
          const isActive = tex.label === value;

          return (
            <button
              key={tex.label}
              type="button"
              onClick={() => handleClick(tex.label)}
              className={`
                relative flex items-center justify-center
                h-8 rounded-md text-[11px] font-victor
                border transition-all duration-150
                ${
                  isActive
                    ? "bg-neutral-900 border-purple-400/80 text-white shadow-[0_3px_6px_rgba(0,0,0,0.7)] -translate-y-[1px]"
                    : "bg-neutral-800/90 border-neutral-600 text-gray-200 hover:bg-neutral-700 hover:border-neutral-400"
                }
              `}
            >
              {isActive && (
                <div className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-br from-purple-500/18 via-red-500/10 to-transparent" />
              )}

              <div className="pointer-events-none absolute inset-x-[2px] top-[1px] h-px rounded-full bg-white/10" />

              <span className="relative z-10 tracking-[0.08em]">
                {tex.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
