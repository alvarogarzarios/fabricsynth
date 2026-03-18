// app/components/Sidebar.tsx
import ToggleField from "./controls/ToggleField";
import HydraXYPad from "./controls/HydraXYPad";
import ModelSelect from "./controls/ModelSelect";
import ModelSize from "./controls/ModelSize";
import PatternSelect from "./controls/PatternSelect";
import WebcamToggle from "./controls/WebcamToggle";
import BlendDial from "./controls/BlendDial";

type SidebarProps = {
  imageScale: number;
  onImageScaleChange: (v: number) => void;

  selectedModel: string;
  onModelChange: (v: string) => void;

  selectedTexture: string;
  onTextureChange: (v: string) => void;

  selectedBlendMode: string;
  onBlendChange: (v: string) => void;

  darkMode: boolean;
  onToggleDark: () => void;

  fancyLighting: boolean;
  onToggleFancy: () => void;

  hydraEnabled: boolean;
  onToggleHydra: () => void;

  onHydraControl: (x: number, y: number) => void;

  webcamEnabled: boolean;
  onToggleWebcam: (enabled: boolean) => void;

  patternEnabled: boolean;
  onTogglePattern: () => void;
};

const BLEND_OPTIONS = [
  "Add",
  "Multiply",
  "Difference",
  "Exclusion",
  "Blend",
  "Hard Light",
  "Soft Light",
  "Burn",
  "Overlay",
  "Screen",
].map((v) => ({ value: v }));

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
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
  } = props;

  return (
    <div className="p-0 m-0 h-full text-neutral-100">
      <div className="h-full p-5 pl-7 backdrop-blur-2xl bg-white/10 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)] overflow-y-auto">
        {/* Header with logo and title */}
        <div className="flex items-left gap-3">
          <img
            src="/fabricsynth-logo.svg"
            alt="FabricSynth"
            className="w-[60%] h-[60%] mt-4 mb-1 ml-2"
          />
        </div>

        {/* Model */}
        <SectionLabel>Model</SectionLabel>
        <ModelSelect value={selectedModel} onChange={onModelChange} />

        <ModelSize value={imageScale} onChange={onImageScaleChange} />

        {/* Texture */}
        <SectionLabel>Texture</SectionLabel>

        {/* Hydra */}
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
          enabled={patternEnabled} // ← Use enabled prop
          onToggleEnabled={onTogglePattern}
          webcamEnabled={webcamEnabled}
          onToggleWebcam={onToggleWebcam}
          className="mb-3"
          size={200}
        />

        <SectionLabel>Blend</SectionLabel>

        <BlendDial
          className="mb-3"
          value={selectedBlendMode as any}
          onChange={onBlendChange}
        />

        <SectionLabel>Effects</SectionLabel>

        {/* Effects */}

        <ToggleField
          id="fancy-lighting"
          label={
            fancyLighting ? "Disable Fancy Lighting" : "Enable Fancy Lighting"
          }
          checked={fancyLighting}
          onChange={onToggleFancy}
        />
      </div>
    </div>
  );
}
