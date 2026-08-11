// Determine risk level from score
export function getRiskLevel(score: number): string {
  if (score > 100) {
    return "high";
  }

  if (score > 150) {
    return "critical";
  }

  return "normal";
}
