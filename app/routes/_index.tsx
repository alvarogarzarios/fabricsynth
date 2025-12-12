// app/routes/_index.tsx
import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import P5Sketch from "../components/P5Sketch";

export const meta: MetaFunction = () => ([
  { title: "FabricSynth" },
  { name: "description", content: "A p5-based visual sketch" },
]);

export default function Index() {
  const [imageScale, setImageScale] = useState(2.1);
  const [selectedModel, setSelectedModel] = useState("Cap");
  const [selectedTexture, setSelectedTexture] = useState("None");
  const [selectedBlendMode, setSelectedBlendMode] = useState("Add");
  const [fancyLighting, setFancyLighting] = useState(false);
  const [hydraEnabled, setHydraEnabled] = useState(true); // NEW
  const [webcamEnabled, setWebcamEnabled] = useState(false); // NEW

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/4 h-full">
        <Sidebar
          imageScale={imageScale}
          onImageScaleChange={setImageScale}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          selectedTexture={selectedTexture}
          onTextureChange={setSelectedTexture}
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
        />
      </div>

      <div className="bg-white dark:bg-black w-3/4 h-full">
        <P5Sketch
          imageScale={imageScale}
          selectedModel={selectedModel}
          selectedTexture={selectedTexture}
          selectedBlendMode={selectedBlendMode}
          fancyLighting={fancyLighting}
          hydraEnabled={hydraEnabled}
          webcamEnabled={webcamEnabled}
        />
      </div>
    </div>
  );
}