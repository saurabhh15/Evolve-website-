import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getLenis } from '../hooks/useLenis';

const menuItems = [
  { name: 'Events', path: '/events' },
  { name: 'ABOUT', path: '/about' },
  { name: 'SUCCESS STORIES', path: '/success-stories' }, 
  { name: 'CONTACTS', path: '/contact' },
];

const DARK_HERO_ROUTES = ['/', '/about', '/contact'];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const curtainRef = useRef(null);
  const buttonRef = useRef(null); // Added reference for the menu button
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // True when the current page has a dark hero (text should start white)
  const hasDarkHero = DARK_HERO_ROUTES.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5;
      if (window.scrollY > threshold) {
        setScrolled(true);
      } else if (window.scrollY < threshold - 10) {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset scroll state when route changes
  useEffect(() => {
    setScrolled(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Curtain slide-in/out animation (clip-path)
  useEffect(() => {
    const el = curtainRef.current;
    const btn = buttonRef.current;
    if (!el || !btn) return;

    // Calculate exact center of the button on the screen dynamically
    const rect = btn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const origin = `${originX}px ${originY}px`;

    if (menuOpen) {
      el.style.transition = 'none';
      el.style.clipPath = `circle(0px at ${origin})`;
      el.style.opacity = '1';
      void el.offsetWidth; // Trigger reflow
      el.style.transition = 'clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
      el.style.clipPath = `circle(150% at ${origin})`;
    } else {
      el.style.transition = 'clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1)';
      el.style.clipPath = `circle(0px at ${origin})`;
    }
  }, [menuOpen]); // Dependency on menuOpen ensures it calculates the fresh position when toggled

  const handleNavClick = (path) => {
    setMenuOpen(false);
    const lenis = getLenis();
    if (lenis) lenis.start();
    setTimeout(() => navigate(path), 500);
  };

  // Color Logic
  const logoColor = menuOpen
    ? '#434343'
    : scrolled
      ? '#434343'
      : hasDarkHero
        ? '#ffffff'
        : '#1a1a1a';

  const iconColor = menuOpen
    ? '#f97316'
    : scrolled
      ? '#f97316'
      : hasDarkHero
        ? '#f97316'
        : '#f97316';

  const iconBorderColor = '#f97316';

  return (
    <>
      <style>{`
        .nav-btn { position: relative; overflow: hidden; }
        .nav-btn .ico {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .nav-btn .ico-menu  { opacity: 1; transform: rotate(0deg) scale(1); }
        .nav-btn .ico-close { opacity: 0; transform: rotate(-90deg) scale(0.3); }
        .nav-btn.is-open .ico-menu  { opacity: 0; transform: rotate(90deg) scale(0.3); }
        .nav-btn.is-open .ico-close { opacity: 1; transform: rotate(0deg) scale(1); }
        .menu-link:hover { letter-spacing: -1px !important; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        // Fluid margin top
        top: scrolled ? 'clamp(10px, 2vw, 20px)' : '0',
        width: scrolled ? 'min(1000px, 92%)' : '100%',
        transition: `
          width 1s cubic-bezier(0.65, 0, 0.35, 1),
          top 1s cubic-bezier(0.65, 0, 0.35, 1),
          padding 1s cubic-bezier(0.65, 0, 0.35, 1),
          border-radius 1s cubic-bezier(0.65, 0, 0.35, 1),
          background-color 0.9s ease,
          backdrop-filter 0.9s ease
        `,
        borderRadius: scrolled ? '100px' : '0px',
        // Fluid paddings so mobile doesn't get squeezed
        padding: scrolled ? 'clamp(10px, 2vw, 15px) clamp(16px, 4vw, 24px)' : 'clamp(16px, 3vw, 20px) clamp(20px, 5vw, 32px)',
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center shrink-0'>
            <img className='w-full h-full object-contain' src="/Evolve.png" alt="evolve-logo" />
          </div>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{
              // Fluid font sizing for mobile logo
              fontSize: scrolled ? 'clamp(1.2rem, 4vw, 1.6rem)' : 'clamp(1.4rem, 5vw, 1.7rem)',
              fontWeight: 800,
              color: logoColor,
              textDecoration: 'none',
              letterSpacing: '-0.5px',
              transition: 'color 0.4s ease, font-size 0.6s ease',
            }}
          >
            Evolve<span className="text-[#e87315]">.</span>
          </Link>
        </div>

        {/* Right Side Content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: scrolled ? 'clamp(8px, 2vw, 12px)' : 'clamp(10px, 3vw, 16px)' }}>
          <Link to="/get-started" style={{
            background: '#f97316',
            color: 'white',
            // Fluid button padding
            padding: scrolled ? 'clamp(6px, 1.5vw, 6px) clamp(14px, 3vw, 18px)' : 'clamp(8px, 2vw, 8px) clamp(16px, 4vw, 22px)',
            borderRadius: '100px',
            fontSize: scrolled ? 'clamp(0.7rem, 2vw, 0.9rem)' : 'clamp(0.75rem, 2vw, 0.9rem)',
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.4s ease',
          }}>
            GET STARTED
          </Link>

          <button
            ref={buttonRef} // Attach the reference here
            type="button"
            onClick={() => {
              const next = !menuOpen;
              setMenuOpen(next);
              const lenis = getLenis();
              if (lenis) next ? lenis.stop() : lenis.start();
            }}
            style={{
              width: scrolled ? "36px" : "44px", // slightly scaled down on scroll
              height: scrolled ? "36px" : "44px",
              borderRadius: "50%",
              border: `1.5px solid ${iconBorderColor}`,
              background: "transparent",
              cursor: "pointer",
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              transition: 'all 0.4s ease',
              flexShrink: 0,
            }}
          >
            {/* Menu Icon */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'scale(0.5) rotate(90deg)' : 'scale(1) rotate(0deg)',
              pointerEvents: menuOpen ? 'none' : 'auto',
            }}>
              <Menu size={scrolled ? 18 : 20} color={iconColor} />
            </div>

            {/* Close Icon */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-90deg)',
              pointerEvents: menuOpen ? 'auto' : 'none',
            }}>
              <X size={scrolled ? 18 : 20} color={iconColor} />
            </div>
          </button>
        </div>
      </nav>

      {/* CURTAIN MENU */}
      <div
        ref={curtainRef}
        // h-[100dvh] prevents mobile URL bar overflow issues
        className="fixed inset-0 z-90 bg-[#f5f0e8] h-[100dvh] w-full flex flex-col justify-center overflow-hidden"
        style={{
          // Use base values, let the hook override the clipPath dynamically
          clipPath: 'circle(0px at 100% 0px)',
          opacity: 0,
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
      >
        {/* Navigation links */}
        <nav className="w-full px-4 text-center mt-[-8vh] md:mt-0 relative z-10">
          {menuItems.map((item, i) => (
            <Link
              key={item.name}
              to={item.path}
              className="menu-link block font-extrabold text-orange-500 no-underline leading-[1.15]"
              onClick={() => handleNavClick(item.path)}
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)',
                letterSpacing: '-2px',
                transform: menuOpen ? 'translateY(0)' : 'translateY(60px)',
                opacity: menuOpen ? 1 : 0,
                transition: `
                  transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.07}s,
                  opacity   0.6s ease                        ${0.2 + i * 0.07}s,
                  letter-spacing 0.3s ease, color 0.3s ease
                `,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#c2410c'}
              onMouseLeave={e => e.currentTarget.style.color = '#f97316'}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Footer Section */}
        <div 
          className="absolute bottom-6 md:bottom-10 left-0 w-full px-6 md:px-8 flex flex-col-reverse md:flex-row justify-between items-center md:items-end gap-6 md:gap-0 z-10"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s',
          }}
        >
          {/* Tagline */}
          <p className="text-orange-500/70 text-[0.75rem] md:text-[0.8rem] text-center md:text-left max-w-[200px] leading-relaxed m-0">
            Love working with passionate people and brands
          </p>

          {/* Socials */}
          <div className="flex flex-row flex-wrap md:flex-col justify-center md:justify-end gap-2 md:gap-2 max-w-[300px] md:max-w-none">
            {[
              { label: 'X (Twitter)', href: 'https://twitter.com' },
              { label: 'LinkedIn', href: 'https://linkedin.com' },
              { label: 'Instagram', href: 'https://instagram.com' },
              { label: 'Email', href: 'mailto:hello@pt.com' },
            ].map(({ label, href }) => (
              <a 
                key={label} 
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="border-[1.5px] border-orange-500/50 text-orange-500 px-4 md:px-[16px] py-1 md:py-[5px] rounded-full text-[10px] md:text-[0.75rem] font-medium no-underline text-center transition-all duration-300 hover:bg-orange-500 hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;