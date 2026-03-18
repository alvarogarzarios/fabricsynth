export const OBJECTS_BASE = "/data/objects"; // served from /public/data/objects
export const IMAGES_BASE  = "/data/images";  // served from /public/data/images
export const SVG_THUMBS_BASE = "/data/svg-thumbs"; // served from /public/data/svg-thumbs

export const modelByLabel: Record<string, string> = {
  Cap: "cap2",
  Balaclava: "balaclava",
  Bandana: "bandana",
  Sweater: "sweater",
  Hoodie: "hoodie",
  Mask: "mask",
  Backpack: "backpack",
  Pants: "pants",
  Scarf: "scarf",
};

export const allModelFiles = Object.values(modelByLabel);

export const textureByLabel: Record<string, string> = {
  Checks: "checks",
  Organic: "organic",
  Halftone: "halftone",
  Doodles: "doodles",
  Flowers: "flowers",
  Receipts: "receipts",
  // "Richer Kid": "goyard2",
  // Ireland: "celtic",
  // Mexico: "mexican",
  // Moss: "mossy",
  // Weird: "moss",
  // Ukraine: "uapattern",
};

export const textureThumbByLabel: Record<string, string> = {
  Checks: "checks-thumb",
  Organic: "organic-thumb",
  Halftone: "halftone-thumb",
  Doodles: "doodles-thumb",
  Flowers: "flowers-thumb",
  Receipts: "receipts-thumb",
  // ...
};

export const textureExtByBase: Record<string, "png" | "jpg"> = {
  trash: "jpg",
  mossy: "jpg",
  moss: "jpg",
  iceland: "jpg",
};