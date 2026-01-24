// src/constants/positions.ts

export const POSITIONS = {
  P: "P",
  C: "C",
  "1B": "1B",
  "2B": "2B",
  "3B": "3B",
  SS: "SS",
  LF: "LF",
  LCF: "LCF",
  RCF: "RCF",
  RF: "RF",
  INF: "INF",
  OF: "OF",
} as const;

export const INFIELD_POSITIONS = [
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
] as const;

export const OUTFIELD_POSITIONS = [
  "LF",
  "LCF",
  "RCF",
  "RF",
] as const;

export const ALL_POSITIONS = [
  "P",
  "C",
  "1B",
  "2B",
  "3B",
  "SS",
  "LF",
  "LCF",
  "RCF",
  "RF",
  "INF",
  "OF",
] as const;

export type Position = typeof ALL_POSITIONS[number];
