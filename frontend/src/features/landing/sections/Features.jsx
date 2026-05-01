import React from "react";
import { motion } from "framer-motion";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";

const FEATURES = [
  {
    tag: "01 — Discovery",
    icon: "🔍",
    title: "Showcase Your Innovation",
    description:
      "Transform your academic projects into visible startup opportunities. Let stakeholders discover your potential.",
    bullets: ["Create detailed project profiles", "Highlight target markets & tech stacks", "Gain visibility among investors"],
    cardBg: "#f97316",
    imageBg: "rgba(0,0,0,0.18)",
    image: "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fFNob3djYXNlJTIwWW91ciUyMElubm92YXRpb258ZW58MHx8MHx8fDA%3D", 
  },
  {
    tag: "02 — Mentorship",
    icon: "🧠",
    title: "Connect with Industry Experts",
    description:
      "Bridge the gap between academia and commercial success with guidance from seasoned entrepreneurs and mentors.",
    bullets: ["Domain-matched mentor pairing", "Direct feedback on prototypes", "Strategic growth guidance"],
    cardBg: "#0f172a",
    imageBg: "rgba(255,255,255,0.05)",
    image: "https://images.unsplash.com/photo-1759310610480-48649b55fbdf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTczfHxDb25uZWN0JTIwd2l0aCUyMEluZHVzdHJ5JTIwRXhwZXJ0c3xlbnwwfHwwfHx8MA%3D%3D", 
  },
  {
    tag: "03 — Funding",
    icon: "💰",
    title: "Access Investor Capital",
    description:
      "Get your MVP in front of VCs, angel investors, and accelerators actively seeking academic spinouts.",
    bullets: ["Pitch directly to investors", "Track funding rounds", "Access micro-grants & pre-seed"],
    cardBg: "#059669",
    imageBg: "rgba(0,0,0,0.18)",
    image: "https://images.unsplash.com/photo-1579621970343-21c491b3f363?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjkzfHxGdW5kaW5nJTIwaW52ZXN0b3JzfGVufDB8fDB8fHww", 
  },
  {
    tag: "04 — Community",
    icon: "🤝",
    title: "Find Your Co-Founders",
    description:
      "Networking tools, real-time messaging, and resource hubs to help you build your dream team.",
    bullets: ["Real-time basic messaging", "Recruit talented team members", "Access startup templates & tools"],
    cardBg: "#b45309",
    imageBg: "rgba(0,0,0,0.18)",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYyfHxDb21tdW5pdHl8ZW58MHx8MHx8fDA%3D", // Image from your uploads
  },
];

const FeatureCard = ({ feature }) => {
  return (
    <div
      style={{
        background: feature.cardBg,
        minHeight: "480px",
        width: "100%",
        borderRadius: "2.5rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      }}
    >
      {/* Subtle inner highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)",
          pointerEvents: "none",
          borderRadius: "2.5rem",
        }}
      />

      {/* ── Left: text content ── */}
      <div
        style={{
          flex: 1,
          padding: "clamp(2rem, 4vw, 4rem)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ height: "1px", width: "40px", background: "rgba(255,255,255,0.3)" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>
              {feature.tag}
            </span>
          </div>

          <h3 style={{ fontWeight: 900, color: "white", lineHeight: 1.05, marginBottom: "20px", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
            {feature.title}
          </h3>

          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", lineHeight: 1.7, marginBottom: "32px", maxWidth: "480px" }}>
            {feature.description}
          </p>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
          {feature.bullets.map((b, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "white", display: "block" }} />
              </span>
              <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "clamp(0.875rem, 1.3vw, 1rem)", fontWeight: 500 }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right: Image panel ── */}
      <div
        style={{
          width: "320px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: feature.imageBg,
          padding: "24px",
          gap: "0",
        }}
      >
        {/* Vertical divider line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "10%",
            height: "80%",
            width: "1px",
            background: "rgba(255,255,255,0.12)",
          }}
        />

        {/* Static Image display */}
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "360px",
            borderRadius: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <img
            src={feature.image}
            alt={feature.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section
      style={{
        background: "#fffaf5",
        marginTop: "-80px",
        borderRadius: "60px 60px 0 0",
        position: "relative",
        zIndex: 10,
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Dot-grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(193,122,58,0.1) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Section header ── */}
      <div className="relative text-center px-6" style={{ paddingTop: "80px", paddingBottom: "24px", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div style={{ height: "1px", width: "56px", background: "linear-gradient(to right, transparent, #c17a3a)" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: "#9a4a10", border: "1px solid rgba(193,122,58,0.4)", backgroundColor: "rgba(249,115,22,0.08)", padding: "8px 20px", borderRadius: "999px" }}>
              Platform Features
            </span>
            <div style={{ height: "1px", width: "56px", background: "linear-gradient(to left, transparent, #c17a3a)" }} />
          </div>

          <h2 style={{ fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.0, fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)", color: "#1a0800", margin: "0 auto" }}>
            Everything you need
            <br />
            <span style={{ background: "linear-gradient(135deg, #c45c00, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              to build and launch.
            </span>
          </h2>

          <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", marginTop: "20px", maxWidth: "520px", margin: "20px auto 0", lineHeight: 1.7, color: "rgba(122,69,32,0.75)" }}>
            The complete toolkit to transform your academic projects into viable, funded startups.
          </p>
        </motion.div>
      </div>

      {/* ── ScrollStack ── */}
      <div className="relative" style={{ zIndex: 2 }}>
        <ScrollStack
          useWindowScroll={true}
          itemDistance={110}
          itemScale={0.04}
          itemStackDistance={26}
          stackPosition="30%"
          scaleEndPosition="10%"
          baseScale={0.87}
          blurAmount={0}
        >
          {FEATURES.map((feature) => (
            <ScrollStackItem
              key={feature.tag}
              itemClassName="min-h-[480px]"
              style={{ background: feature.cardBg, willChange: "transform", backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
            >
              <FeatureCard feature={feature} />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      {/* Bottom fade */}
      <div style={{ height: "60px", background: "linear-gradient(to bottom, transparent, #fffaf5)", position: "relative", zIndex: 2 }} />
    </section>
  );
};

export default Features;