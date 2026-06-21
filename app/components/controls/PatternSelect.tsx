import React, { useMemo, useCallback, useRef } from "react";
import {
  textureByLabel,
  textureThumbByLabel,
  SVG_THUMBS_BASE,
} from "../../lib/assets";
import WebcamToggle from "./WebcamToggle";
import ModelSize from "./ModelSize";

const BLENDS = [
  { label: "Add",        code: "ADD" },
  { label: "Multiply",   code: "MUL" },
  { label: "Difference", code: "DIF" },
  { label: "Exclusion",  code: "EXC" },
  { label: "Blend",      code: "BLD" },
  { label: "Burn",       code: "BRN" },
  { label: "Hard Light", code: "HRD" },
  { label: "Soft Light", code: "SFT" },
  { label: "Overlay",    code: "OVL" },
  { label: "Screen",     code: "SCR" },
] as const;

type BlendValue = (typeof BLENDS)[number]["label"];

type Props = {
  value: string;
  onChange: (label: string) => void;
  enabled: boolean;
  onToggleEnabled: () => void;
  className?: string;
  size?: number;
  webcamEnabled: boolean;
  onToggleWebcam: (enabled: boolean) => void;
  customTextureUrl: string | null;
  onUploadTexture: (url: string) => void;
  onClearCustomTexture: () => void;
  selectedBlendMode: string;
  onBlendChange: (v: string) => void;
  overlayScale: number;
  onOverlayScaleChange: (v: number) => void;
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
  customTextureUrl,
  onUploadTexture,
  onClearCustomTexture,
  selectedBlendMode,
  onBlendChange,
  overlayScale,
  onOverlayScaleChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onChange(value === label ? "None" : label);
    },
    [value, onChange],
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUploadTexture(url);
    e.target.value = "";
  };

  const handleUploadClick = () => {
    if (customTextureUrl) {
      onClearCustomTexture();
    } else {
      fileInputRef.current?.click();
    }
  };

  const isOpen = enabled;
  const hasOverlay = value !== "None" || webcamEnabled || !!customTextureUrl;
  // Overlay size bar (~39px expanded) + grid with padding (~62px) + spacing
  const blendPanelHeight = 108;

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
            onClick={onToggleEnabled}
            className={`w-4 h-4 ml-2 transition-transform duration-200 flex-shrink-0 cursor-pointer ${
              isOpen ? "rotate-180 -translate-y-[1px]" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

      {/* Panel body */}
      <div
        className={`px-3 pb-3 pt-1 overflow-hidden transition-all duration-200 bg-neutral-700 ${
          isOpen ? "rounded-b-xl" : "rounded-b-none"
        }`}
        style={{
          maxHeight: isOpen ? `${size + (hasOverlay ? blendPanelHeight : 0)}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        {/* Texture thumbnails */}
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
                  ${isSelected
                    ? "border-0 shadow-lg scale-[1.03] hover:scale-[1.00] !filter-none opacity-100"
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

        {/* Webcam + upload */}
        <div className="grid grid-cols-2 gap-2">
          <WebcamToggle enabled={webcamEnabled} onChange={onToggleWebcam} />

          <button
            type="button"
            onClick={handleUploadClick}
            className={`group relative w-full overflow-hidden rounded-2xl py-3 transition-all duration-100 ${
              customTextureUrl
                ? "bg-neutral-700"
                : "bg-neutral-800 hover:scale-[1.03] opacity-70 hover:opacity-100"
            }`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

            {customTextureUrl && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-red-500/3 to-transparent backdrop-blur-sm" />
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15), rgba(239, 68, 68, 0.08), transparent 70%)" }} />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent rounded-full" />
              </>
            )}

            <div className="relative flex items-center justify-center gap-2 z-10">
              <div className="flex flex-col items-start">
                <span className="text-xs tracking-widest font-black text-white">UPLOAD</span>
                {customTextureUrl && <span className="text-xs text-purple-300 animate-pulse">Custom active</span>}
              </div>
              <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
          </button>
        </div>

        {/* Overlay scale + blend — slides in when any overlay is active */}
        <div
          className="overflow-hidden transition-all duration-200"
          style={{
            maxHeight: hasOverlay ? `${blendPanelHeight}px` : "0px",
            opacity: hasOverlay ? 1 : 0,
          }}
        >
          {/* Overlay scale bar — replaces the dividing line */}
          <ModelSize
            value={overlayScale}
            onChange={onOverlayScaleChange}
            min={0.5}
            max={2.0}
            label="Overlay Scale"
            formatValue={(v) => `${Math.round(v * 100)}%`}
          />

          {/* Blend grid — px-0.5 py-1 gives ring/glow room so edge buttons keep rounded corners */}
          <div className="mt-2 px-0.5 pb-1 grid grid-cols-5 gap-1">
            {BLENDS.map((blend) => {
              const isSelected = blend.label === selectedBlendMode;
              return (
                <button
                  key={blend.label}
                  type="button"
                  title={blend.label}
                  onClick={() => onBlendChange(blend.label as BlendValue)}
                  className={`
                    h-6 rounded text-[9px] font-black font-victor tracking-wider
                    transition-all duration-100
                    ${isSelected
                      ? "bg-gradient-to-br from-purple-500/50 to-red-500/35 text-white ring-1 ring-purple-400/60 shadow-[0_0_8px_rgba(168,85,247,0.35)]"
                      : "bg-neutral-800/80 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-600"
                    }
                  `}
                >
                  {blend.code}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
