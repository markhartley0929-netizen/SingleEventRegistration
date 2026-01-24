// src/constants/apparelSizes.ts

/* =========================
   Gender
========================= */

export const GENDERS = ["M", "F"] as const;
export type Gender = typeof GENDERS[number];

/* =========================
   Men Sizes (Unisex Fit)
========================= */

export const MEN_APPAREL_SIZES = [
  "SM",
  "MD",
  "LG",
  "XL",
  "2XL",
  "3XL",
  "4XL",
] as const;

export type MenApparelSize = typeof MEN_APPAREL_SIZES[number];

/* =========================
   Women-Specific Sizes
========================= */

export const WOMEN_APPAREL_SIZES = [
  "WXSM",
  "WSM",
  "WMD",
  "WLG",
  "WXL",
  "W2XL",
  "W3XL",
] as const;

export type WomenApparelSize = typeof WOMEN_APPAREL_SIZES[number];

/* =========================
   All Possible Sizes
========================= */

export const ALL_APPAREL_SIZES = [
  ...MEN_APPAREL_SIZES,
  ...WOMEN_APPAREL_SIZES,
] as const;

export type ApparelSize = typeof ALL_APPAREL_SIZES[number];
