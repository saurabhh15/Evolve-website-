import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

class PerlinNoise {
  constructor() {
    this.permutation = [];
    for (let i = 0; i < 256; i++) this.permutation[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    this.p = [...this.permutation, ...this.permutation];
  }
  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(t, a, b) { return a + t * (b - a); }
  grad(hash, x, y) {
    const h = hash & 3, u = h < 2 ? x : y, v = h < 2 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -v : v);
  }
  noise(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = this.fade(x), v = this.fade(y);
    const a = this.p[X] + Y, b = this.p[X + 1] + Y;
    return this.lerp(v,
      this.lerp(u, this.grad(this.p[a], x, y), this.grad(this.p[b], x - 1, y)),
      this.lerp(u, this.grad(this.p[a + 1], x, y - 1), this.grad(this.p[b + 1], x - 1, y - 1))
    );
  }
}

const CYCLING_WORDS = ["RESEARCH", "THESIS", "PROJECT", "IDEA"];

const FLOAT_TAGS = [
  { label: "Development", x: "12%", y: "12%" },
  { label: "Collaboration", x: "78%", y: "20%" },
  { label: "Side Project", x: "8%", y: "55%" },
  { label: "Hackathon", x: "72%", y: "57%" },
  { label: "Mentorship", x: "20%", y: "70%" },
  { label: "Research", x: "68%", y: "78%" },
];

const STATS = [
  { value: "20+", label: "Students" },
  { value: "5+", label: "Startups" },
  { value: "$2M+", label: "Raised" },
];

