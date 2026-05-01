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
  { label: "Collaboration", x: "88%", y: "20%" },
  { label: "Side Project", x: "8%", y: "55%" },
  { label: "Hackathon", x: "80%", y: "57%" },
  { label: "Mentorship", x: "20%", y: "70%" },
  { label: "Research", x: "72%", y: "78%" },
];

const FLOAT_Icons = [
  { label: "🚀", x: "12%", y: "22%" },
  { label: "🔥", x: "78%", y: "28%" },
  { label: "👩🏻‍💻", x: "8%", y: "65%" },
  { label: "💡", x: "80%", y: "60%" },
  // { label: "💡", x: "80%", y: "60%" },
];



const STATS = [
  { value: "20+", label: "Students" },
  { value: "5+", label: "Startups" },
  { value: "$2", label: "Raised" },
];
const Counter = ({ value }) => {
  const count = useMotionValue(0);

  // Extract number from string (e.g., "$2M" -> 2, "200+" -> 200)
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10);

  // Format it back as it counts
  const displayValue = useTransform(count, (latest) => {
    const num = Math.round(latest);
    if (value.startsWith("$")) return `$${num}`;
    if (value.endsWith("+")) return `${num}+`;
    return num;
  });

  useEffect(() => {
    // Duration in seconds, easeOut makes it "snap" into place smoothly
    const controls = animate(count, numericValue, {
      duration: 2,
      ease: "easeOut"
    });
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

  /* ── cycling word ── */
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

  /* ── floating tags GSAP ── */
  useEffect(() => {
    tagsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: "+=18",
        duration: 2.8 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
      gsap.fromTo(el,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.6 + i * 0.15, ease: "back.out(1.4)" }
      );
    });
  }, []);

  /* ── scroll indicator pulse ── */
  useEffect(() => {
    if (!scrollLineRef.current) return;
    gsap.fromTo(scrollLineRef.current,
      { scaleY: 0, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 1.2, delay: 1.5, ease: "power3.out", transformOrigin: "top center" }
    );
    gsap.to(scrollLineRef.current, {
      opacity: 0.3,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.7,
    });
  }, []);

  /* ── mouse tracking ── */
  useEffect(() => {
    const handleMouse = (e) => { mouseRef.current.tx = e.clientX; mouseRef.current.ty = e.clientY; };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  /* ── canvas orbs ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const noise = new PerlinNoise();
    let animationFrameId;

    const resize = () => {
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
      const mx = (mouseRef.current.x / w - 0.5) * 2;
      const my = (mouseRef.current.y / h - 0.5) * 2;

      state.orbs.forEach((orb, i) => {
        const nx = noise.noise(state.time + orb.noiseOffset, 0);
        const ny = noise.noise(state.time + orb.noiseOffset, 100);
        const depth = 0.3 + i * 0.3;
        const x = w * (orb.x + nx * 0.25) + mx * 250 * depth;
        const y = h * (orb.y + ny * 0.25) + my * 250 * depth;
        const scale = 1 + Math.sin(state.breathing + i) * 0.15;
        const r = Math.max(w, h) * orb.baseSize * scale;

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
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ paddingBottom: "100px" }}>
      {/* ── Background canvas ── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{
          filter: `blur(${120 + scrollY * 0.08}px) saturate(150%) contrast(110%)`,
          // dim hero slightly when menu is open so curtain pops
          opacity: menuOpen ? 0.4 : 1,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* ── Floating keyword tags ── */}
      {FLOAT_TAGS.map((tag, i) => (
        <div
          key={tag.label}
          ref={el => (tagsRef.current[i] = el)}
          style={{
            position: 'absolute',
            left: tag.x,
            top: tag.y,
            zIndex: 5,
            opacity: 0, // GSAP animates this in
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.75)',
            fontSize: '0.75rem',
            fontWeight: 500,
            padding: '6px 14px',
            borderRadius: '100px',
            letterSpacing: '0.5px',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {tag.label}
        </div>
      ))}
        {/* {FLOAT_Icons.map((tag, i) => (
        <div
          key={tag.label}
          ref={el => (tagsRef.current[i] = el)}
          style={{
            position: 'absolute',
            left: tag.x,
            top: tag.y,
            zIndex: 5,
            opacity: 0, // GSAP animates this in
           
            // border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.75)',
            fontSize: '3.75rem',
            fontWeight: 500,
            padding: '6px 14px',
            borderRadius: '100px',
            letterSpacing: '0.5px',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {tag.label}
        </div>
      ))} */}

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 max-w-5xl mx-auto"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        {/* Badge */}


        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 5rem)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: '8px',
        }}>
          TURN YOUR ACADEMIC
        </h1>

        {/* Cycling word line */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          color: 'white',
        }}>
          <span
            style={{
              display: 'inline-block',
              color: '#fb923c',
              borderBottom: '3px solid #fb923c',
              paddingBottom: '2px',
              minWidth: '280px',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              opacity: wordVisible ? 1 : 0,
              transform: wordVisible ? 'translateY(0)' : 'translateY(-12px)',
            }}
          >
            {CYCLING_WORDS[wordIndex]}
          </span>
        </h1>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 6vw, 5rem)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: '28px',
        }}>
          INTO A STARTUP
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '480px' }}>
          Build something real from your college work — with mentors, funding, and a community that gets it.
        </p>



        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            justifyContent: "center",
            flexWrap: "wrap",
           
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-1px",
                }}
              >
                <Counter value={s.value} />
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "1.5px",
                  marginTop: "2px",
                }}
              >
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