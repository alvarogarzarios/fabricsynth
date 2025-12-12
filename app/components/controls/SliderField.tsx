import React from "react";

type Props = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  className?: string;
  format?: (v: number) => string;
};

export default function SliderField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
  format = (v) => v.toFixed(2),
}: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium mb-1">
        {label}: {format(value)}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}