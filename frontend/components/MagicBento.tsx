"use client";

import { useRef, useState, useCallback } from "react";

interface MagicBentoProps {
  children: React.ReactNode;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  disableAnimations?: boolean;
  className?: string;
}

export default function MagicBento({
  children,
  textAutoHide = false,
  enableStars = false,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = false,
  spotlightRadius = 400,
  particleCount = 12,
  glowColor = "132, 0, 255",
  disableAnimations = false,
  className = "",
}: MagicBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableAnimations || !enableSpotlight || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlight({ x, y });
    },
    [disableAnimations, enableSpotlight]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableAnimations || !clickEffect || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setClickPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setTimeout(() => setClickPos(null), 600);
    },
    [disableAnimations, clickEffect]
  );

  const noAnim = disableAnimations;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl ${enableBorderGlow && !noAnim ? "border border-white/10 shadow-[0_0_30px_-5px_rgba(var(--glow),0.25)]" : ""} ${className}`}
      style={{ "--glow": glowColor } as React.CSSProperties}
    >
      {enableSpotlight && !noAnim && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle ${spotlightRadius}px at ${spotlight.x}% ${spotlight.y}%, rgba(${glowColor}, 0.15), transparent 70%)`,
          }}
        />
      )}
      {enableStars && !noAnim && particleCount > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: particleCount }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/30 animate-pulse"
              style={{
                left: `${(i * 7 + 13) % 100}%`,
                top: `${(i * 11 + 17) % 100}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}
      {clickPos && clickEffect && !noAnim && (
        <div
          className="pointer-events-none absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 animate-ping"
          style={{ left: clickPos.x, top: clickPos.y }}
        />
      )}
      <div className={`relative z-10 ${textAutoHide ? "overflow-hidden" : ""}`}>
        {children}
      </div>
    </div>
  );
}
