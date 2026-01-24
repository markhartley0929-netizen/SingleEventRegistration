// src/utils/apparelSizeRules.ts

import {
  MEN_APPAREL_SIZES,
  WOMEN_APPAREL_SIZES,
  ALL_APPAREL_SIZES,
  ApparelSize,
  Gender,
} from "@/constants/apparelSizes";

/**
 * Returns the apparel sizes visible to a registrant
 * based on their gender selection.
 */
export function getVisibleApparelSizes(
  gender?: Gender | ""
): ApparelSize[] {
  if (!gender) {
    // No gender selected yet → show everything
    return [...ALL_APPAREL_SIZES];
  }

  if (gender === "M") {
    return [...MEN_APPAREL_SIZES];
  }

  // gender === "F"
  return [
    ...MEN_APPAREL_SIZES,
    ...WOMEN_APPAREL_SIZES,
  ];
}
