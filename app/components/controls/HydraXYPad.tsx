// components/controls/HydraXYPad.tsx
import React, { useRef, useEffect, useState } from "react";

type Props = {
  onChange: (x: number, y: number) => void;
  className?: string;
  size?: number;
  enabled: boolean;
  onToggleEnabled: () => void;
};

export default function HydraXYPad({
  onChange,
  className = "",
  size = 200,
  enabled,
  onToggleEnabled,
}: Props) {
  const padRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [isActive, setIsActive] = useState(false); // hover/drag state

  useEffect(() => {
    onChange(pos.x, pos.y);
  }, [pos, onChange]);

  const updatePosFromEvent = (e: React.MouseEvent | React.TouchEvent) => {
    if (!enabled) return;

    const rect = padRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));

    setPos({ x, y });
  };

  const isOpen = enabled; // open when Hydra enabled

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Header row: label + toggle */}
      <div
        className={`flex items-center justify-between px-4 py-2 bg-neutral-700 text-white ${
          isOpen ? "rounded-t-xl" : "rounded-xl"
        }`}
      >
        <span className="text-sm">Hydra</span>

        <button
          type="button"
          onClick={onToggleEnabled}
          className={`
            relative w-10 h-5 rounded-full transition-colors duration-200
            ${enabled ? "bg-purple-500/70" : "bg-neutral-500/60"}
          `}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow
              transition-transform duration-200
              ${enabled ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </button>
      </div>

      {/* Pad Container */}
      <div
        className={`
          overflow-hidden transition-all duration-200 bg-neutral-800
          ${isOpen ? "rounded-b-xl" : "rounded-b-none"}
        `}
        style={{
          maxHeight: isOpen ? `${size}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          ref={padRef}
          className="relative bg-neutral-700 touch-none overflow-hidden"
          style={{ width: "100%", height: size }}
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
          onMouseDown={(e) => {
            setIsActive(true);
            updatePosFromEvent(e);
            const move = (e: MouseEvent) => updatePosFromEvent(e as any);
            const up = () => {
              setIsActive(false);
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
          onTouchStart={(e) => {
            setIsActive(true);
            updatePosFromEvent(e);
            const move = (e: TouchEvent) => updatePosFromEvent(e as any);
            const end = () => {
              setIsActive(false);
              window.removeEventListener("touchmove", move);
              window.removeEventListener("touchend", end);
            };
            window.addEventListener("touchmove", move);
            window.addEventListener("touchend", end);
          }}
        >
          <canvas
            ref={(el) => {
              if (!el) return;

              const ctx = el.getContext("2d");
              if (!ctx) return;

              const drawFrame = () => {
                const container = padRef.current;
                const hydraCanvas = (window as any).hydraCanvas as
                  | HTMLCanvasElement
                  | undefined;

                if (!container) {
                  requestAnimationFrame(drawFrame);
                  return;
                }

                const rect = container.getBoundingClientRect();
                const displayWidth = rect.width || 1;
                const displayHeight = rect.height || 1;

                const dpr = window.devicePixelRatio || 1;
                const requiredWidth = Math.floor(displayWidth * dpr);
                const requiredHeight = Math.floor(displayHeight * dpr);

                if (
                  el.width !== requiredWidth ||
                  el.height !== requiredHeight
                ) {
                  el.width = requiredWidth;
                  el.height = requiredHeight;
                  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                }

                ctx.clearRect(0, 0, displayWidth, displayHeight);

                if (
                  hydraCanvas &&
                  hydraCanvas.width > 0 &&
                  hydraCanvas.height > 0
                ) {
                  ctx.globalAlpha = 0.3;
                  ctx.save();

                  ctx.beginPath();
                  const radius = 12;
                  ctx.moveTo(radius, 0);
                  ctx.lineTo(displayWidth - radius, 0);
                  ctx.quadraticCurveTo(displayWidth, 0, displayWidth, radius);
                  ctx.lineTo(displayWidth, displayHeight - radius);
                  ctx.quadraticCurveTo(
                    displayWidth,
                    displayHeight,
                    displayWidth - radius,
                    displayHeight,
                  );
                  ctx.lineTo(radius, displayHeight);
                  ctx.quadraticCurveTo(
                    0,
                    displayHeight,
                    0,
                    displayHeight - radius,
                  );
                  ctx.lineTo(0, radius);
                  ctx.quadraticCurveTo(0, 0, radius, 0);
                  ctx.closePath();
                  ctx.clip();

                  const scale = 1.25;
                  const sourceWidth = hydraCanvas.width;
                  const sourceHeight = hydraCanvas.height;
                  const scaledWidth = sourceWidth * scale;
                  const scaledHeight = sourceHeight * scale;
                  const offsetX = (el.width - scaledWidth) / 4;
                  const offsetY = (el.height - scaledHeight) / 4;

                  ctx.drawImage(
                    hydraCanvas,
                    offsetX,
                    offsetY,
                    scaledWidth,
                    scaledHeight,
                  );

                  ctx.restore();
                }

                requestAnimationFrame(drawFrame);
              };

              drawFrame();
            }}
            className="absolute inset-0 z-0 grayscale opacity-30 w-full h-full"
          />

          {/* Selector circle */}
          <div
            className={`
              absolute w-4 h-4 rounded-full pointer-events-none
              transition-colors transition-shadow duration-150
              ${
                isActive
                  ? "bg-gradient-to-br from-purple-400 to-red-400 shadow-[0_0_12px_rgba(168,85,247,0.9)]"
                  : "bg-neutral-100 shadow"
              }
            `}
            style={{
              left: `calc(${pos.x * 100}% - 0.5rem)`,
              top: `calc(${pos.y * 100}% - 0.5rem)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
