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
      className="flex flex-col md:flex-row items-stretch overflow-hidden relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.2)] md:shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
      style={{ background: feature.cardBg }}
    >
      {/* Subtle inner highlight */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[1.5rem] md:rounded-[2.5rem]"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)",
        }}
      />

      {/* ── Top/Left: Text content ── */}
      <div className="flex-1 flex flex-col justify-center relative p-6 sm:p-8 md:p-12 lg:p-16">
        <div>
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <feature.Icon className="text-white w-4 h-4" strokeWidth={2.5} />
            </div>
            <div className="h-[1px] w-8 bg-white/30" />
            <span className="text-[0.6rem] md:text-[0.65rem] font-extrabold tracking-[0.22em] uppercase text-white/65">
              {feature.tag}
            </span>
          </div>

          <h3
            className="font-black text-white leading-[1.05] mb-3 md:mb-5"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 3rem)" }}
          >
            {feature.title}
          </h3>

          <p
            className="text-white/70 leading-relaxed mb-6 md:mb-8 max-w-[480px]"
            style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)" }}
          >
            {feature.description}
          </p>
        </div>

        <ul className="list-none p-0 m-0 flex flex-col gap-2.5 md:gap-3.5">
          {feature.bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] rounded-full bg-white/20 border border-white/25 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white block" />
              </span>
              <span
                className="text-white/90 font-medium"
                style={{ fontSize: "clamp(0.8rem, 1.3vw, 1rem)" }}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Bottom/Right: Image panel ── */}
      <div
        className="w-full md:w-[320px] lg:w-[380px] h-[180px] sm:h-[220px] md:h-auto shrink-0 flex flex-col items-center justify-center relative overflow-hidden p-4 sm:p-6 md:p-6"
        style={{ background: feature.imageBg }}
      >
        <div className="absolute md:hidden top-0 left-[10%] w-[80%] h-[1px] bg-white/10" />
        <div className="hidden md:block absolute left-0 top-[10%] h-[80%] w-[1px] bg-white/10" />

        <div className="w-full h-full rounded-[1rem] md:rounded-[1.25rem] flex items-center justify-center relative overflow-hidden bg-white/5">
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover block"
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

      <div
        className="relative text-center px-6"
        style={{ paddingTop: "80px", paddingBottom: "24px", zIndex: 2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div style={{ height: "1px", width: "56px", background: "linear-gradient(to right, transparent, #c17a3a)" }} />
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 800,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#9a4a10",
                border: "1px solid rgba(193,122,58,0.4)",
                backgroundColor: "rgba(249,115,22,0.08)",
                padding: "8px 20px",
                borderRadius: "999px",
              }}
            >
              Platform Features
            </span>
            <div style={{ height: "1px", width: "56px", background: "linear-gradient(to left, transparent, #c17a3a)" }} />
          </div>

          <h2
            style={{
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              fontSize: "clamp(2.5rem, 6.5vw, 5.2rem)",
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
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              marginTop: "20px",
              maxWidth: "520px",
              margin: "20px auto 0",
              lineHeight: 1.7,
              color: "rgba(122,69,32,0.75)",
            }}
          >
            The complete toolkit to transform your academic projects into
            viable, funded startups.
          </p>
        </motion.div>
      </div>

      <div className="relative" style={{ zIndex: 2 }}>
        <ScrollStack
          useWindowScroll={true}
          itemDistance={160} 
          itemScale={0.015}        
          itemStackDistance={32}  
          stackPosition="18%"     
          scaleEndPosition="10%"  
          baseScale={0.96}         
          blurAmount={0}
        >
          {FEATURES.map((feature) => (
            <ScrollStackItem
              key={feature.tag}
              // Fixed mobile height: Taller on mobile (h-[560px]) to prevent text overflow, standard on desktop (md:h-[480px])
              itemClassName="h-[560px] sm:h-[500px] md:h-[480px] lg:h-[500px]" 
              style={{
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