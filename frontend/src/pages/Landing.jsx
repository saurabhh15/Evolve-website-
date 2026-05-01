import React, { useState, useEffect } from 'react';
import Features from '../features/landing/sections/Features';
import Progress from '../features/landing/sections/Progress';
import UseCases from '../features/landing/sections/UseCases';
import Faq from '../features/landing/sections/FAQ';
import Cta from '../features/landing/sections/CTA';
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    //removed the overflow hidden for the how it works.
    <div className="relative min-h-screen text-white">  
      <Hero scrollY={scrollY} menuOpen={menuOpen} />
      <Features />
      <div className="relative z-20">
        <Progress scrollY={scrollY} />
        <UseCases scrollY={scrollY} />
        <Faq scrollY={scrollY} />
        <Cta scrollY={scrollY} />
      </div>
      
    </div>
  );
};

export default LandingPage;
