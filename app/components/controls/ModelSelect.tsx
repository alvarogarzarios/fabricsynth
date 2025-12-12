// components/controls/ModelSelect.tsx
import React, { useState } from "react";
import { modelByLabel } from "../../lib/assets";

type Props = {
  value: string;
  onChange: (label: string) => void;
  className?: string;
};

const MODEL_LABELS = Object.keys(modelByLabel);

export default function ModelSelect({ value, onChange, className = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center justify-between px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium transition-all ${
          isOpen ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <span className="text-sm">
          MODEL: <span className="font-semibold ml-1">{value}</span>
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
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

      {/* Dropdown body */}
      <div
        className={`overflow-hidden transition-all duration-200 bg-neutral-800 ${
          isOpen ? "rounded-b-xl" : ""
        }`}
        style={{
          maxHeight: isOpen ? MODEL_LABELS.length * 40 + 8 : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <ul className="py-1">
          {MODEL_LABELS.map((label) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => {
                  onChange(label);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  label === value
                    ? "bg-neutral-700 text-white"
                    : "text-gray-200 hover:bg-neutral-700"
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