const Counter = ({ value }) => {
  const count = useMotionValue(0);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  
  const displayValue = useTransform(count, (latest) => {
    const num = Math.round(latest);
    if (value.includes("M+")) return `$${num}M+`;
    if (value.startsWith("$")) return `$${num}`;
    if (value.endsWith("+")) return `${num}+`;
    return num;
  });

  useEffect(() => {
    const controls = animate(count, numericValue, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [numericValue, count]);
  
  return <motion.div>{displayValue}</motion.div>;
};

const Hero = ({ scrollY = 0, menuOpen = false }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const tagsRef = useRef([]);
  const scrollLineRef = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* cycling word */
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % CYCLING_WORDS.length);
        setWordVisible(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  /* floating tags GSAP — skip on mobile */
  useEffect(() => {
    if (isMobile) return;
    tagsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { y: "+=18", duration: 2.8 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.3 });
      gsap.fromTo(el,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.6 + i * 0.15, ease: "back.out(1.4)" }
      );
    });
  }, [isMobile]);

  /* scroll indicator pulse */
  useEffect(() => {
    if (!scrollLineRef.current) return;
    gsap.fromTo(scrollLineRef.current,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 1.2, delay: 1.5, ease: "power3.out", transformOrigin: "top center" }
    );
    gsap.to(scrollLineRef.current, { opacity: 0.3, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.7 });
  }, []);

  /* mouse tracking */
  useEffect(() => {
    if (isMobile) return;
    const handleMouse = (e) => { mouseRef.current.tx = e.clientX; mouseRef.current.ty = e.clientY; };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [isMobile]);

  /* canvas orbs */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const noise = new PerlinNoise();
    let animationFrameId;

    const resize = () => {
      // Prevents the canvas from randomly resetting on mobile when scrolling up/down
      const currentWidth = window.innerWidth;
      if (isMobile && currentWidth === lastWidthRef.current && canvas.width !== 0) return;
      lastWidthRef.current = currentWidth;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const state = {
      time: 0, breathing: 0,
      orbs: [
        { x: 0.5, y: 0.5, color: [255, 165, 0], baseSize: 0.25, noiseOffset: Math.random() * 100 },
        { x: 0.45, y: 0.45, color: [255, 79, 16], baseSize: 0.22, noiseOffset: Math.random() * 100 },
        { x: 0.55, y: 0.55, color: [160, 40, 255], baseSize: 0.3, noiseOffset: Math.random() * 100 },
      ],
    };

    gsap.to(state, { breathing: Math.PI * 2, duration: 6, repeat: -1, ease: "sine.inOut" });

    const render = () => {
      const w = window.innerWidth, h = window.innerHeight;
      state.time += 0.004;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";

      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.08;
      
      const mx = isMobile ? 0 : (mouseRef.current.x / w - 0.5) * 2;
      const my = isMobile ? 0 : (mouseRef.current.y / h - 0.5) * 2;

      state.orbs.forEach((orb, i) => {
        const nx = noise.noise(state.time + orb.noiseOffset, 0);
        const ny = noise.noise(state.time + orb.noiseOffset, 100);
        const depth = 0.3 + i * 0.3;
        const x = w * (orb.x + nx * 0.25) + mx * 250 * depth;
        const y = h * (orb.y + ny * 0.25) + my * 250 * depth;
        const scale = 1 + Math.sin(state.breathing + i) * 0.15;
        
        // Keeps orbs slightly smaller on mobile so text is easier to read
        const mobileScale = isMobile ? 0.75 : 1;
        const r = Math.max(w, h) * orb.baseSize * scale * mobileScale;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        const [rC, gC, bC] = orb.color;
        grad.addColorStop(0, `rgba(${rC},${gC},${bC},0.9)`);
        grad.addColorStop(0.3, `rgba(${rC},${gC},${bC},0.5)`);
        grad.addColorStop(0.6, `rgba(${rC},${gC},${bC},0.2)`);
        grad.addColorStop(1, `rgba(${rC},${gC},${bC},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      gsap.killTweensOf(state);
    };
  }, [isMobile]);

  return (
    // EXACT ORIGINAL STRUCTURE: 100dvh + 80px padding ensures the next section (-80px) is hidden below the fold
    <section className="relative min-h-[100dvh] overflow-hidden" style={{ paddingBottom: "80px" }}>
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          filter: `blur(${120 + scrollY * 0.08}px) saturate(150%) contrast(110%)`,
          opacity: menuOpen ? 0.4 : 1,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Floating tags — desktop only */}
      {!isMobile && FLOAT_TAGS.map((tag, i) => (
        <div
          key={tag.label}
          ref={el => (tagsRef.current[i] = el)}
          style={{
            position: 'absolute', left: tag.x, top: tag.y, zIndex: 5, opacity: 0,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.75)',
            fontSize: '0.75rem', fontWeight: 500, padding: '6px 14px',
            borderRadius: '100px', letterSpacing: '0.5px',
            pointerEvents: 'none', userSelect: 'none',
          }}
        >
          {tag.label}
        </div>
      ))}

      {/* Main content - Using exact original structure and styles */}
      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] text-center px-4 sm:px-6 max-w-5xl mx-auto"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 5rem)',
          fontWeight: 800, color: 'white',
          lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '8px',
        }}>
          TURN YOUR ACADEMIC
        </h1>

        {/* Cycling word */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 5rem)',
          fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px',
          marginBottom: '8px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '16px', color: 'white', flexWrap: 'wrap',
        }}>
          <span style={{
            display: 'inline-block', color: '#fb923c',
            borderBottom: '3px solid #fb923c', paddingBottom: '2px',
            minWidth: isMobile ? '160px' : '280px',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            opacity: wordVisible ? 1 : 0,
            transform: wordVisible ? 'translateY(0)' : 'translateY(-12px)',
            textAlign: 'center',
          }}>
            {CYCLING_WORDS[wordIndex]}
          </span>
        </h1>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 5rem)',
          fontWeight: 800, color: 'white',
          lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '24px',
        }}>
          INTO A STARTUP
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          marginBottom: '36px', maxWidth: '480px', padding: '0 8px'
        }}>
          Build something real from your college work — with mentors, funding, and a community that gets it.
        </p>

        {/* Stats bar */}
        <div style={{
          display: "flex", gap: "clamp(24px, 5vw, 48px)",
          justifyContent: "center", flexWrap: "wrap",
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800, color: "white", letterSpacing: "-1px",
              }}>
                <Counter value={s.value} />
              </div>
              <div style={{
                fontSize: "0.7rem", color: "rgba(255,255,255,0.5)",
                letterSpacing: "1.5px", marginTop: "2px",
              }}>
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;