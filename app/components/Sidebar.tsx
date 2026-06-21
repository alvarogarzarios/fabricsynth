// app/components/Sidebar.tsx
import type { ReactNode } from "react";
import ToggleField from "./controls/ToggleField";
import HydraXYPad from "./controls/HydraXYPad";
import ModelSelect from "./controls/ModelSelect";
import ModelSize from "./controls/ModelSize";
import PatternSelect from "./controls/PatternSelect";

type SidebarProps = {
  imageScale: number;
  onImageScaleChange: (v: number) => void;

  selectedModel: string;
  onModelChange: (v: string) => void;

  selectedTexture: string;
  onTextureChange: (v: string) => void;

  selectedBlendMode: string;
  onBlendChange: (v: string) => void;

  fancyLighting: boolean;
  onToggleFancy: () => void;

  hydraEnabled: boolean;
  onToggleHydra: () => void;

  onHydraControl: (x: number, y: number) => void;

  webcamEnabled: boolean;
  onToggleWebcam: (enabled: boolean) => void;

  patternEnabled: boolean;
  onTogglePattern: () => void;

  customTextureUrl: string | null;
  onUploadTexture: (url: string) => void;
  onClearCustomTexture: () => void;

  overlayScale: number;
  onOverlayScaleChange: (v: number) => void;
};

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <div className="text-xs uppercase tracking-[0.12em] text-gray-400 font-syne mt-6 mb-3 first:mt-0 ml-2">
    {children}
  </div>
);

export default function Sidebar(props: SidebarProps) {
  const {
    imageScale,
    onImageScaleChange,
    selectedModel,
    onModelChange,
    selectedTexture,
    onTextureChange,
    selectedBlendMode,
    onBlendChange,
    fancyLighting,
    onToggleFancy,
    hydraEnabled,
    onToggleHydra,
    onHydraControl,
    webcamEnabled,
    onToggleWebcam,
    patternEnabled,
    onTogglePattern,
    customTextureUrl,
    onUploadTexture,
    onClearCustomTexture,
    overlayScale,
    onOverlayScaleChange,
  } = props;

  return (
    <div className="relative p-0 m-0 h-full text-neutral-100">
      <div className="h-full p-5 pl-7 backdrop-blur-2xl bg-white/10 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)] overflow-y-auto scrollbar-hide">
        {/* Logo */}
        <div className="flex items-left gap-3">
          <img
            src="/fabricsynth-logo.svg"
            alt="FabricSynth"
            className="w-[60%] h-[60%] mt-4 mb-1 ml-2"
          />
        </div>

        <SectionLabel>Model</SectionLabel>
        <ModelSelect value={selectedModel} onChange={onModelChange} />
        <ModelSize value={imageScale} onChange={onImageScaleChange} />

        <SectionLabel>Texture</SectionLabel>

        <HydraXYPad
          size={200}
          onChange={onHydraControl}
          enabled={hydraEnabled}
          onToggleEnabled={onToggleHydra}
          className="mb-3"
        />

        <PatternSelect
          value={selectedTexture}
          onChange={onTextureChange}
          enabled={patternEnabled}
          onToggleEnabled={onTogglePattern}
          webcamEnabled={webcamEnabled}
          onToggleWebcam={onToggleWebcam}
          customTextureUrl={customTextureUrl}
          onUploadTexture={onUploadTexture}
          onClearCustomTexture={onClearCustomTexture}
          selectedBlendMode={selectedBlendMode}
          onBlendChange={onBlendChange}
          overlayScale={overlayScale}
          onOverlayScaleChange={onOverlayScaleChange}
          className="mb-3"
          size={200}
        />

        <SectionLabel>Effects</SectionLabel>

        <ToggleField
          id="fancy-lighting"
          label={
            fancyLighting ? "Disable Fancy Lighting" : "Enable Fancy Lighting"
          }
          checked={fancyLighting}
          onChange={onToggleFancy}
        />
      </div>

      {/* Gradient fade at bottom to hint at more content */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
}
