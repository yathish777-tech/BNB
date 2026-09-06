import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronUp, Image as ImageIcon, X } from "lucide-react";
import bnbEmblemImg from "@/imports/bnb-emblem.png";
import bnbWordmarkImg from "@/imports/bnb-wordmark.png";
import { SERVICES } from "./serviceData";
import type { GalleryImage } from "./serviceData";
import { fetchCategoryImages, getFullImageUrl } from "../../lib/api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const glassSurface = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.10)",
} as const;

interface WhatWeDoSectionProps {
  scrollY: number;
}

// ─── "No images" placeholder ──────────────────────────────────────────────────

function NoImagesPlaceholder({ title }: { title: string }) {
  return (
    <div
      className="relative overflow-hidden w-full flex flex-col items-center justify-center"
      style={{
        height: "clamp(240px, 36vw, 440px)",
        borderRadius: "2px",
        background: "rgba(255,255,255,0.03)",
        border: "1px dashed rgba(255,217,0,0.25)",
      }}
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: "rgba(255,217,0,0.08)" }}>
        <ImageIcon size={28} className="text-[#FFD900]/40" />
      </div>
      <p className="text-[#A0A0A0] text-sm tracking-wide">
        No images uploaded yet for <span className="text-white font-medium">{title}</span>
      </p>
      <p className="text-[#A0A0A0]/50 text-xs mt-2 tracking-wider">
        Upload images via the Admin Panel
      </p>
    </div>
  );
}

// ─── Infinite Slider Row (Left-to-Right Continuous Sliding) ───────────────────

