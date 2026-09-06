import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronUp } from "lucide-react";
import type { GalleryImage, ServiceConfig } from "./serviceData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceSectionProps {
  index: number;
  config: ServiceConfig;
  images: GalleryImage[];
  scrollY: number;
}

// ─── Glassmorphism helpers ────────────────────────────────────────────────────

const glassSurface = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.10)",
} as const;

// ─── ServiceSection ───────────────────────────────────────────────────────────

export default function ServiceSection({
  index,
  config,
  images,
  scrollY,
}: ServiceSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const offsetTop = useRef(0);

  // Track this section's offsetTop once it mounts
  useEffect(() => {
    const measure = () => {
      if (sectionRef.current) {
        offsetTop.current = sectionRef.current.offsetTop;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Build image list: at least use placeholder if no admin images exist
  const galleryImages: GalleryImage[] =
    images.length > 0
      ? images
      : [{ url: config.placeholder, title: config.title, category: config.id }];

  const featuredImage = galleryImages[0];

  // Horizontal parallax translation — relative to this section's scroll position
  const getParallaxX = () => {
    const delta = scrollY - offsetTop.current + 400;
    const travel = delta * 0.16;
    return config.direction === "ltr" ? `${travel}px` : `${-travel}px`;
  };

  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      className="py-28 px-6 md:px-16 max-w-7xl mx-auto"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Number + Title */}
        <div className="mb-8">
          <span
            className="block text-[#FFD900] text-sm font-bold tracking-[0.3em] mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {indexLabel}
          </span>
          <h3
            className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-none tracking-tight uppercase text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {config.title}
          </h3>
          {config.description && (
            <p className="text-[#A0A0A0] text-[15px] leading-relaxed mt-4 max-w-lg">
              {config.description}
            </p>
          )}
        </div>

        {/* ── Featured Image (always visible) ── */}
        <motion.div
          className="relative overflow-hidden"
          style={{
            maxWidth: "720px",
            height: "clamp(280px, 40vw, 480px)",
            borderRadius: "2px",
          }}
          animate={isOpen ? { scale: 0.97, opacity: 0.85 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={featuredImage.url}
            alt={featuredImage.title}
            className="w-full h-full object-cover"
            style={{ borderRadius: "2px" }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,5,5,0.65) 0%, transparent 55%)",
              borderRadius: "2px",
            }}
          />
          {/* Gold corner accents */}
          <div className="absolute top-0 left-0 w-10 h-px bg-[#FFD900]" />
          <div className="absolute top-0 left-0 h-10 w-px bg-[#FFD900]" />
          <div className="absolute top-0 right-0 w-10 h-px bg-[#FFD900]" />
          <div className="absolute top-0 right-0 h-10 w-px bg-[#FFD900]" />
        </motion.div>

        {/* ── View Works / Hide Works button ── */}
        <div className="mt-7">
          {!isOpen ? (
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.02 }}
              className="group inline-flex items-center gap-2.5 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] text-sm font-semibold tracking-wide px-7 py-3.5 transition-all duration-300"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            >
              View Works
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="group inline-flex items-center gap-2.5 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] text-sm font-semibold tracking-wide px-7 py-3.5 transition-all duration-300"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            >
              <ChevronUp
                size={14}
                className="group-hover:-translate-y-0.5 transition-transform duration-300"
              />
              Hide Works
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ── Expanded Gallery — Horizontal Parallax ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, height: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{
              opacity: 1,
              height: "auto",
              clipPath: "inset(0 0 0% 0)",
            }}
            exit={{
              opacity: 0,
              height: 0,
              clipPath: "inset(0 0 100% 0)",
            }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 overflow-hidden"
          >
            {/* Parallax strip */}
            <div
              className="flex gap-4 pb-2"
              style={{
                transform: `translateX(${getParallaxX()})`,
                willChange: "transform",
                // Wide enough so images overflow; parent clips them
              }}
            >
              {/* Duplicate images for a seamless-feeling strip */}
              {[...galleryImages, ...galleryImages].map((img, i) => {
                // Alternating widths for editorial feel
                const widths = ["380px", "280px", "440px", "320px", "500px"];
                const w = widths[i % widths.length];
                return (
                  <motion.div
                    key={i}
                    className="relative flex-shrink-0 overflow-hidden group cursor-pointer"
                    style={{
                      width: w,
                      height: "clamp(220px, 28vw, 380px)",
                      borderRadius: "2px",
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: Math.min(i * 0.06, 0.4),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ borderRadius: "2px" }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(5,5,5,0.78) 0%, transparent 55%)",
                      }}
                    />
                    {/* Hover label */}
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="h-px w-8 bg-[#FFD900] mb-2" />
                      <p className="text-white text-sm font-medium leading-tight">
                        {img.title}
                      </p>
                      <p className="text-[#FFD900] text-[11px] tracking-widest mt-0.5">
                        {img.category}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Direction hint */}
            <div className="flex items-center gap-3 mt-6">
              <div className="h-px flex-1 bg-gradient-to-r from-[#FFD900]/20 to-transparent" />
              <span className="text-[#A0A0A0] text-[10px] tracking-[0.3em] uppercase">
                {config.direction === "ltr" ? "Scroll ↓ to move →" : "Scroll ↓ to move ←"}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#FFD900]/20 to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

