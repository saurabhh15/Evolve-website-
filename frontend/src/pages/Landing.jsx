import React, { useState, useEffect, Suspense, lazy } from 'react';
import { getLenis } from '../hooks/useLenis';
import Hero from '../features/landing/sections/Hero';

// Lazy load the heavy visual sections below the fold
const Features = lazy(() => import('../features/landing/sections/Features'));
const Progress = lazy(() => import('../features/landing/sections/Progress'));
const UseCases = lazy(() => import('../features/landing/sections/UseCases'));
const FAQ = lazy(() => import('../features/landing/sections/FAQ'));
const CTA = lazy(() => import('../features/landing/sections/CTA'));

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', ({ scroll }) => setScrollY(scroll));
      return () => lenis.off('scroll');
    }
    const handleScroll = () => setScrollY(window.scrollY);
    
    // Added { passive: true } for better scroll performance on mobile
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Changed min-h-screen to min-h-[100dvh] for perfect mobile browser height
    // Kept overflow unhidden as requested so Progress/Sticky sections work
    <div className="relative min-h-[100dvh] text-white">  
      <Hero scrollY={scrollY} menuOpen={menuOpen} />
      
      {/* Wrap lazy loaded components in Suspense */}
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center" />}>
        <Features />
        <div className="relative z-20">
          <Progress scrollY={scrollY} />
          <UseCases scrollY={scrollY} />
          <FAQ scrollY={scrollY} />
          <CTA scrollY={scrollY} />
        </div>
      </Suspense>
    </div>
  );
};

export default LandingPage;