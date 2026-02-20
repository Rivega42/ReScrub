import Header from '../components/Header';
import Hero from '../components/Hero';
import SocialProofBar from '../components/SocialProofBar';
import PainPoints from '../components/PainPoints';
import Solution from '../components/Solution';
import FeaturesShowcase from '../components/FeaturesShowcase';
import LiveDemo from '../components/LiveDemo';
import HowItWorks from '../components/HowItWorks';
import PricingSection from '../components/PricingSection';
import ComparisonTable from '../components/ComparisonTable';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import SavingsCalculator from '../components/SavingsCalculator';
import BeforeAfter from '../components/BeforeAfter';
import DayTimeline from '../components/DayTimeline';
import UserQuiz from '../components/UserQuiz';
import LiveActivityFeed from '../components/LiveActivityFeed';
import LiveCounter from '../components/LiveCounter';
import AssistantConfigurator from '../components/AssistantConfigurator';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LiveCounter />
        <SocialProofBar />
        <PainPoints />
        <Solution />
        <FeaturesShowcase />
        <LiveDemo />
        <HowItWorks />
        <SavingsCalculator />
        <BeforeAfter />
        <DayTimeline />
        <UserQuiz />
        <LiveActivityFeed />
        <AssistantConfigurator />
        <PricingSection />
        <ComparisonTable />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
