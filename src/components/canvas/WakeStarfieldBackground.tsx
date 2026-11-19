"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

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
 * backdrop (#000000 -> #03045E abyss) with an on-demand pointer-reactive bioluminescent
 * particle wake canvas that sleeps at 0 FPS when idle and wakes on movement.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    // Seed ambient stars across the viewport
    const starCount = Math.min(110, Math.floor((width * height) / 12000));
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
    let frameId = 0;

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
      const handleStaticResize = () => {
        resize();
        drawStatic();
      };
      if (isScrollWake) {
        window.addEventListener("scroll", handleStaticScroll, { passive: true });
      }
      window.addEventListener("resize", handleStaticResize, { passive: true });
      return () => {
        if (isScrollWake) {
          window.removeEventListener("scroll", handleStaticScroll);
        }
        window.removeEventListener("resize", handleStaticResize);
      };
    }

    const render = () => {
      frameId = 0;
      if (document.visibilityState === "hidden") return;

      syncScrollDelta();
      ctx.clearRect(0, 0, width, height);

      let hasActiveMotion = wakes.length > 0;

      // Update & render ambient stars (cheap translucent halo replaces heavy ctx.shadowBlur)
      for (const star of stars) {
        if (star.excitement > 0.002) {
          star.excitement *= 0.96;
          hasActiveMotion = true;
        } else {
          star.excitement = 0;
        }

        const alpha = star.baseAlpha + star.excitement * 0.7;
        const radius = star.r + star.excitement * 1.3;

        if (star.excitement > 0.08) {
          ctx.fillStyle = `rgba(56, 189, 248, ${star.excitement * 0.24})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(124, 222, 228, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(226, 244, 255, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

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

      // Sleep rAF completely when all stars and wake particles have settled
      if (hasActiveMotion || wakes.length > 0) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const scheduleRender = () => {
      if (frameId === 0 && document.visibilityState !== "hidden") {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      const dist = Math.hypot(dx, dy);

      if (pointerActive && dist > 3 && dist < 240) {
        const count = Math.min(3, Math.ceil(dist / 18));
        for (let i = 0; i < count; i++) {
          const t = i / count;
          wakes.push({
            x: lastPointerX + dx * t + (Math.random() - 0.5) * 14,
            y: lastPointerY + dy * t + (Math.random() - 0.5) * 14,
            vx: dx * 0.03 + (Math.random() - 0.5) * 0.35,
            vy: dy * 0.03 + (Math.random() - 0.5) * 0.35,
            life: 1,
            maxLife: 40 + Math.random() * 24,
            size: 1.1 + Math.random() * 1.8,
          });
        }
        if (wakes.length > 100) {
          wakes.splice(0, wakes.length - 100);
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
      scheduleRender();
    };

    const handleResize = () => {
      resize();
      scheduleRender();
    };

    const handleScroll = () => {
      if (isScrollWake) scheduleRender();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && frameId !== 0) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (document.visibilityState !== "hidden") {
        scheduleRender();
      }
    };

    // Draw initial ambient starfield once, then sleep until pointer interaction
    drawStatic();

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    if (isScrollWake) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      if (isScrollWake) {
        window.removeEventListener("scroll", handleScroll);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isScrollWake]);

  if (isScrollWake) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
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
      {/* Optimized single deep-space starfield texture via next/image (AVIF/WebP) */}
      <Image
        src="/images/neowise/10-star-mini.jpg"
        alt=""
        fill
        sizes="100vw"
        quality={60}
        priority
        aria-hidden="true"
        className="object-cover object-center opacity-55 mix-blend-screen"
      />

      {/* Deep Space Navy Horizon Abyss */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-black via-space-navy/35 to-space-black opacity-90" />

      {/* On-demand Bioluminescent Wake Canvas (0 FPS when idle) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
