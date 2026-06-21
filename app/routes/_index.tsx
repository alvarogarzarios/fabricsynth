// app/routes/_index.tsx
import type { MetaFunction } from "@remix-run/node";
import { useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import P5Sketch from "../components/P5Sketch";

export const meta: MetaFunction = () => [
  { title: "FabricSynth" },
  { name: "description", content: "A p5-based visual sketch" },
];

export default function Index() {
  const [imageScale, setImageScale] = useState(2.1);
  const [selectedModel, setSelectedModel] = useState("Cap");
  const [selectedTexture, setSelectedTexture] = useState("None");
  const [selectedBlendMode, setSelectedBlendMode] = useState("Add");
  const [fancyLighting, setFancyLighting] = useState(false);
  const [hydraEnabled, setHydraEnabled] = useState(true);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [patternEnabled, setPatternEnabled] = useState(true);
  const [customTextureUrl, setCustomTextureUrl] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overlayScale, setOverlayScale] = useState(1.5);

  const handleTextureChange = useCallback((label: string) => {
    setSelectedTexture(label);
    // Selecting a preset clears the uploaded custom texture
    if (customTextureUrl) {
      URL.revokeObjectURL(customTextureUrl);
      setCustomTextureUrl(null);
    }
  }, [customTextureUrl]);

  const handleUploadTexture = useCallback((url: string) => {
    if (customTextureUrl) URL.revokeObjectURL(customTextureUrl);
    setCustomTextureUrl(url);
    setSelectedTexture("None"); // deselect any preset
  }, [customTextureUrl]);

  const handleClearCustomTexture = useCallback(() => {
    if (customTextureUrl) URL.revokeObjectURL(customTextureUrl);
    setCustomTextureUrl(null);
  }, [customTextureUrl]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((v) => !v);
    // Fire a resize event after the 300ms CSS transition so p5 resizes to the new container
    setTimeout(() => window.dispatchEvent(new Event("resize")), 320);
  }, []);

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar — collapses to w-0, inner div keeps content at full width during slide */}
      <div
        className={`h-full flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-1/4" : "w-0"
        }`}
      >
        <div className="w-[25vw] h-full">
          <Sidebar
            imageScale={imageScale}
            onImageScaleChange={setImageScale}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            selectedTexture={selectedTexture}
            onTextureChange={handleTextureChange}
            selectedBlendMode={selectedBlendMode}
            onBlendChange={setSelectedBlendMode}
            fancyLighting={fancyLighting}
            onToggleFancy={() => setFancyLighting((v) => !v)}
            hydraEnabled={hydraEnabled}
            onToggleHydra={() => setHydraEnabled((v) => !v)}
            onHydraControl={(x, y) => {
              window.setHydraParams?.(x, y);
            }}
            webcamEnabled={webcamEnabled}
            onToggleWebcam={setWebcamEnabled}
            patternEnabled={patternEnabled}
            onTogglePattern={() => setPatternEnabled((prev: boolean) => !prev)}
            customTextureUrl={customTextureUrl}
            onUploadTexture={handleUploadTexture}
            onClearCustomTexture={handleClearCustomTexture}
            overlayScale={overlayScale}
            onOverlayScaleChange={setOverlayScale}
          />
        </div>
      </div>

      {/* Canvas — expands to fill remaining space, overflow-hidden prevents scrollbar during slide */}
      <div className="relative flex-1 h-full bg-black overflow-hidden min-w-0">
        <P5Sketch
          imageScale={imageScale}
          selectedModel={selectedModel}
          selectedTexture={selectedTexture}
          selectedBlendMode={selectedBlendMode}
          fancyLighting={fancyLighting}
          hydraEnabled={hydraEnabled}
          webcamEnabled={webcamEnabled}
          customTextureUrl={customTextureUrl}
          overlayScale={overlayScale}
        />

        {/* Sidebar toggle */}
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur border border-white/10 flex items-center justify-center transition-colors duration-200"
        >
          <svg
            className={`w-4 h-4 text-white/60 hover:text-white transition-transform duration-300 ${
              sidebarOpen ? "" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
