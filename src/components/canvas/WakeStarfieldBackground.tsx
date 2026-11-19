"use client";

import { useEffect, useRef } from "react";

interface WakeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface AmbientStar {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  excitement: number;
}

interface WakeStarfieldBackgroundProps {
  /**
   * "full" renders the fixed backdrop textures + canvas (used on /login).
   * "scroll-wake" renders only the transparent interactive canvas and shifts
   * particles with window.scrollY so it stays synchronized with scrolling
   * per-section starfields on the landing page.
   */
  mode?: "full" | "scroll-wake";
}

/**
 * WakeStarfieldBackground - Combines the authentic Neowise deep-space starfield
 * textures (#000000 -> #03045E abyss) with a 60fps pointer-reactive bioluminescent
 * particle wake canvas that illuminates nearby stars on movement.
 */
export default function WakeStarfieldBackground({
  mode = "full",
}: WakeStarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScrollWake = mode === "scroll-wake";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    // Seed deterministic-feel ambient stars across the viewport
    const starCount = Math.min(130, Math.floor((width * height) / 11000));
    const stars: AmbientStar[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.7 + Math.random() * 1.4,
      baseAlpha: 0.14 + Math.random() * 0.28,
      excitement: 0,
    }));

    const wakes: WakeParticle[] = [];
    let lastPointerX = -9999;
    let lastPointerY = -9999;
    let pointerActive = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      const dist = Math.hypot(dx, dy);

      if (pointerActive && dist > 3 && dist < 240) {
        const count = Math.min(4, Math.ceil(dist / 16));
        for (let i = 0; i < count; i++) {
          const t = i / count;
          wakes.push({
            x: lastPointerX + dx * t + (Math.random() - 0.5) * 14,
            y: lastPointerY + dy * t + (Math.random() - 0.5) * 14,
            vx: dx * 0.03 + (Math.random() - 0.5) * 0.35,
            vy: dy * 0.03 + (Math.random() - 0.5) * 0.35,
            life: 1,
            maxLife: 42 + Math.random() * 26,
            size: 1.1 + Math.random() * 1.8,
          });
        }
        if (wakes.length > 140) {
          wakes.splice(0, wakes.length - 140);
        }
      }

      // Excite nearby ambient stars
      for (const star of stars) {
        const sDist = Math.hypot(star.x - e.clientX, star.y - e.clientY);
        if (sDist < 130) {
          star.excitement = Math.max(star.excitement, 1 - sDist / 130);
        }
      }

      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      pointerActive = true;
    };

    let lastScrollY = window.scrollY;
    const syncScrollDelta = () => {
      if (!isScrollWake) return;
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      if (deltaY === 0) return;
      lastScrollY = currentScrollY;

      for (const star of stars) {
        star.y = (((star.y - deltaY) % height) + height) % height;
      }
      for (const p of wakes) {
        p.y -= deltaY;
      }
    };

    const drawStatic = () => {
      syncScrollDelta();
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        ctx.fillStyle = `rgba(226, 244, 255, ${star.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (prefersReducedMotion) {
      drawStatic();
      const handleStaticScroll = () => drawStatic();
      if (isScrollWake) {
        window.addEventListener("scroll", handleStaticScroll, { passive: true });
      }
      window.addEventListener("resize", resize);
      return () => {
        if (isScrollWake) {
          window.removeEventListener("scroll", handleStaticScroll);
        }
        window.removeEventListener("resize", resize);
      };
    }

    let frameId = 0;
    const render = () => {
      syncScrollDelta();
      ctx.clearRect(0, 0, width, height);

      // Update & render ambient stars
      for (const star of stars) {
        star.excitement *= 0.965;
        const alpha = star.baseAlpha + star.excitement * 0.7;
        const radius = star.r + star.excitement * 1.3;

        if (star.excitement > 0.08) {
          ctx.fillStyle = `rgba(124, 222, 228, ${alpha})`;
          ctx.shadowColor = "rgba(56, 189, 248, 0.7)";
          ctx.shadowBlur = 8 * star.excitement;
        } else {
          ctx.fillStyle = `rgba(226, 244, 255, ${alpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Update & render bioluminescent wake particles
      for (let i = wakes.length - 1; i >= 0; i--) {
        const p = wakes[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life += 1;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          wakes.splice(i, 1);
          continue;
        }

        const alpha = (1 - progress) * 0.68;
        ctx.fillStyle =
          progress < 0.35
            ? `rgba(124, 222, 228, ${alpha})`
            : `rgba(56, 189, 248, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", resize);
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", resize);
    };
  }, [isScrollWake]);

  if (isScrollWake) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* Interactive 60fps Bioluminescent Wake Canvas (scroll-synced over per-section starfields) */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-space-black">
      {/* Neowise Primary High-Density Starfield */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 mix-blend-screen"
        style={{ backgroundImage: "url('/images/neowise/10-star-mini.jpg')" }}
      />

      {/* Deep Space Navy Horizon Abyss */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-black via-space-navy/35 to-space-black opacity-90" />

      {/* Neowise Secondary Star Dust Texture */}
      <div
        className="absolute inset-0 bg-cover bg-top opacity-35 mix-blend-lighten"
        style={{ backgroundImage: "url('/images/neowise/2-star-mini.jpg')" }}
      />

      {/* Interactive 60fps Bioluminescent Wake Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
