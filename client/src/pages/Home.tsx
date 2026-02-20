import Header from '../components/Header';
import Hero from '../components/Hero';
import SavingsCalculator from '../components/SavingsCalculator';
import HowItWorks from '../components/HowItWorks';
import BeforeAfter from '../components/BeforeAfter';
import DayTimeline from '../components/DayTimeline';
import UserQuiz from '../components/UserQuiz';
import PricingSection from '../components/PricingSection';
import Testimonials from '../components/Testimonials';
import LiveActivityFeed from '../components/LiveActivityFeed';
import LiveCounter from '../components/LiveCounter';
import AssistantConfigurator from '../components/AssistantConfigurator';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LiveCounter />
        <HowItWorks />
        <SavingsCalculator />
        <BeforeAfter />
        <DayTimeline />
        <UserQuiz />
        <LiveActivityFeed />
        <AssistantConfigurator />
        <PricingSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
