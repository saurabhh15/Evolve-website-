import React, { useState, useEffect } from 'react';
import Features from '../features/landing/sections/Features';
import Progress from '../features/landing/sections/Progress';
import UseCases from '../features/landing/sections/UseCases';
import FAQ from '../features/landing/sections/FAQ';
import CTA from '../features/landing/sections/CTA';
import { getLenis } from '../hooks/useLenis';
import Hero from '../features/landing/sections/Hero';

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
      <Features />
      <div className="relative z-20">
        <Progress scrollY={scrollY} />
        <UseCases scrollY={scrollY} />
        <FAQ scrollY={scrollY} />
        <CTA scrollY={scrollY} />
      </div>
    </div>
  );
};

export default LandingPage;