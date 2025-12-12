// app/components/Sidebar.tsx
import ToggleField from "./controls/ToggleField";
import HydraXYPad from "./controls/HydraXYPad";
import ModelSelect from "./controls/ModelSelect";
import ModelSize from "./controls/ModelSize";
import TextureSelect from "./controls/TextureSelect";
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
};

const BLEND_OPTIONS = [
  "Add", "Multiply", "Difference", "Exclusion", "Blend",
  "Hard Light", "Soft Light", "Burn", "Overlay", "Screen",
].map(v => ({ value: v }));

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs uppercase tracking-[0.12em] text-gray-400 font-syne mt-6 mb-3 first:mt-0">
    {children}
  </div>
);

export default function Sidebar(props: SidebarProps) {
  const {
    imageScale, onImageScaleChange,
    selectedModel, onModelChange,
    selectedTexture, onTextureChange,
    selectedBlendMode, onBlendChange,
    fancyLighting, onToggleFancy,
    hydraEnabled, onToggleHydra,
    onHydraControl,
    webcamEnabled,
    onToggleWebcam,
  } = props;

  return (
    <div className="m-0 h-full text-neutral-100">
      <div className="h-full p-8 backdrop-blur-2xl bg-white/10 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)] overflow-y-auto">
        
        {/* Header with logo and title */}
        <div className="flex items-left gap-3">
          <img 
            src="/fabricsynth-logo.svg" 
            alt="FabricSynth" 
            className="w-[75%] h-[75%]"
          />
        </div>

        {/* Model */}
        <SectionLabel>Model</SectionLabel>
        <ModelSelect
          value={selectedModel}
          onChange={onModelChange}
        />

        <ModelSize
          value={imageScale}
          onChange={onImageScaleChange}
        />

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
        
        <TextureSelect
          value={selectedTexture}
          onChange={onTextureChange}
          className="mb-3"
        />

        <WebcamToggle 
          enabled={webcamEnabled} 
          onChange={onToggleWebcam} 
        />

        <BlendDial
          value={selectedBlendMode as any}
          onChange={onBlendChange}
        />

        {/* Effects */}
        <SectionLabel>Lighting</SectionLabel>

        <ToggleField
          id="fancy-lighting"
          label={fancyLighting ? "Disable Fancy Lighting" : "Enable Fancy Lighting"}
          checked={fancyLighting}
          onChange={onToggleFancy}
        />
      </div>
    </div>
  );
}
