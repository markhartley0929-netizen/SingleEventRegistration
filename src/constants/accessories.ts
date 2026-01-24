// src/constants/accessories.ts

export const ACCESSORY_TYPES = ["Hat", "Headband"] as const;
export type AccessoryType = typeof ACCESSORY_TYPES[number];

export const ACCESSORY_SIZES = [
  "XSM",
  "SM/MD",
  "LG/XLG",
] as const;

export type AccessorySize = typeof ACCESSORY_SIZES[number];
