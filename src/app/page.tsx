import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import EventTimeline from "@/components/home/EventTimeline";
import OpportunitiesSection from "@/components/home/OpportunitiesSection";
import EventDetailsSection from "@/components/home/EventDetailsSection";
import ReadyToParticipateCTA from "@/components/home/ReadyToParticipateCTA";
import MainBackgroundTerminal from "@/components/home/MainBackgroundTerminal";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-hack-black text-white selection:bg-cyber-blue-400/30 selection:text-electric-cyan">
      {/* Full-Page Interactive Faulty Terminal Background */}
      <MainBackgroundTerminal />

      {/* Page Content Layers */}
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section id="home" className="relative scroll-mt-20 md:scroll-mt-24">
          <HeroSection />
        </section>

        {/* Event Timeline */}
        <section
          id="timeline"
          className="relative py-16 md:py-24 px-4 scroll-mt-20 md:scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto">
            <EventTimeline />
          </div>
        </section>

        {/* Event Details */}
        <section
          id="details"
          className="relative py-16 md:py-24 px-4 scroll-mt-20 md:scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto">
            <EventDetailsSection />
          </div>
        </section>

        {/* Opportunities Section */}
        <section
          id="opportunities"
          className="relative py-16 md:py-24 px-4 scroll-mt-20 md:scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto">
            <OpportunitiesSection />
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="relative py-16 md:py-24 px-4 scroll-mt-20 md:scroll-mt-24"
        >
          <div className="max-w-7xl mx-auto">
            <ReadyToParticipateCTA />
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
