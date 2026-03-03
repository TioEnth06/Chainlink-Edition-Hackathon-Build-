"use client";

import { useEffect, useRef, useCallback } from "react";

type Direction = "forward" | "backward";

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: Direction;
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [255, 107, 53]; // #ff6b35 default
}

export default function Plasma({
  color = "#ff6b35",
  speed = 0.6,
  direction = "forward",
  scale = 1.1,
  opacity = 0.8,
  mouseInteractive = true,
  className = "",
}: PlasmaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const time = frameRef.current * 0.01 * speed * (direction === "backward" ? -1 : 1);
    const [r, g, b] = hexToRgb(color);

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const nx = (x / w - 0.5) * scale + (mouseInteractive ? (mx - 0.5) * 0.3 : 0);
        const ny = (y / h - 0.5) * scale + (mouseInteractive ? (my - 0.5) * 0.3 : 0);

        const v =
          Math.sin(nx * 10 + time) +
          Math.sin(ny * 10 + time * 1.2) +
          Math.sin((nx + ny) * 5 + time * 0.7) +
          Math.sin(Math.sqrt(nx * nx + ny * ny) * 8 + time);

        const normalized = (v + 4) / 8;
        const intensity = Math.floor(128 + normalized * 127);

        const i = (y * w + x) * 4;
        data[i] = Math.floor((r * intensity) / 255);
        data[i + 1] = Math.floor((g * intensity) / 255);
        data[i + 2] = Math.floor((b * intensity) / 255);
        data[i + 3] = Math.floor(255 * opacity);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    frameRef.current += 1;
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

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
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseRef.current.x = e.clientX / w;
      mouseRef.current.y = e.clientY / h;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseInteractive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}
