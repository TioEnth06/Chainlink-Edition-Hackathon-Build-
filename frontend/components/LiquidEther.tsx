"use client";

import { useEffect, useRef, useCallback } from "react";

interface LiquidEtherProps {
  className?: string;
  opacity?: number;
  color?: string;
  speed?: number;
  mouseInteractive?: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [34, 211, 238]; // cyan default
}

export default function LiquidEther({
  className = "",
  opacity = 0.35,
  color = "#22d3ee",
  speed = 0.4,
  mouseInteractive = true,
}: LiquidEtherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const t = timeRef.current * 0.002 * speed;
    const [r, g, b] = hexToRgb(color);
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    ctx.clearRect(0, 0, w, h);

    // Liquid ether: flowing, overlapping blobs (reactbits.dev/backgrounds/liquid-ether style)
    const blobCount = 6;
    for (let i = 0; i < blobCount; i++) {
      const phase = (i / blobCount) * Math.PI * 2 + t;
      const bx = 0.5 + 0.45 * Math.sin(phase) + (mouseInteractive ? (mx - 0.5) * 0.25 : 0);
      const by = 0.5 + 0.4 * Math.cos(phase * 1.2) + (mouseInteractive ? (my - 0.5) * 0.25 : 0);
      const radius = 0.4 + 0.2 * Math.sin(t * 0.5 + i * 0.7);
      const grad = ctx.createRadialGradient(
        bx * w, by * h, 0,
        bx * w, by * h, radius * Math.max(w, h)
      );
      grad.addColorStop(0, `rgba(${r},${g},${b},${opacity * 0.85})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${opacity * 0.35})`);
      grad.addColorStop(0.8, `rgba(${r},${g},${b},${opacity * 0.08})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    timeRef.current += 1;
  }, [color, opacity, speed, mouseInteractive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId: number;
    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [draw]);

  useEffect(() => {
    if (!mouseInteractive) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseInteractive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
