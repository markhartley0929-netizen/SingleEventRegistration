import {
  ALL_POSITIONS,
  INFIELD_POSITIONS,
  OUTFIELD_POSITIONS,
  Position,
} from "../constants/positions";

/**
 * Returns a list of valid secondary positions
 * based on the selected primary position.
 */
export function getSecondaryPositions(
  primary?: Position
): Position[] {
  // If nothing selected yet, allow everything
  if (!primary) {
    return [...ALL_POSITIONS];
  }

  // Start by removing the exact same position
  let allowed = ALL_POSITIONS.filter(
    (pos) => pos !== primary
  );

  // If primary is INF, remove all infield positions except P
  if (primary === "INF") {
    allowed = allowed.filter(
      (pos) => !INFIELD_POSITIONS.includes(pos as any)
    );
  }

  // If primary is OF, remove all outfield positions
  if (primary === "OF") {
    allowed = allowed.filter(
      (pos) => !OUTFIELD_POSITIONS.includes(pos as any)
    );
  }

  return allowed;
}