import Header from '../components/Header';
import Hero from '../components/Hero';
import WhatsAtStake from '../components/WhatsAtStake';
import HowItWorks from '../components/HowItWorks';
import PricingSection from '../components/PricingSection';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <WhatsAtStake />
        <HowItWorks />
        <PricingSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}