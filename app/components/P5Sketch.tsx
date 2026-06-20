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
  customTextureUrl: string | null;
}

export default function P5Sketch({
  imageScale,
  selectedModel,
  selectedTexture,
  webcamEnabled,
  selectedBlendMode,
  fancyLighting,
  hydraEnabled,
  customTextureUrl,
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
    customTextureUrl,
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
      customTextureUrl,
    };
  }, [
    imageScale,
    selectedModel,
    selectedTexture,
    webcamEnabled,
    selectedBlendMode,
    fancyLighting,
    hydraEnabled,
    customTextureUrl,
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

      // Pre-built outside draw() — no object recreation per frame
      const blends: Record<string, p5.BLEND_MODE> = {
        Add: p5.prototype.ADD,
        Multiply: p5.prototype.MULTIPLY,
        Difference: p5.prototype.DIFFERENCE,
        Exclusion: p5.prototype.EXCLUSION,
        Blend: p5.prototype.BLEND,
        "Hard Light": p5.prototype.HARD_LIGHT,
        "Soft Light": p5.prototype.SOFT_LIGHT,
        Burn: p5.prototype.BURN,
        Overlay: p5.prototype.OVERLAY,
        Screen: p5.prototype.SCREEN,
      };

      const sketch = (p: p5) => {
        const objMap: Record<string, p5.Geometry> = {};
        const imageCache: Record<string, p5.Image> = {};

        let pg: p5.Graphics | null = null;
        let hc: HTMLCanvasElement | null = null;
        let synth: any = null;

        let capture: p5.Element | null = null;

        // Cache container size — no DOM read per frame
        let cachedSize = { w: 0, h: 0 };
        const containerSize = () => {
          const el = containerRef.current;
          if (!el) return { w: p.windowWidth, h: p.windowHeight };
          const r = el.getBoundingClientRect();
          return { w: Math.max(1, r.width | 0), h: Math.max(1, r.height | 0) };
        };

        const ensurePG = () => {
          // 50% texture resolution = 4x less fillrate
          const TEX_SCALE = 0.5;
          const w = Math.ceil((hc?.width || p.width) * TEX_SCALE);
          const h = Math.ceil((hc?.height || p.height) * TEX_SCALE);

          if (!pg || pg.width !== w || pg.height !== h) {
            (pg as any)?.remove?.();
            pg = p.createGraphics(w, h, p.P2D);
          }
        };

        const ensureHydra = () => {
          if (!HydraCtor) {
            console.warn("[Hydra] hydra-synth is not installed or failed to import.");
            return;
          }
          if (synth) return;

          const canvas = document.createElement("canvas") as HTMLCanvasElement;
          const { w, h } = containerSize();
          canvas.width = w * 3;
          canvas.height = h * 3;
          const hydraInstance = new HydraCtor({
            canvas,
            detectAudio: false,
            makeGlobal: false,
          });
          hc = canvas;
          synth = hydraInstance.synth;

          window.hydraCanvas = hc;

          synth
            .osc(20, 0.05, 2)
            .rotate(0.2)
            .colorama(0.8)
            .kaleid(4)
            .modulate(synth.osc(10, 0.1).rotate(), 0.2)
            .out();

          window.setHydraParams = (x: number, y: number) => {
            const freq = 5 + x * 10;
            const amp = 1 + y * 4;
            const color = 5 + 5 * x;
            const kaleid = 2 + Math.floor(y * 6);
            const rotateSpeed = x * 2;

            synth
              .osc(freq, 0.05, amp)
              .rotate(rotateSpeed)
              .colorama(color)
              .kaleid(kaleid)
              .modulate(synth.osc(10 + y * 50, 0.1).rotate(x * 3), 0.2)
              .out();
          };

          console.debug("[Hydra] synth initialized");
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
              const videoElt = capture.elt as HTMLVideoElement;
              if (videoElt.srcObject instanceof MediaStream) {
                videoElt.srcObject.getTracks().forEach((track) => track.stop());
                videoElt.srcObject = null;
              }
              (capture as any).remove();
              capture = null;
              console.debug("[P5] webcam capture fully released");
            } catch (err) {
              console.warn("[P5] error releasing webcam:", err);
            }
          }
        };

        const resizeAll = () => {
          const newSize = containerSize();
          cachedSize = newSize;
          p.resizeCanvas(newSize.w, newSize.h);

          if (hc && pg) {
            synth.render();
            const ctx = pg.drawingContext as CanvasRenderingContext2D;
            if (ctx && hc.width > 0) {
              ctx.drawImage(hc, 0, 0, hc.width, hc.height, 0, 0, pg.width, pg.height);
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
            objMap[fileBase] = p.loadModel(
              `${OBJECTS_BASE}/${fileBase}.obj`,
              true,
            );
          });
        };

        p.setup = () => {
          p.pixelDensity(1); // Disable HiDPI — 4-9x pixel reduction on Retina
          p.setAttributes({ antialias: false });

          const { w, h } = containerSize();
          cachedSize = { w, h };
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
            customTextureUrl,
          } = propsRef.current;

          // Poll container size every 30 frames to catch layout changes (sidebar toggle etc.)
          if (p.frameCount % 30 === 0) {
            const newSize = containerSize();
            if (newSize.w !== cachedSize.w || newSize.h !== cachedSize.h) resizeAll();
          }
          const { w, h } = cachedSize;

          if (webcamEnabled && !capture) ensureCapture();
          else if (!webcamEnabled && capture) releaseCapture();

          p.background(0);

          if (fancyLighting) {
            p.pointLight(
              255,
              255,
              255,
              p.mouseX - w / 2,
              p.mouseY - h / 2,
              500,
            );
            p.ambientLight(100);
          } else {
            p.ambientLight(150);
          }

          ensurePG();

          if (!hydraEnabled) {
            pg!.clear();
            pg!.background(0);
          } else {
            pg!.clear();
          }

          if (hydraEnabled) {
            if (!synth) ensureHydra();
            if (hc) {
              synth.render();
              const ctx = pg!.drawingContext as CanvasRenderingContext2D;
              if (ctx && hc.width > 0) {
                ctx.drawImage(
                  hc,
                  0,
                  0,
                  hc.width,
                  hc.height,
                  0,
                  0,
                  pg!.width * 2,
                  pg!.height * 2,
                );
              }
            }
          }

          if (selectedTexture !== "None" || webcamEnabled || customTextureUrl) {
            pg!.blendMode(blends[selectedBlendMode] || p.BLEND);

            if (webcamEnabled && capture) {
              pg!.image(capture as any, 0, 0, pg!.width, pg!.height);
            } else if (customTextureUrl) {
              if (!imageCache[customTextureUrl]) {
                imageCache[customTextureUrl] = p.loadImage(customTextureUrl);
              }
              const tex = imageCache[customTextureUrl];
              if (tex && tex.width > 0) {
                pg!.image(tex, 0, 0, pg!.width, pg!.height);
              }
            } else if (selectedTexture !== "None") {
              const base = textureByLabel[selectedTexture];
              if (base && !imageCache[base]) {
                const ext = textureExtByBase[base] || "webp";
                imageCache[base] = p.loadImage(`${IMAGES_BASE}/${base}.${ext}`);
              }
              const tex = imageCache[base];
              if (tex && tex.width > 0) {
                pg!.image(tex, 0, 0, pg!.width, pg!.height);
              }
            }

            pg!.blendMode(p.BLEND);
          } else if (!hydraEnabled) {
            pg!.background(0);
          }

          p.noStroke();
          p.blendMode(p.BLEND);

          p.push();
          const baseScale = p.height / 700;
          p.scale(Math.max(0.001, imageScale) * baseScale);
          p.rotateY(p.radians(-p.frameCount / 5));

          if (selectedTexture !== "None" || webcamEnabled || hydraEnabled || customTextureUrl) {
            p.texture(pg!);
          } else {
            p.ambientMaterial(168, 0, 214);
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
