// pages/index.tsx (or app/page.tsx)
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import EventTimeline from "@/components/home/EventTimeline";
import OpportunitiesSection from "@/components/home/OpportunitiesSection";
import ScrollIndicator from "@/components/home/ScrollIndicator";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Header />

      {/* Hero Section — hero owns height; section provides only anchor offset */}
      <section id="home" className="relative scroll-mt-20 md:scroll-mt-24">
        <HeroSection />
        <ScrollIndicator />
      </section>

      {/* Event Timeline — consistent outer rhythm via section py */}
      <section
        id="timeline"
        className="relative py-16 md:py-20 px-4 scroll-mt-20 md:scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto">
          <EventTimeline />
        </div>
      </section>

      {/* Opportunities Section — consistent outer rhythm via section py */}
      <section
        id="opportunities"
        className="relative py-16 md:py-20 px-4 scroll-mt-20 md:scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto">
          <OpportunitiesSection />
        </div>
      </section>

      <Footer />
    </main>
  );
}
