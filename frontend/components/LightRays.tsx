"use client";

/**
 * Light rays background effect inspired by React Bits (reactbits.dev/backgrounds/light-rays).
 * Conic-gradient rays from top-center with a radial mask for soft falloff.
 */
const RAY_COUNT = 24;
const RAY_SPREAD_DEG = 360 / RAY_COUNT;

function buildConicRays() {
  const stops: string[] = [];
  for (let i = 0; i < RAY_COUNT; i++) {
    const base = i * RAY_SPREAD_DEG;
    stops.push(`rgba(34,211,238,0) ${base}deg`);
    stops.push(`rgba(34,211,238,0.06) ${base + 0.5}deg`);
    stops.push(`rgba(34,211,238,0.14) ${base + 2}deg`);
    stops.push(`rgba(34,211,238,0.06) ${base + 3}deg`);
    stops.push(`rgba(34,211,238,0) ${base + RAY_SPREAD_DEG * 0.4}deg`);
  }
  return `conic-gradient(from 0deg at 50% 0%, ${stops.join(", ")})`;
}

export default function LightRays({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 ${className}`}
      aria-hidden
      style={{
        background: buildConicRays(),
        maskImage: "radial-gradient(ellipse 100% 80% at 50% -20%, black 0%, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 80% at 50% -20%, black 0%, black 30%, transparent 75%)",
      }}
    />
  );
}
