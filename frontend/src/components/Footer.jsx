import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import footerImg from "../assets/footer.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const bottomRef = useRef(null);

  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });
  const bottomInView = useInView(bottomRef, { once: true, margin: "-60px" });

  const [glowVisible, setGlowVisible] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set CSS variables directly on the footer element
    footerRef.current.style.setProperty("--mouse-x", `${x}px`);
    footerRef.current.style.setProperty("--mouse-y", `${y}px`);

    if (!glowVisible) setGlowVisible(true);
  };

  const handleMouseLeave = () => setGlowVisible(false);

 const linkGroups = [
    {
      title: "PLATFORM",
      links: [
       
        { name: "Join Evolve", href: "/get-started", active: true },
      ],
    },
    {
      title: "CONNECT",
      links: [
        { name: "Contact Us", href: "/Contact" },
      ],
    },
  ];

  const socialLinks = [
    { label: "X", href: "#", icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
    { label: "LinkedIn", href: "#", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" },
    { label: "Instagram", href: "#", icon: "M2 2h20v20H2z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01" },
    { label: "Email", href: "#", icon: "M22 6L12 13 2 6M2 4h20v16H2z" },
  ];


  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#0a0a0a] text-[#e5e0d8] overflow-hidden flex flex-col justify-end pb-10"
    >
      {/* Mouse-tracking glow */}
      <div
        className="absolute rounded-full pointer-events-none z-0"
        style={{
          width: "700px",
          height: "450px",
          background: "radial-gradient(ellipse, rgba(234,88,12,0.2) 0%, rgba(234,88,12,0.05) 50%, transparent 70%)",
          filter: "blur(70px)",

          // Position using CSS variables and transform
          left: 0,
          top: 0,
          transform: "translate(calc(var(--mouse-x) - 50%), calc(var(--mouse-y) - 50%))",

          // Only transition the appearance, not the movement
          opacity: glowVisible ? 1 : 0,
          transition: "opacity 0.8s ease",
          willChange: "transform",
        }}
      />

      {/* Ambient bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 pointer-events-none z-0"
        style={{
          width: "800px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(234,88,12,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          transform: "translateX(-50%)",
        }}
      />

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pt-1">
        <div>
          {/* Title */}
          <h1
            style={{
              fontSize: "20rem",
              fontWeight: "bold",
              display: "flex",
              gap: "0.1rem",
            }}
          >
            {/* First E - white */}
            <span
              style={{
                color: "rgb(230, 230, 230)",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              E
            </span>

            {/* V - low opacity */}
            <span
              style={{
                color: "rgba(255, 102, 0, 0.2)",
                WebkitTextStroke: "1.5px rgb(255, 137, 19)",
                fontFamily: "sans-serif",
              }}
            >
              v
            </span>

            {/* OLV - gradient */}
            <span
              style={{
                background:
                  "linear-gradient(to bottom, #f5b23a, #e4871a, #c86a0f, #9c4e0a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              olv
            </span>

            {/* Last E - low opacity */}
            <span
              style={{
                color: "rgba(255, 102, 0, 0.2)",
                WebkitTextStroke: "1.5px rgb(255, 137, 19)",
                fontFamily: "sans-serif",
              }}
            >
              e
            </span>
          </h1>
        </div>



        {/* Links Grid */}
        <div ref={gridRef} className="relative grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 mb-0">
          {linkGroups.map((group, idx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 40 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 overflow-hidden">
                <h3 className="text-[13px] font-bold tracking-[0.2em] text-[#f97316]">{group.title}</h3>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={gridInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.12 + 0.3, ease: "easeOut" }}
                  className="h-px bg-[#f97316]/30 mt-2 origin-left"
                />
              </div>

              <ul className="space-y-4">
                {group.links.map((link, linkIdx) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={gridInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: idx * 0.12 + linkIdx * 0.07 + 0.2 }}
                  >
                    <Link
                      to={link.href}
                      onMouseEnter={() => setHoveredLink(`${idx}-${linkIdx}`)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`group flex items-center text-sm md:text-base transition-colors duration-300 hover:text-white ${link.active ? "text-[#f97316]" : "text-gray-400"}`}
                    >
                      <motion.span
                        animate={{
                          opacity: link.active || hoveredLink === `${idx}-${linkIdx}` ? 1 : 0,
                          x: link.active || hoveredLink === `${idx}-${linkIdx}` ? 0 : -8,
                        }}
                        transition={{ duration: 0.2 }}
                        className={`mr-2 text-xs ${link.active ? "text-[#f97316]" : "text-white"}`}
                      >
                        →
                      </motion.span>
                      <span className="relative">
                        {link.name}
                        <motion.span
                          className="absolute bottom-0 left-0 h-px bg-white/40 w-full origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: hoveredLink === `${idx}-${linkIdx}` ? 1 : 0 }}
                          transition={{ duration: 0.25 }}
                        />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>


        {/* Bottom Bar */}
        <div ref={bottomRef} className="flex flex-col md:flex-row justify-between items-center pt-8">

          {/* Social Links */}
          <div className="flex-1 flex justify-start gap-4 md:gap-5">
            {socialLinks.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                onClick={(e) => e.preventDefault()}
                initial={{ opacity: 0, y: 20 }}
                animate={bottomInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-[#ea580c] text-[#ea580c] transition-colors duration-300 hover:bg-[#ea580c] hover:text-white shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)]"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={social.icon} />
                </svg>
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="md:flex-1 flex justify-center md:justify-end">
            <p className="text-white/20 uppercase font-medium">
              © {currentYear} Evolve. All rights reserved.
            </p>
          </div>


          <div className="md:flex-1 flex justify-center md:justify-end mt-4 md:mt-0">
            <p className="text-white/40 font-medium">Proudly Made IN</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;