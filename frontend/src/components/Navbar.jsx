import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getLenis } from '../hooks/useLenis';


const menuItems = [
  { name: 'Events', path: '/events' },
  { name: 'ABOUT', path: '/about' },
  { name: 'SUCESS STORIES', path: '/success-stories' },
  { name: 'CONTACTS', path: '/contact' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const curtainRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5;
      // Adding a 10px buffer prevents "flickering" at the trigger point
      if (window.scrollY > threshold) {
        setScrolled(true);
      } else if (window.scrollY < threshold - 10) {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Curtain slide‑in/out animation (clip‑path)
  useEffect(() => {
    const el = curtainRef.current;
    if (!el) return;

    // Dynamic origin point
    // At top: 95% 5% 
    // In Pill: roughly 78% 6% (or whatever matches your pill button)
    const origin = scrolled ? '80% 8%' : '96.5% 6%';

    if (menuOpen) {
      el.style.transition = 'none';
      el.style.clipPath = `circle(0% at ${origin})`;
      el.style.opacity = '1';
      void el.offsetWidth; // Force reflow
      el.style.transition = 'clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
      el.style.clipPath = `circle(150% at ${origin})`;
    } else {
      el.style.transition = 'clip-path 0.6s cubic-bezier(0.76, 0, 0.24, 1)';
      el.style.clipPath = `circle(0% at ${origin})`;
    }
  }, [menuOpen, scrolled]); // Added scrolled to the dependency array

  const handleNavClick = (path) => {
    setMenuOpen(false);
    const lenis = getLenis();
    if (lenis) lenis.start();
    setTimeout(() => navigate(path), 500);
  };

  return (
    <>
      <style>{`
        .nav-btn { position: relative; overflow: hidden; }
        .nav-btn .ico {
  position: absolute;
  inset: 0; /* Add this! Forces icons to the center of the circle */
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

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        top: scrolled ? '20px' : '0', // Margin from the top
        width: scrolled ? 'min(1000px, 90%)' : '100%',


        transition: `
    width 1s cubic-bezier(0.65, 0, 0.35, 1),
    top 1s cubic-bezier(0.65, 0, 0.35, 1),
    padding 1s cubic-bezier(0.65, 0, 0.35, 1),
    border-radius 1s cubic-bezier(0.65, 0, 0.35, 1),
    background-color 0.9s ease,
    backdrop-filter 0.9s ease
  `,

        borderRadius: scrolled ? '100px' : '0px',
        padding: scrolled ? '15px 24px' : '20px 32px',
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        backdropFilter: scrolled ? 'blur(2px)' : 'none',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // border: scrolled ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent',
      }}>
        <div className='flex items-center gap-2'>
           <div className='w-11 h-10 rounded-xl flex'>
              <img className=' w-19' src="/Evolve.png" alt="evolve-logo" />
            </div>
        <Link to="/" onClick={() => setMenuOpen(false)} style={{
          fontSize: scrolled ? '1.4rem' : '1.5rem', // Shrink logo slightly
          fontWeight: 800,
          color: menuOpen ? '#434343' : (scrolled ? '#434343' : '#ffffff'),
          textDecoration: 'none',
          letterSpacing: '-0.5px',
          transition: 'all 0.6s ease',
        }}>
          Evolve<span className="text-[#e87315]">.</span>
        </Link>

        </div>
        {/* Logo */}

        {/* Right Side Content */}
        <div style={{ display: 'flex', alignItems: 'center', gap: scrolled ? '12px' : '16px' }}>
          <Link to="/get-started" style={{
            background: '#f97316',
            color: 'white',
            padding: scrolled ? '6px 18px' : '8px 22px',
            borderRadius: '100px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.4s ease',
          }}>
            GET STARTED
          </Link>


          <button
            type="button"
            onClick={() => {
              const next = !menuOpen;
              setMenuOpen(next);
              const lenis = getLenis();
              if (lenis) next ? lenis.stop() : lenis.start();
            }}
            style={{
              width: scrolled ? "38px" : "44px",
              height: scrolled ? "38px" : "44px",
              borderRadius: "50%",
              border: "1.5px solid #f97316",
              background: "transparent",
              cursor: "pointer",
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              transition: 'all 0.4s ease',
            }}
          >
            {/* Menu Icon */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'scale(0.5) rotate(90deg)' : 'scale(1) rotate(0deg)',
              pointerEvents: menuOpen ? 'none' : 'auto' // Prevents ghost clicks
            }}>
              <Menu size={scrolled ? 18 : 20} color="#f97316" />
            </div>

            {/* Close Icon */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-90deg)',
              pointerEvents: menuOpen ? 'auto' : 'none'
            }}>
              <X size={scrolled ? 18 : 20} color="#f97316" />
            </div>
          </button>
        </div>
      </nav>

      {/* ── CURTAIN MENU ── */}

      <div
        ref={curtainRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          background: '#f5f0e8',
          // Match the origin here too
          clipPath: `circle(0% at ${scrolled ? '78% 6%' : '95% 5%'})`,
          opacity: 0,
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
      >
        {/* Navigation links */}
        <nav style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          {menuItems.map((item, i) => (
            <Link
              key={item.name}
              to={item.path}
              className="menu-link"
              onClick={() => handleNavClick(item.path)}
              style={{
                display: 'block',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 800,
                color: '#f97316',
                textDecoration: 'none',
                lineHeight: 1.1,
                letterSpacing: '-3px',
                transform: menuOpen ? 'translateY(0)' : 'translateY(60px)',
                opacity: menuOpen ? 1 : 0,
                transition: `
                  transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.07}s,
                  opacity   0.6s ease                        ${0.2 + i * 0.07}s,
                  letter-spacing 0.3s ease
                `,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#c2410c'}
              onMouseLeave={e => e.currentTarget.style.color = '#f97316'}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom‑left tagline */}
        <p style={{
          position: 'absolute', left: '32px', bottom: '40px',
          color: 'rgba(249,115,22,0.7)', fontSize: '0.8rem',
          lineHeight: 1.6, maxWidth: '160px',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s',
        }}>
          Love working with passionate people and brands
        </p>

        {/* Bottom‑right socials */}
        <div style={{
          position: 'absolute', right: '32px', bottom: '40px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease 0.55s, transform 0.5s ease 0.55s',
        }}>
          {[
            { label: 'X (Twitter)', href: 'https://twitter.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
            { label: 'Instagram', href: 'https://instagram.com' },
            { label: 'Email', href: 'mailto:hello@pt.com' },
          ].map(({ label, href }) => (
            <a key={label} href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                border: '1.5px solid rgba(249,115,22,0.5)',
                color: '#f97316', padding: '5px 16px',
                borderRadius: '100px', fontSize: '0.75rem',
                fontWeight: 500, textDecoration: 'none', textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f97316'; }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;