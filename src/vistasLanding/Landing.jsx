import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Navbar from '../componentesLanding/landing/Navbar';
import Hero from '../componentesLanding/landing/Hero';
import '../componentesLanding/landing/landing.css';
import StatsTicker from '../componentesLanding/landing/StatsTicker';
import InteractiveBackground from '../componentesLanding/landing/InteractiveBackground';
import IntroAnimation from '../componentesLanding/landing/IntroAnimation';
import LogoWatermark from '../componentesLanding/landing/LogoWatermark';

const BentoGrid = lazy(() => import('../componentesLanding/landing/BentoGrid'));
const Demo = lazy(() => import('../componentesLanding/landing/Demo'));
const Contact = lazy(() => import('../componentesLanding/landing/Contact'));

function SkeletonFallback() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function LandingPage() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [startHero, setStartHero] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const heroRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', !isIntroComplete);
    return () => document.body.classList.remove('no-scroll');
  }, [isIntroComplete]);

  if (prefersReducedMotion) {
    return (
      <>
        <InteractiveBackground count={70} interactionRadius={150} repelForce={80} />
        <div className="min-h-screen overflow-x-hidden bg-noise landing-page">
          <Navbar />
          <main id="main-content" className="relative z-10">
            <Hero ref={heroRef} startAnimation={true} />
            <StatsTicker />
            <Suspense fallback={<SkeletonFallback />}><BentoGrid /></Suspense>
          </main>
          <Suspense fallback={<SkeletonFallback />}><Contact /></Suspense>
          <LogoWatermark heroRef={heroRef} />
        </div>
      </>
    );
  }

  return (
    <>
      {!isIntroComplete && (
        <IntroAnimation
          onComplete={() => setIsIntroComplete(true)}
          onOpenDoors={() => setStartHero(true)}
        />
      )}
      <InteractiveBackground count={90} interactionRadius={150} repelForce={80} />
      <div className="min-h-screen overflow-x-hidden bg-noise landing-page">
        <Navbar />
        <main id="main-content" className="relative z-10">
          <Hero ref={heroRef} startAnimation={startHero} />
          <StatsTicker />
          <Suspense fallback={<SkeletonFallback />}><BentoGrid /></Suspense>
        </main>
        <Suspense fallback={<SkeletonFallback />}><Contact /></Suspense>
        <LogoWatermark heroRef={heroRef} />
      </div>
    </>
  );
}
