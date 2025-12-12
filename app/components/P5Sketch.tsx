// app/components/P5Sketch.tsx
import { useEffect, useRef } from "react";
import type p5 from "p5";
import {
  modelByLabel,
  allModelFiles,
  textureByLabel,
  textureExtByBase,
  OBJECTS_BASE,
  IMAGES_BASE,
} from "../lib/assets";

interface SketchProps {
  imageScale: number;
  selectedModel: string;
  selectedTexture: string;
  webcamEnabled: boolean;
  selectedBlendMode: string;
  fancyLighting: boolean;
  hydraEnabled: boolean;
}

export default function P5Sketch({
  imageScale,
  selectedModel,
  selectedTexture,
  webcamEnabled,
  selectedBlendMode,
  fancyLighting,
  hydraEnabled,
}: SketchProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const propsRef = useRef({
    imageScale,
    selectedModel,
    selectedTexture,
    webcamEnabled,
    selectedBlendMode,
    fancyLighting,
    hydraEnabled,
  });

  useEffect(() => {
    propsRef.current = {
      imageScale,
      selectedModel,
      selectedTexture,
      webcamEnabled,
      selectedBlendMode,
      fancyLighting,
      hydraEnabled,
    };
  }, [
    imageScale,
    selectedModel,
    selectedTexture,
    webcamEnabled,
    selectedBlendMode,
    fancyLighting,
    hydraEnabled,
  ]);

  useEffect(() => {
    let p5Instance: p5 | null = null;
    let cancelled = false;

    import("p5").then(async ({ default: p5 }) => {
      if (cancelled) return;

      let HydraCtor: any = null;
      if (typeof window !== "undefined") {
        try {
          HydraCtor = (await import("hydra-synth")).default;
        } catch {
          // optional
        }
      }

      const sketch = (p: p5) => {
        const objMap: Record<string, p5.Geometry> = {};
        const imageCache: Record<string, p5.Image> = {};

        let pg: p5.Graphics | null = null;
        const synthCount = 3;
        const hc: HTMLCanvasElement[] = new Array(synthCount);
        const synth: Array<any> = new Array(synthCount);

        let capture: p5.Element | null = null;

        const containerSize = () => {
          const el = containerRef.current;
          if (!el) return { w: p.windowWidth, h: p.windowHeight };
          const r = el.getBoundingClientRect();
          return { w: Math.max(1, r.width | 0), h: Math.max(1, r.height | 0) };
        };

        const ensurePG = () => {
          const w = hc[1]?.width || p.width;
          const h = hc[1]?.height || p.height;
          if (!pg || pg.width !== w || pg.height !== h) {
            (pg as any)?.remove?.();
            pg = p.createGraphics(w, h);
          }
        };

        const ensureHydra = () => {
          if (!HydraCtor) {
            console.warn(
              "[Hydra] hydra-synth is not installed or failed to import."
            );
            return;
          }
          if (synth[1]) return;

          for (let i = 0; i < synthCount; i++) {
            const canvas = document.createElement("canvas") as HTMLCanvasElement;
            hc[i] = canvas;
            const { w, h } = containerSize();
            hc[i].width = w * 3;
            hc[i].height = h * 3;
            const hydraInstance = new HydraCtor({
              canvas: hc[i],
              detectAudio: false,
              makeGlobal: false,
            });
            synth[i] = hydraInstance.synth;
          }

          window.hydraCanvas = hc[1];

          synth[1]
            .osc(20, 0.05, 2)
            .rotate(0.2)
            .colorama(0.8)
            .kaleid(4)
            .modulate(synth[1].osc(10, 0.1).rotate(), 0.2)
            .out();

          window.setHydraParams = (x: number, y: number) => {
            const freq = 5 + x * 40;
            const amp = 1 + y * 4;
            const color = 0.5 + 0.5 * x;
            const kaleid = 2 + Math.floor(y * 6);
            const rotateSpeed = x * 2;

            synth[1]
              .osc(freq, 0.1, amp)
              .rotate(rotateSpeed)
              .colorama(color)
              .kaleid(kaleid)
              .modulate(
                synth[1]
                  .osc(10 + y * 20, 0.1)
                  .rotate(x * 3),
                0.2
              )
              .out();
          };

          console.debug("[Hydra] multi-synth initialized");
        };

        const ensureCapture = () => {
          if (capture) return;

          try {
            capture = (p as any).createCapture((p as any).VIDEO);
            (capture.elt as HTMLVideoElement).width = 1920;
            (capture.elt as HTMLVideoElement).height = 1080;
            capture.hide();
            console.debug("[P5] webcam capture initialized");
          } catch (err) {
            console.warn("[P5] webcam unavailable:", err);
            capture = null;
          }
        };

const releaseCapture = () => {
  if (capture) {
    try {
      // Get the video element
      const videoElt = capture.elt as HTMLVideoElement;
      
      // Stop all tracks in the stream
      if (videoElt.srcObject instanceof MediaStream) {
        videoElt.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        videoElt.srcObject = null;
      }
      
      // Remove from DOM
      (capture as any).remove();
      capture = null;
      console.debug("[P5] webcam capture fully released");
    } catch (err) {
      console.warn("[P5] error releasing webcam:", err);
    }
  }
};

        const resizeAll = () => {
          const { w, h } = containerSize();
          p.resizeCanvas(w, h);
          for (let i = 0; i < synthCount; i++) {
            if (hc[i]) {
              const w2 = w * 2;
              const h2 = h * 2;
              if (hc[i].width !== w2 || hc[i].height !== h2) {
                hc[i].width = w2;
                hc[i].height = h2;
              }
            }
          }

          if (pg) {
            pg.remove();
            pg = null;
          }
          ensurePG();
        };

        p.preload = () => {
          allModelFiles.forEach((fileBase) => {
            objMap[fileBase] = p.loadModel(`${OBJECTS_BASE}/${fileBase}.obj`, true);
          });
        };

        p.setup = () => {
          const { w, h } = containerSize();
          p.createCanvas(w, h, p.WEBGL);
          ensurePG();
        };

        p.draw = () => {
          const {
            imageScale,
            selectedModel,
            selectedTexture,
            webcamEnabled,
            selectedBlendMode,
            fancyLighting,
            hydraEnabled,
          } = propsRef.current;

          const { w, h } = containerSize();
          if (p.width !== w || p.height !== h) resizeAll();

          // Handle webcam lifecycle
          if (webcamEnabled && !capture) {
            ensureCapture();
          } else if (!webcamEnabled && capture) {
            releaseCapture();
          }

          p.background(0);

          /* fancy lighting */
          if (fancyLighting) {
            p.pointLight(255, 255, 255, p.mouseX - w / 2, p.mouseY - h / 2, 500);
            p.ambientLight(100);
          } else {
            p.ambientLight(150);
          }

          // compose 2D texture
          ensurePG();

          if (!hydraEnabled) {
            pg!.clear();
            pg!.background(0);
          } else {
            pg!.clear();
          }

          const blends: Record<string, p5.BLEND_MODE> = {
            Add: p.ADD,
            Multiply: p.MULTIPLY,
            Difference: p.DIFFERENCE,
            Exclusion: p.EXCLUSION,
            Blend: p.BLEND,
            "Hard Light": p.HARD_LIGHT,
            "Soft Light": p.SOFT_LIGHT,
            Burn: p.BURN,
            Overlay: p.OVERLAY,
            Screen: p.SCREEN,
          };

          // Hydra rendering block
          if (hydraEnabled) {
            if (!synth[1]) ensureHydra();
            if (hc[1]) {
              synth[1].render();
              const ctx = pg!.drawingContext as CanvasRenderingContext2D;
              if (ctx && hc[1]?.width > 0) {
                try {
                  ctx.drawImage(
                    hc[1],
                    0,
                    0,
                    hc[1].width,
                    hc[1].height,
                    0,
                    0,
                    pg!.width * 4,
                    pg!.height * 4
                  );
                } catch (err) {
                  console.warn("Hydra drawImage error:", err);
                }
              }
            }
          }

          // Texture/webcam overlay
          if (selectedTexture !== "None" || webcamEnabled) {
            (pg as p5.Graphics).blendMode?.(
              blends[selectedBlendMode] || p.BLEND
            );

            if (webcamEnabled && capture) {
              pg!.image(capture as any, 0, 0, pg!.width, pg!.height);
            } else if (selectedTexture !== "None") {
              const base = textureByLabel[selectedTexture];
              if (base) {
                if (!imageCache[base]) {
                  const ext = textureExtByBase[base] || "png";
                  imageCache[base] = p.loadImage(`${IMAGES_BASE}/${base}.${ext}`);
                }
                const tex = imageCache[base];
                if (tex && tex.width > 0) {
                  pg!.image(tex, 0, 0, pg!.width, pg!.height);
                }
              }
            }

            (pg as p5.Graphics).blendMode?.(p.BLEND);
          } else if (!hydraEnabled) {
            pg!.background(0);
          }

          // 3D draw
          p.noStroke();
          p.blendMode(p.BLEND);

          p.push();
          const baseScale = p.height / 700;
          p.scale(Math.max(0.001, imageScale) * baseScale);
          p.rotateY(p.radians(-p.frameCount / 5));

          if (selectedTexture !== "None" || webcamEnabled || hydraEnabled) {
            p.texture(pg!);
          } else {
            p.ambientMaterial(255);
          }

          const fileBase =
            modelByLabel[selectedModel] ||
            selectedModel.toLowerCase().replace("-", "");
          const geo = objMap[fileBase];
          if (geo) p.model(geo);

          p.pop();
        };

        p.windowResized = () => {
          resizeAll();
        };
      };

      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
        p5Instance = new p5(sketch, containerRef.current);
      }
    });

    return () => {
      cancelled = true;
      p5Instance?.remove();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full bg-black" />;
}
