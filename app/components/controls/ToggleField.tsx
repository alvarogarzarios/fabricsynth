import React from "react";

type Props = {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
};

export default function ToggleField({ id, label, checked, onChange, className }: Props) {
  return (
    <div className={className}>
      <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer">
        <input id={id} type="checkbox" checked={checked} onChange={onChange} />
        <span>{label}</span>
      </label>
    </div>
  );
}