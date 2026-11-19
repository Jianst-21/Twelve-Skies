import WakeStarfieldBackground from "@/components/canvas/WakeStarfieldBackground";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroObservatory from "@/components/landing/HeroObservatory";
import DateMappingSimulator from "@/components/landing/DateMappingSimulator";
import ConstellationLedger from "@/components/landing/ConstellationLedger";
import ArchivePlatesSection from "@/components/landing/ArchivePlatesSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-space-black text-ink-primary">
      <WakeStarfieldBackground mode="scroll-wake" />
      <LandingHeader />
      <main>
        <HeroObservatory />
        <DateMappingSimulator />
        <ConstellationLedger />
        <ArchivePlatesSection />
      </main>
      <LandingFooter />
    </div>
  );
}
