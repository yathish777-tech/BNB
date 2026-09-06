import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Instagram,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { fetchLatestInstagramMedia } from "../../lib/api";
import type { InstagramMedia } from "../../lib/api";

const glassSurface = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.10)",
} as const;

// ─── Format Timestamp ─────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

// ─── Instagram Reel Card (9:16 Playable Video) ─────────────────────────────────

function ReelCard({ item, index }: { item: InstagramMedia; index: number }) {
  const handlePlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const currentVideo = e.currentTarget;
    document.querySelectorAll("video").forEach((video) => {
      if (video !== currentVideo && !video.paused) {
        video.pause();
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.35) }}
      className="flex-shrink-0 relative group rounded-[2px] overflow-hidden bg-black"
      style={{
        ...glassSurface,
        width: "clamp(260px, 22vw, 310px)",
        height: "clamp(460px, 38vw, 540px)",
      }}
    >
      {/* Native Video Element */}
      <video
        src={item.media_url}
        poster={item.thumbnail_url}
        controls
        playsInline
        preload="metadata"
        onPlay={handlePlay}
        className="w-full h-full object-contain"
      />

      {/* Top Bar: Badge & External Link */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#050505] bg-[#FFD900] rounded-[2px] shadow-sm pointer-events-auto">
          <Film size={11} /> Reel
        </span>

        <a
          href={item.permalink}
          target="_blank"
          rel="noopener noreferrer"
          title="View Reel on Instagram"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:text-[#FFD900] backdrop-blur-md border border-white/10 transition-colors pointer-events-auto"
        >
          <Instagram size={13} />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Instagram Post / Carousel Card ───────────────────────────────────────────

function PostCard({ item, index }: { item: InstagramMedia; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.35) }}
      className="flex-shrink-0 relative group select-none rounded-[2px] overflow-hidden bg-black"
      style={{
        ...glassSurface,
        width: "clamp(260px, 22vw, 310px)",
        height: "clamp(460px, 38vw, 540px)",
      }}
    >
      {/* Image Element */}
      <img
        src={item.media_url || item.thumbnail_url}
        alt={item.caption || "B&B Event Planners Instagram Post"}
        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
      />

      {/* Subtle Top & Bottom Gradient Shadows */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/60 via-transparent to-black/85" />

      {/* Top Bar: Badge & External Link */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-white bg-white/15 backdrop-blur-md border border-white/10 rounded-[2px] shadow-sm">
          <ImageIcon size={11} /> {item.media_type === "CAROUSEL_ALBUM" ? "Carousel" : "Post"}
        </span>

        <a
          href={item.permalink}
          target="_blank"
          rel="noopener noreferrer"
          title="View on Instagram"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:text-[#FFD900] backdrop-blur-md border border-white/10 transition-colors"
        >
          <Instagram size={13} />
        </a>
      </div>

      {/* Bottom Info Bar: Caption & Link */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[#FFD900] text-[10px] font-bold tracking-widest uppercase">
            #{String(index + 1).padStart(2, "0")}
          </span>
          {item.timestamp && (
            <>
              <span className="text-white/30 text-[10px]">•</span>
              <span className="text-[#A0A0A0] text-[10px] tracking-wide">
                {formatRelativeTime(item.timestamp)}
              </span>
            </>
          )}
        </div>

        {item.caption && (
          <p className="text-white text-xs leading-snug line-clamp-3 font-normal mb-2.5 drop-shadow">
            {item.caption}
          </p>
        )}

        <a
          href={item.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] text-[#FFD900] font-medium tracking-wide hover:underline"
        >
          View on Instagram <ExternalLink size={11} />
        </a>
      </div>
    </motion.div>
  );
}

// ─── Main Instagram Section Component ─────────────────────────────────────────

export default function InstagramSection() {
  const [mediaList, setMediaList] = useState<InstagramMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch Instagram Media
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchLatestInstagramMedia()
      .then((items) => {
        if (isMounted) {
          if (items && items.length > 0) {
            setMediaList(items.slice(0, 10));
          } else {
            setError("Instagram updates are currently unavailable.");
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Instagram updates are currently unavailable.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update slider arrow state on scroll
  const checkScrollPosition = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollPosition();
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScrollPosition, { passive: true });
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      el.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [mediaList]);

  // Scroll Actions
  const handleScroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = Math.max(300, sliderRef.current.clientWidth * 0.75);
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="instagram" className="py-24 px-6 md:px-16 max-w-7xl mx-auto overflow-hidden">
      {/* ── Section Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#FFD900]" />
            <span className="text-[#FFD900] text-[11px] tracking-[0.35em] uppercase font-medium">
              Latest From Our Instagram
            </span>
          </div>

          <h2
            className="text-[clamp(2rem,5vw,3.6rem)] font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Moments in Motion<br />
            <em className="text-[#A0A0A0] font-light not-italic">&amp; Celebrations</em>
          </h2>

          <p className="text-[#A0A0A0] text-sm md:text-[15px] mt-4 max-w-xl leading-relaxed">
            Discover our latest events, celebrations and unforgettable moments posted straight from our feed.
          </p>
        </motion.div>

        {/* Right Action: Follow Button & Navigation Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.1 }}
          className="flex items-center gap-4 flex-wrap"
        >
          {/* Follow Instagram Button */}
          <a
            href="https://www.instagram.com/bnbeventplanners/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
          >
            <Instagram size={15} />
            @bnbeventplanners <ExternalLink size={13} />
          </a>

          {/* Slider Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Previous posts"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFD900] hover:text-[#050505]"
              style={{
                ...glassSurface,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Next posts"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFD900] hover:text-[#050505]"
              style={{
                ...glassSurface,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Loading Skeleton State ── */}
      {loading && (
        <div className="flex gap-5 overflow-hidden py-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="flex-shrink-0 animate-pulse rounded-[2px]"
              style={{
                ...glassSurface,
                width: "clamp(260px, 22vw, 310px)",
                height: "clamp(460px, 38vw, 540px)",
              }}
            >
              <div className="w-full h-full bg-white/[0.02]" />
            </div>
          ))}
        </div>
      )}

      {/* ── Error / Fallback State ── */}
      {!loading && error && mediaList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 text-center rounded-[2px]"
          style={{
            ...glassSurface,
            border: "1px dashed rgba(255,217,0,0.25)",
          }}
        >
          <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 bg-[#FFD900]/10 text-[#FFD900]">
            <Instagram size={24} />
          </div>
          <p className="text-white text-sm font-medium mb-1">{error}</p>
          <p className="text-[#A0A0A0] text-xs mb-5">
            Visit our official profile to view our latest reels and photo updates directly on Instagram.
          </p>
          <a
            href="https://www.instagram.com/bnbeventplanners/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] transition-all duration-300"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
          >
            Visit @bnbeventplanners <ExternalLink size={13} />
          </a>
        </motion.div>
      )}

      {/* ── Horizontal Reels & Posts Slider (FIFO Order: Newest First) ── */}
      {!loading && mediaList.length > 0 && (
        <div className="relative -mx-6 px-6">
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto py-2 scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {mediaList.map((item, index) =>
              item.media_type === "VIDEO" ? (
                <ReelCard key={item.id || index} item={item} index={index} />
              ) : (
                <PostCard key={item.id || index} item={item} index={index} />
              )
            )}
          </div>

          {/* Swipe / Navigation Hint */}
          <div className="flex items-center justify-between gap-4 mt-6 text-[#A0A0A0]/50 text-[10px] tracking-[0.25em] uppercase">
            <span className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#FFD900]/60" /> Showing latest {mediaList.length} updates
            </span>
            <span>Drag / Scroll ↔ to browse</span>
          </div>
        </div>
      )}
    </section>
  );
}

