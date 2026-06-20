declare global {
  interface Window {
    hydraCanvas: HTMLCanvasElement | undefined;
    setHydraParams: ((x: number, y: number) => void) | undefined;
  }
}

export {};
