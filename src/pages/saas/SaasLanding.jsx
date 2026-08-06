import LandingHero from '@/components/landing/LandingHero';
import LandingDifferentiator from '@/components/landing/LandingDifferentiator';
import LandingServices from '@/components/landing/LandingServices';
import LandingProof from '@/components/landing/LandingProof';
import LandingContactForm from '@/components/landing/LandingContactForm';
import LandingCTA from '@/components/landing/LandingCTA';

export default function SaasLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ color: 'white' }}>
      <LandingHero />
      <LandingDifferentiator />
      <LandingServices />
      <LandingProof />
      <LandingContactForm />
      <LandingCTA />
    </div>
  );
}