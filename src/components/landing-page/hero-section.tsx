import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";
import React from "react";
import { DotsBackground } from "./background";

const heroShowcaseContainerVariants = {
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.75 } },
};

const heroShowcaseItemVariants = {
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

export default function HeroSection() {
  const handleDocumentRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/document";
  };

  return (
    <>
      <HeroHeader forceActive />
      <main className="overflow-hidden relative">
        <DotsBackground />
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24">
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mr-auto lg:mt-0">
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16"
                >
                  Discover README Files, Reimagined.
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mt-8 max-w-2xl text-pretty text-lg"
                >
                  GitReads transforms ordinary GitHub documentation into an
                  inviting, beautifully organized reading experience. Instantly
                  dive into any repositories' README, enjoy seamless navigation
                  across sections, and find what you need without the clutter.
                  It is documentation, but actually pleasant—and unmistakably
                  yours to explore.
                </TextEffect>
                <AnimatedGroup
                  variants={{
                    container: heroShowcaseContainerVariants,
                    item: heroShowcaseItemVariants,
                  }}
                >
                  <div className="flex w-full max-w-xl items-center gap-2 mt-12">
                    <Button
                      size="lg"
                      className="rounded-xl px-5 text-base cursor-pointer"
                      onClick={handleDocumentRedirect}
                    >
                      Experience the Demo
                    </Button>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
            <AnimatedGroup
              variants={{
                container: heroShowcaseContainerVariants,
                item: heroShowcaseItemVariants,
              }}
            >
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <img
                    className="bg-background aspect-15/8 relative rounded-2xl"
                    src="/hero-screenshot.png"
                    alt="GitReads app screenshot"
                    width={2700}
                    height={1440}
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}