function InfiniteSliderRow({
  images,
  speedSeconds = 35,
  rowHeight,
  onImageClick,
}: {
  images: GalleryImage[];
  speedSeconds?: number;
  rowHeight: string;
  onImageClick?: (img: GalleryImage) => void;
}) {
  const widths = ["380px", "280px", "440px", "320px", "500px", "260px"];

  // Ensure enough items in base set to guarantee smooth looping across all viewport widths
  const baseItems: GalleryImage[] = [];
  if (images.length > 0) {
    while (baseItems.length < Math.max(6, images.length * 2)) {
      baseItems.push(...images);
    }
  }

  return (
    <div className="relative overflow-hidden py-1 w-full group/slider">
      {/* Edge gradient fades for seamless appearance */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-20 z-10 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-20 z-10 bg-gradient-to-l from-[#050505] to-transparent" />

      <div
        className="animate-infinite-ltr group-hover/slider:[animation-play-state:paused]"
        style={{
          "--slide-speed": `${speedSeconds}s`,
          animationDuration: `${speedSeconds}s`,
        } as React.CSSProperties}
      >
        {/* Set 1 */}
        <div className="flex gap-4 pr-4">
          {baseItems.map((img, i) => (
            <div
              key={`set1-${i}`}
              onClick={() => onImageClick?.(img)}
              className="flex-shrink-0 relative overflow-hidden group cursor-pointer"
              style={{
                width: widths[i % widths.length],
                height: rowHeight,
                borderRadius: "2px",
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
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(5,5,5,0.78) 0%, transparent 55%)" }}
              />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-px w-6 bg-[#FFD900] mb-1.5" />
                <p className="text-white text-xs font-medium leading-tight">{img.title}</p>
                <p className="text-[#FFD900] text-[10px] tracking-widest mt-0.5">{img.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Set 2 (Identical duplicate for seamless infinite loop) */}
        <div className="flex gap-4 pr-4" aria-hidden="true">
          {baseItems.map((img, i) => (
            <div
              key={`set2-${i}`}
              onClick={() => onImageClick?.(img)}
              className="flex-shrink-0 relative overflow-hidden group cursor-pointer"
              style={{
                width: widths[i % widths.length],
                height: rowHeight,
                borderRadius: "2px",
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
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(5,5,5,0.78) 0%, transparent 55%)" }}
              />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-px w-6 bg-[#FFD900] mb-1.5" />
                <p className="text-white text-xs font-medium leading-tight">{img.title}</p>
                <p className="text-[#FFD900] text-[10px] tracking-widest mt-0.5">{img.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WhatWeDoSection({ scrollY }: WhatWeDoSectionProps) {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Images fetched from the Flask API (admin-uploaded images)
  const [categoryImagesMap, setCategoryImagesMap] = useState<Record<string, GalleryImage[]>>({});
  const [loadingImages, setLoadingImages] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const sectionOffsetTop = useRef(0);

  // Measure section position for parallax
  useEffect(() => {
    const measure = () => {
      if (sectionRef.current) {
        sectionOffsetTop.current = sectionRef.current.offsetTop;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Fetch images for the active category from the API
  useEffect(() => {
    const slug = makeSlug(activeId);

    // Already fetched this category
    if (categoryImagesMap[activeId]) return;

    setLoadingImages(true);
    fetchCategoryImages(slug)
      .then((apiImages) => {
        const galleryImages: GalleryImage[] = apiImages.map((img) => ({
          url: getFullImageUrl(img.image_url),
          title: img.title || activeId,
          category: activeId,
        }));
        setCategoryImagesMap((prev) => ({ ...prev, [activeId]: galleryImages }));
      })
      .catch(() => {
        setCategoryImagesMap((prev) => ({ ...prev, [activeId]: [] }));
      })
      .finally(() => setLoadingImages(false));
  }, [activeId]);

  const activeService = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];
  const activeIndex = SERVICES.findIndex((s) => s.id === activeId);

  // Get images for the active category (from API)
  const galleryImages = categoryImagesMap[activeId] ?? [];
  const hasImages = galleryImages.length > 0;
  const featuredImage = hasImages ? galleryImages[0] : null;

  // Parallax direction multiplier: ltr = positive, rtl = negative
  const dirMult = activeService.direction === "ltr" ? 1 : -1;

  const handleCategoryChange = (id: string) => {
    if (id === activeId) return;
    setIsOpen(false);
    // Small delay so gallery collapses before content transitions
    setTimeout(() => setActiveId(id), 80);
  };

  return (
    <section ref={sectionRef} id="what-we-do" className="bg-[#050505] pt-24 pb-16 overflow-x-hidden">
      <div className="px-6 md:px-16 max-w-7xl mx-auto">

        {/* ── Section Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-[#FFD900]" />
            <span className="text-[#FFD900] text-[11px] tracking-[0.35em] uppercase">What We Do</span>
          </div>
          <h2
            className="text-[clamp(2rem,5vw,3.8rem)] font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Creating Extraordinary
            <br />
            <em className="text-[#A0A0A0] font-light not-italic">Celebrations</em>
          </h2>
          <p className="text-[#A0A0A0]/60 text-[11px] tracking-[0.25em] uppercase mt-5">
            Select a category to explore
          </p>
        </motion.div>

        {/* ── Category Selector — Mobile (horizontal scroll) ── */}
        <div
          className="md:hidden overflow-x-auto pb-4 mb-10 -mx-6 px-6 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-5 w-max">
            {SERVICES.map((svc, i) => {
              const isActive = svc.id === activeId;
              return (
                <button
                  key={svc.id}
                  onClick={() => handleCategoryChange(svc.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 transition-all duration-300"
                  style={{
                    paddingBottom: "6px",
                    borderBottom: isActive ? "1px solid #FFD900" : "1px solid transparent",
                  }}
                >
                  <span
                    className="text-[10px] font-bold"
                    style={{
                      color: "#FFD900",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-xs tracking-wide whitespace-nowrap transition-colors duration-300"
                    style={{ color: isActive ? "#ffffff" : "#A0A0A0" }}
                  >
                    {svc.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Category Selector — Desktop (4-column grid) ── */}
        <div
          className="hidden md:grid grid-cols-4 gap-x-6 gap-y-2 mb-14 pb-10"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {SERVICES.map((svc, i) => {
            const isActive = svc.id === activeId;
            return (
              <button
                key={svc.id}
                onClick={() => handleCategoryChange(svc.id)}
                className="flex items-center gap-2 text-left py-1.5 group transition-all duration-300"
                style={{
                  paddingLeft: "8px",
                  borderLeft: isActive ? "2px solid #FFD900" : "2px solid transparent",
                }}
              >
                <span
                  className="text-[10px] font-bold flex-shrink-0"
                  style={{ color: "#FFD900", fontFamily: "'Playfair Display', serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[13px] tracking-wide transition-colors duration-300 group-hover:text-white"
                  style={{ color: isActive ? "#ffffff" : "#A0A0A0" }}
                >
                  {svc.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Active Category Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Category identity */}
            <div className="mb-7">
              <span
                className="text-[#FFD900] text-sm font-bold block mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <h3
                className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-none tracking-tight text-white uppercase mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {activeService.title}
              </h3>
              <p className="text-[#A0A0A0] text-[15px] leading-relaxed max-w-lg">
                {activeService.description}
              </p>
            </div>

            {/* Loading state */}
            {loadingImages && !categoryImagesMap[activeId] && (
              <div className="flex items-center gap-3 mb-7">
                <div className="w-4 h-4 border-2 border-[#FFD900]/30 border-t-[#FFD900] rounded-full animate-spin" />
                <span className="text-[#A0A0A0] text-sm">Loading images...</span>
              </div>
            )}

            {/* Featured image OR no-images placeholder + Right Emblem (visible when gallery closed) */}
            <AnimatePresence mode="wait">
              {!isOpen && !loadingImages && (
                <motion.div
                  key="featured"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Featured Image OR No-Images Placeholder */}
                    <div className="lg:col-span-7 xl:col-span-8">
                      {hasImages && featuredImage ? (
                        <div
                          className="relative overflow-hidden w-full"
                          style={{
                            height: "clamp(240px, 36vw, 440px)",
                            borderRadius: "2px",
                          }}
                        >
                          <img
                            src={featuredImage.url}
                            alt={featuredImage.title}
                            className="w-full h-full object-cover"
                            style={{ borderRadius: "2px" }}
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background: "linear-gradient(to top, rgba(5,5,5,0.6) 0%, transparent 55%)",
                            }}
                          />
                          {/* Gold corner accents */}
                          <div className="absolute top-0 left-0 w-10 h-px bg-[#FFD900]" />
                          <div className="absolute top-0 left-0 h-10 w-px bg-[#FFD900]" />
                          <div className="absolute top-0 right-0 w-10 h-px bg-[#FFD900]" />
                          <div className="absolute top-0 right-0 h-10 w-px bg-[#FFD900]" />
                          {/* Category label bottom */}
                          <div className="absolute bottom-5 left-5">
                            <div className="h-px w-8 bg-[#FFD900] mb-2" />
                            <p className="text-white text-sm font-medium">{featuredImage.title}</p>
                          </div>
                        </div>
                      ) : (
                        <NoImagesPlaceholder title={activeService.title} />
                      )}
                    </div>

                    {/* Right Column: B&B Event Planners Ornate Emblem & Wordmark Logo */}
                    <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center py-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex flex-col items-center justify-center text-center"
                      >
                        {/* Golden backlight glow */}
                        <div
                          className="absolute w-72 h-72 rounded-full pointer-events-none"
                          style={{
                            background: "radial-gradient(circle, rgba(255,217,0,0.15) 0%, rgba(255,217,0,0.02) 50%, transparent 70%)",
                            filter: "blur(24px)",
                          }}
                        />
                        {/* Floating Emblem */}
                        <motion.img
                          src={bnbEmblemImg}
                          alt="B&B Event Planners Emblem"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                          className="relative z-10 w-[clamp(190px,20vw,290px)] h-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
                        />
                        {/* Balloonz & Bouquetz Wordmark Logo */}
                        <motion.img
                          src={bnbWordmarkImg}
                          alt="Balloonz & Bouquetz Event Planners"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 4.5, delay: 0.3, ease: "easeInOut" }}
                          className="relative z-10 mt-3 w-[clamp(210px,22vw,320px)] h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Horizontal Parallax Gallery (visible when open) */}
            <AnimatePresence>
              {isOpen && hasImages && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, height: 0, clipPath: "inset(0 0 100% 0)" }}
                  animate={{ opacity: 1, height: "auto", clipPath: "inset(0 0 0% 0)" }}
                  exit={{ opacity: 0, height: 0, clipPath: "inset(0 0 100% 0)" }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-7 overflow-hidden"
                >
                  <div className="space-y-4 py-2">
                    {galleryImages.length <= 3 ? (
                      /* Single row for 1 to 3 images: infinite left-to-right sliding */
                      <InfiniteSliderRow
                        images={galleryImages}
                        speedSeconds={32}
                        rowHeight="clamp(220px, 28vw, 340px)"
                        onImageClick={setSelectedImage}
                      />
                    ) : (
                      /* Two rows for 4+ images: both continuously sliding left to right */
                      <div className="space-y-4">
                        <InfiniteSliderRow
                          images={galleryImages.slice(0, Math.ceil(galleryImages.length / 2))}
                          speedSeconds={36}
                          rowHeight="clamp(200px, 26vw, 300px)"
                          onImageClick={setSelectedImage}
                        />
                        <InfiniteSliderRow
                          images={galleryImages.slice(Math.ceil(galleryImages.length / 2))}
                          speedSeconds={44}
                          rowHeight="clamp(170px, 22vw, 240px)"
                          onImageClick={setSelectedImage}
                        />
                      </div>
                    )}
                  </div>

                  {/* Infinite Sliding Hint */}
                  <div className="flex items-center gap-3 mt-5">
                    <div className="h-px flex-1 bg-gradient-to-r from-[#FFD900]/20 to-transparent" />
                    <span className="text-[#A0A0A0]/60 text-[10px] tracking-[0.25em] uppercase">
                      Infinite Sliding · Left to Right · Hover to Pause
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-[#FFD900]/20 to-transparent" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* View Works / Hide Works — only show if there are images */}
            {hasImages && (
              <div>
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
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
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
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Lightbox Modal for Full View ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden"
              style={{ ...glassSurface, borderRadius: "2px", border: "1px solid rgba(255,217,0,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
              <div className="p-4 bg-[#050505]/95 flex items-center justify-between border-t border-white/10">
                <div>
                  <p className="text-white font-semibold text-sm">{selectedImage.title}</p>
                  <p className="text-[#FFD900] text-xs mt-0.5">{selectedImage.category}</p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-3.5 py-1.5 transition-colors"
                  style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
                >
                  <X size={13} /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
