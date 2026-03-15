import { HeroSection } from "@/components/home/HeroSection";
import { HookSection } from "@/components/home/HookSection";
import { IntroSection } from "@/components/home/IntroSection";
import { OriginSection } from "@/components/home/OriginSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="[&>section]:px-6 [&>section]:md:px-16">
        <HookSection />
        <IntroSection />
        <OriginSection />
        <ContactSection />
      </div>
    </>
  );
}
