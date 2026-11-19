"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ILLUSTRATIVE_MEMORIES } from "@/data/illustrativeMemories";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSkySection from "@/components/landing/HeroSkySection";
import CapabilitiesSection from "@/components/landing/CapabilitiesSection";
import SanctuaryClosing from "@/components/landing/SanctuaryClosing";
import LandingFooter from "@/components/landing/LandingFooter";

const LandingSkyBackdrop = dynamic(
  () => import("@/components/landing/LandingSkyBackdrop"),
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

const DEFAULT_SAMPLE = ILLUSTRATIVE_MEMORIES[3]; // Mount Bromo in Leo

export default function LandingExperience() {
  const [focusedConstellationId, setFocusedConstellationId] = useState<string>(
    DEFAULT_SAMPLE.constellationId
  );
  const [focusedNodeIndex, setFocusedNodeIndex] = useState<number | null>(
    DEFAULT_SAMPLE.nodeIndex
  );
  const [activeSampleId, setActiveSampleId] = useState<string>(DEFAULT_SAMPLE.id);
  const [lockScrollDrift, setLockScrollDrift] = useState<boolean>(false);

  const handleSelectSample = (sampleId: string) => {
    const sample = ILLUSTRATIVE_MEMORIES.find((m) => m.id === sampleId);
    if (!sample) return;
    setActiveSampleId(sample.id);
    setFocusedConstellationId(sample.constellationId);
    setFocusedNodeIndex(sample.nodeIndex);
    setLockScrollDrift(false);
  };

  const handleSelectStarNode = (constellationId: string, nodeIndex: number) => {
    setFocusedConstellationId(constellationId);
    setFocusedNodeIndex(nodeIndex);
    const matchingSample = ILLUSTRATIVE_MEMORIES.find(
      (m) => m.constellationId === constellationId && m.nodeIndex === nodeIndex
    );
    if (matchingSample) {
      setActiveSampleId(matchingSample.id);
    }
  };

  const handleDateMapped = (constellationId: string, nodeIndex: number) => {
    setFocusedConstellationId(constellationId);
    setFocusedNodeIndex(nodeIndex);
    setLockScrollDrift(true);
  };

  return (
    <div className="relative min-h-screen bg-space-black text-ink-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan-glow focus:text-space-navy focus:font-bold"
      >
        Skip to content
      </a>

      <LandingSkyBackdrop
        focusedConstellationId={focusedConstellationId}
        focusedNodeIndex={focusedNodeIndex}
        lockScrollDrift={lockScrollDrift}
        onSelectStarNode={handleSelectStarNode}
      />

      <LandingHeader />

      <main id="main-content" className="relative z-10 pointer-events-none">
        <HeroSkySection
          activeConstellationId={focusedConstellationId}
          activeNodeIndex={focusedNodeIndex}
          activeSampleId={activeSampleId}
          onSelectSample={handleSelectSample}
        />
        <CapabilitiesSection onDateMapped={handleDateMapped} />
        <SanctuaryClosing />
      </main>

      <LandingFooter />
    </div>
  );
}
