export const OBJECTS_BASE = "/data/objects"; // served from /public/data/objects
export const IMAGES_BASE  = "/data/images";  // served from /public/data/images

export const modelByLabel: Record<string, string> = {
  Cap: "cap2",
  Sock: "sock",
  Balaclava: "balaclava",
  Bandana: "bandana",
  Sweater: "sweater",
  Hoodie: "hoodie",
  Mask: "mask",
  Backpack: "backpack",
  Pants: "pants",
  Scarf: "scarf",
  "T-Shirt": "tshirt",
};

export const allModelFiles = Object.values(modelByLabel);

export const textureByLabel: Record<string, string> = {
  Ukraine: "uapattern",
  Map: "geography",
  Receipts: "recipes",
  "Rich Kid": "lv6000",
  "Richer Kid": "goyard2",
  Checks: "check2",
  Ireland: "celtic",
  Mexico: "mexican",
  Moss: "mossy",
  Weird: "moss",
};

// Only the non-PNGs need to be listed here:
export const textureExtByBase: Record<string, "png" | "jpg"> = {
  trash: "jpg",
  mossy: "jpg",
  moss: "jpg",
  iceland: "jpg",
};