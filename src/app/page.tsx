import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import EventTimeline from '@/components/home/EventTimeline';
import OpportunitiesSection from '@/components/home/OpportunitiesSection';
import ScrollIndicator from '@/components/home/ScrollIndicator';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Header />
      
      {/* Hero Section with Beams Background */}
      <section id="home" className="relative min-h-screen">
        <HeroSection />
        <ScrollIndicator />
      </section>

      {/* Event Timeline */}
      <section id="timeline" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <EventTimeline />
        </div>
      </section>

      {/* Opportunities Section */}
      <section id="opportunities" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <OpportunitiesSection />
        </div>
      </section>

      <Footer />
    </main>
  );
}