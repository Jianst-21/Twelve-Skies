"use client";

import dynamic from "next/dynamic";
import type { AuthSkyAlign } from "@/components/canvas/AuthSkyCanvas";

const AuthSkyCanvas = dynamic(
  () => import("@/components/canvas/AuthSkyCanvas"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-space-black"
      />
    ),
  }
);

interface AuthSkyBackdropProps {
  focusedConstellationId?: string;
  desktopAlign?: AuthSkyAlign;
}

export default function AuthSkyBackdrop({
  focusedConstellationId = "leo",
  desktopAlign = "left-panel",
}: AuthSkyBackdropProps) {
  return (
    <AuthSkyCanvas
      focusedConstellationId={focusedConstellationId}
      desktopAlign={desktopAlign}
    />
  );
}
