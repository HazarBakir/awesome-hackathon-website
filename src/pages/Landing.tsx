import HeroSection from "@/components/landing-page/hero-section";
import Features from "@/components/landing-page/features-roadmap";
import WaitList from "@/components/landing-page/waitlist";
import { DotsBackground } from "@/components/landing-page/background";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "@/components/landing-page/header";

export default function Landing() {
  const heroShowcaseContainerVariants = {
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } },
  };

  const AnimateVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroHeader />
      <DotsBackground />

      <AnimatedGroup
        variants={{
          container: heroShowcaseContainerVariants,
          item: AnimateVariants,
        }}
      >
        <HeroSection />
        <Features />
        <WaitList />
      </AnimatedGroup>
    </main>
  );
}
