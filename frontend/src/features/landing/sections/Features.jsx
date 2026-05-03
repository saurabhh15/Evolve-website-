import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Users, CircleDollarSign, Handshake } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";

const FEATURES = [
  {
    tag: "01 — Discovery",
    Icon: Lightbulb,
    title: "Showcase Your Innovation",
    description:
      "Transform your academic projects into visible startup opportunities. Let stakeholders discover your potential.",
    bullets: [
      "Create detailed project profiles",
      "Highlight target markets & tech stacks",
      "Gain visibility among investors",
    ],
    cardBg: "#f97316",
    imageBg: "rgba(0,0,0,0.18)",
    image:
      "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fFNob3djYXNlJTIwWW91ciUyMElubm92YXRpb258ZW58MHx8MHx8fDA%3D",
  },
  {
    tag: "02 — Mentorship",
    Icon: Users,
    title: "Connect with Industry Experts",
    description:
      "Bridge the gap between academia and commercial success with guidance from seasoned entrepreneurs and mentors.",
    bullets: [
      "Domain-matched mentor pairing",
      "Direct feedback on prototypes",
      "Strategic growth guidance",
    ],
    cardBg: "#0f172a",
    imageBg: "rgba(255,255,255,0.05)",
    image:
      "https://images.unsplash.com/photo-1759310610480-48649b55fbdf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTczfHxDb25uZWN0JTIwd2l0aCUyMEluZHVzdHJ5JTIwRXhwZXJ0c3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    tag: "03 — Funding",
    Icon: CircleDollarSign,
    title: "Access Investor Capital",
    description:
      "Get your MVP in front of VCs, angel investors, and accelerators actively seeking academic spinouts.",
    bullets: [
      "Pitch directly to investors",
      "Track funding rounds",
      "Access micro-grants & pre-seed",
    ],
    cardBg: "#059669",
    imageBg: "rgba(0,0,0,0.18)",
    image:
      "https://images.unsplash.com/photo-1579621970343-21c491b3f363?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjkzfHxGdW5kaW5nJTIwaW52ZXN0b3JzfGVufDB8fDB8fHww",
  },
  {
    tag: "04 — Community",
    Icon: Handshake,
    title: "Find Your Co-Founders",
    description:
      "Networking tools, real-time messaging, and resource hubs to help you build your dream team.",
    bullets: [
      "Real-time basic messaging",
      "Recruit talented team members",
      "Access startup templates & tools",
    ],
    cardBg: "#b45309",
    imageBg: "rgba(0,0,0,0.18)",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYyfHxDb21tdW5pdHl8ZW58MHx8MHx8fDA%3D",
  },
];

const FeatureCard = ({ feature }) => {
  return (
    <div
      className="flex flex-col md:flex-row items-stretch overflow-hidden relative w-full h-full"
      style={{
        background: feature.cardBg,
        borderRadius: "2.5rem",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      }}
    >
      {/* Subtle inner highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)",
          borderRadius: "2.5rem",
        }}
      />

      {/* ── Text content ── */}
      <div className="flex-1 flex flex-col justify-between relative p-5 sm:p-7 md:p-10 lg:p-14">
        <div>
          <div className="flex items-center gap-2.5 mb-3 md:mb-4">
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <feature.Icon className="text-white w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
            </div>
            <div className="h-[1px] w-6 bg-white/30" />
            <span className="text-[0.58rem] md:text-[0.65rem] font-extrabold tracking-[0.2em] uppercase text-white/65">
              {feature.tag}
            </span>
          </div>

          <h3
            className="font-black text-white leading-[1.08] mb-2.5 md:mb-4"
            style={{ fontSize: "clamp(1.35rem, 4vw, 2.8rem)" }}
          >
            {feature.title}
          </h3>

          <p
            className="text-white/70 leading-relaxed mb-4 md:mb-6 max-w-[480px]"
            style={{ fontSize: "clamp(0.8rem, 2vw, 1.05rem)" }}
          >
            {feature.description}
          </p>
        </div>

        <ul className="list-none p-0 m-0 flex flex-col gap-2 md:gap-3">
          {feature.bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] rounded-full bg-white/20 border border-white/25 flex items-center justify-center shrink-0">
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white block" />
              </span>
              <span
                className="text-white/90 font-medium"
                style={{ fontSize: "clamp(0.75rem, 1.8vw, 0.95rem)" }}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Image panel ── */}
      <div
        className="w-full md:w-[300px] lg:w-[360px] shrink-0 flex items-center justify-center relative overflow-hidden p-4 sm:p-5 md:p-6"
        style={{
          // On mobile: fixed height that fills nicely without overflowing card
          height: "clamp(140px, 36vw, 220px)",
          // On md+: auto height to fill the card
          ...(typeof window !== 'undefined' && window.innerWidth >= 768 ? { height: 'auto' } : {}),
          background: feature.imageBg,
        }}
      >
        {/* Separator */}
        <div className="absolute md:hidden top-0 left-[8%] w-[84%] h-[1px] bg-white/10" />
        <div className="hidden md:block absolute left-0 top-[8%] h-[84%] w-[1px] bg-white/10" />

        <div className="w-full h-full rounded-[1.25rem] overflow-hidden">
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover block"
            loading="lazy"
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
      {/* Dot grid */}
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

      {/* Section header */}
      <div
        className="relative text-center px-5 sm:px-6"
        style={{ paddingTop: "60px", paddingBottom: "16px", zIndex: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ height: "1px", width: "40px", background: "linear-gradient(to right, transparent, #c17a3a)" }} />
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 800,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#9a4a10",
                border: "1px solid rgba(193,122,58,0.4)",
                backgroundColor: "rgba(249,115,22,0.08)",
                padding: "7px 16px",
                borderRadius: "999px",
              }}
            >
              Platform Features
            </span>
            <div style={{ height: "1px", width: "40px", background: "linear-gradient(to left, transparent, #c17a3a)" }} />
          </div>

          <h2
            style={{
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              fontSize: "clamp(2rem, 7vw, 5.2rem)",
              color: "#1a0800",
              margin: "0 auto",
            }}
          >
            Everything you need
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #c45c00, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              to build and launch.
            </span>
          </h2>

          <p
            style={{
              fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)",
              marginTop: "16px",
              maxWidth: "480px",
              margin: "16px auto 0",
              lineHeight: 1.7,
              color: "rgba(122,69,32,0.75)",
            }}
          >
            The complete toolkit to transform your academic projects into
            viable, funded startups.
          </p>
        </motion.div>
      </div>

      {/* ScrollStack */}
      <div className="relative" style={{ zIndex: 2 }}>
        <ScrollStack
          useWindowScroll={true}
          itemDistance={120}
          itemScale={0.012}
          itemStackDistance={24}
          stackPosition="18%"
          scaleEndPosition="10%"
          baseScale={0.97}
          blurAmount={0}
        >
          {FEATURES.map((feature) => (
            <ScrollStackItem
              key={feature.tag}
              // No fixed height on mobile — let content breathe naturally
              itemClassName="min-h-[360px] md:h-[480px]"
              style={{
                background: feature.cardBg,
                willChange: "transform",
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              <FeatureCard feature={feature} />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      <div
        style={{
          height: "60px",
          background: "linear-gradient(to bottom, transparent, #fffaf5)",
          position: "relative",
          zIndex: 2,
        }}
      />
    </section>
  );
};

export default Features;