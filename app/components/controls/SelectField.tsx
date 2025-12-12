import React from "react";

type Option = { value: string; label?: string };

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  className?: string;
};

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  className,
}: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-2 py-1 text-neutral-900"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label ?? opt.value}
          </option>
        ))}
      </select>
    </div>
  );
}