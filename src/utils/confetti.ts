import confetti from "canvas-confetti";

// Confetti origin point
export interface ConfettiOrigin {
  x: number;
  y: number;
}

/**
 * Trigger a celebration confetti effect
 * @param origin - Origin point for confetti (defaults to center-bottom)
 */
export const celebrate = (
  origin: ConfettiOrigin = { x: 0.5, y: 0.6 },
): void => {
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    scalar: 0.9,
    origin,
    colors: ["#fbbf24", "#fcd34d", "#f59e0b", "#fde68a", "#d97706"],
  });
};

/**
 * Trigger a big celebration with continuous confetti from both sides
 */
export const celebrateBig = (): void => {
  const duration = 800;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#fbbf24", "#fcd34d", "#f59e0b"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#fbbf24", "#fcd34d", "#f59e0b"],
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};
