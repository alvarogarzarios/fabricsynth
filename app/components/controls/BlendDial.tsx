// components/controls/BlendDial.tsx
import React, { useRef, useState } from "react";

const BLENDS = [
  { label: "Add", code: "A1" },
  { label: "Multiply", code: "M1" },
  { label: "Difference", code: "D1" },
  { label: "Exclusion", code: "E1" },
  { label: "Blend", code: "B1" },
  { label: "Burn", code: "B2" },
  { label: "Hard Light", code: "H1" },
  { label: "Soft Light", code: "S1" },
  { label: "Overlay", code: "O1" },
  { label: "Screen", code: "S2" },
] as const;

type BlendValue = (typeof BLENDS)[number]["label"];

type Props = {
  value: BlendValue;
  onChange: (v: BlendValue) => void;
  className?: string;
};

const STEPS = BLENDS.length; // 10

export default function BlendDial({ value, onChange, className = "" }: Props) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  const currentIndex = BLENDS.findIndex((b) => b.label === value) || 0;
  const currentBlend = BLENDS[currentIndex];

  const indexFromX = (clientX: number) => {
    if (!barRef.current) return currentIndex;

    const rect = barRef.current.getBoundingClientRect();
    const t = (clientX - rect.left) / rect.width; // 0..1
    const clamped = Math.max(0, Math.min(1, t));
    const idx = Math.round(clamped * (STEPS - 1));
    return idx;
  };

  const handlePointer = (clientX: number) => {
    const idx = indexFromX(clientX);
    const blend = BLENDS[idx];
    if (blend.label !== value) onChange(blend.label);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsActive(true);
    handlePointer(e.clientX);

    const move = (ev: MouseEvent) => handlePointer(ev.clientX);
    const up = () => {
      setIsActive(false);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsActive(true);
    const t = e.touches[0];
    handlePointer(t.clientX);

    const move = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (!touch) return;
      handlePointer(touch.clientX);
    };
    const end = () => {
      setIsActive(false);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", end);
  };

  const percent = (currentIndex / (STEPS - 1)) * 100;

  return (
    <div className={className}>
      {/* Full-width dial bar */}
      <div
        ref={barRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className={`
          relative w-full h-8 rounded-full
          bg-neutral-800
          cursor-pointer select-none
          overflow-hidden 
        `}
      >
        {/* Base track */}
        <div className="absolute inset-y-[10px] left-3 right-3 rounded-full bg-black border border-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]" />

        {/* Step markers */}
        {Array.from({ length: STEPS }).map((_, i) => {
          const t = i / (STEPS - 1 || 1);
          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 w-px h-1 bg-neutral-500/70"
              style={{ left: `calc(3px + ${t * 100}% * (1 - 6px/100%))` }}
            />
          );
        })}

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2
            w-3 h-6 rounded-full
            ${
              isActive
                ? "bg-gradient-to-br from-purple-400 to-red-400 shadow-[0_0_12px_rgba(168,85,247,0.9)]"
                : "bg-neutral-100 shadow hover:bg-gradient-to-br hover:from-purple-400 hover:to-red-400 hover:shadow-[0_0_12px_rgba(168,85,247,0.9)]"
            }
            transition-shadow duration-100
          `}
          style={{
            left: `calc(3px + (${percent}% * (1 - 6px/100%)) - 0.5rem)`,
          }}
        />
      </div>
    </div>
  );
}
