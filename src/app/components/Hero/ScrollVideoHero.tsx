import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, ArrowRight } from "lucide-react";

const SCRUB_START_SECONDS = 0.09;
const SCRUB_EASE = 0.12;
const SEEK_EPSILON_SECONDS = 0.025;

export default function ScrollVideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container || !isReady) return;

    let rafId = 0;
    let targetTime = Math.min(SCRUB_START_SECONDS, Math.max(video.duration - 0.25, 0));
    let smoothTime = targetTime;
    let isSeeking = false;

    const updateTargetTime = () => {
      const rect = container.getBoundingClientRect();
      const trackHeight = container.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = trackHeight > 0 ? Math.min(scrolled / trackHeight, 1) : 0;
      const startTime = Math.min(SCRUB_START_SECONDS, Math.max(video.duration - 0.25, 0));
      const endTime = Math.max(video.duration - 0.1, startTime);
      targetTime = startTime + progress * (endTime - startTime);
    };

    const animateScrub = () => {
      updateTargetTime();

      if (Number.isFinite(targetTime)) {
        smoothTime += (targetTime - smoothTime) * SCRUB_EASE;

        if (!isSeeking && Math.abs(video.currentTime - smoothTime) > SEEK_EPSILON_SECONDS) {
          isSeeking = true;
          video.currentTime = smoothTime;
        }
      }

      rafId = requestAnimationFrame(animateScrub);
    };

    const onScrollOrResize = () => {
      updateTargetTime();
    };

    video.pause();
    video.currentTime = targetTime;
    updateTargetTime();
    rafId = requestAnimationFrame(animateScrub);

    const onSeeked = () => {
      isSeeking = false;
    };

    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [isReady]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section id="home" ref={containerRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src="/videos/bnb-event-animation.mp4"
          className="absolute inset-0 z-10 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            video.currentTime = Math.min(SCRUB_START_SECONDS, Math.max(video.duration - 0.25, 0));
          }}
          onCanPlay={(event) => {
            event.currentTarget.pause();
            setIsReady(true);
          }}
          onLoadedData={(event) => {
            event.currentTarget.pause();
            setIsReady(true);
          }}
          onError={() => setHasError(true)}
          style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.7s ease" }}
        />

        {!isReady && !hasError && (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-black">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FFD900]/20 border-t-[#FFD900]" />
            <p className="mt-4 text-xs uppercase tracking-widest text-[#FFD900]">Loading Experience</p>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-black px-6 text-center">
            <p className="text-sm text-red-400">Could not load video. Check the MP4 path or codec.</p>
            <p className="mt-2 text-xs text-[#A0A0A0]">/videos/bnb-event-animation.mp4</p>
          </div>
        )}

        <div
          className="absolute inset-0 z-20"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.12) 42%, rgba(5,5,5,0.9) 100%)",
          }}
        />

        <motion.div
          style={{ opacity: textOpacity }}
          className="pointer-events-none absolute inset-0 z-30 mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-24 md:px-16"
        >
          <div className="mb-7 flex items-center gap-3">
            <div className="h-px w-10 bg-[#FFD900]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#FFD900]">
              Premium Event Planners
            </span>
          </div>

          <h1
            className="mb-5 text-[clamp(2.8rem,8vw,6rem)] font-bold leading-[1.02] text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We Turn Moments<br />
            <span className="text-[#FFD900]">Into Beautiful</span><br />
            Memories
          </h1>

          <p className="mb-3 max-w-xl text-base leading-relaxed text-[#A0A0A0] md:text-lg">
            Premium Event Planning &amp; Decoration Services in{" "}
            <span className="text-white">Hosur, Bangalore, Krishnagiri &amp; Dharmapuri</span>.
          </p>
          <p className="mb-10 text-[12px] uppercase tracking-[0.25em] text-[#FFD900]/70">
            Creating Beautiful Memories is our Business
          </p>

          <div className="pointer-events-auto flex flex-col items-start gap-4 sm:flex-row">
            <a
              href="#what-we-do"
              className="group flex items-center gap-3 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#FFD900] hover:text-[#050505]"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.10)",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
              }}
            >
              EXPLORE OUR WORK
              <ChevronDown size={15} className="transition-transform duration-300 group-hover:translate-y-1" />
            </a>
            <a
              href="#make-an-enquiry"
              className="flex items-center gap-2 bg-[#FFD900] px-6 py-3 text-sm font-semibold tracking-wide text-[#050505] transition-all duration-300 hover:bg-[#E5B800]"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            >
              Make an Enquiry <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-20 right-8 z-30 hidden flex-col items-center gap-2 md:flex"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="text-[10px] tracking-[0.25em] text-[#A0A0A0]"
            style={{ writingMode: "vertical-rl" }}
          >
            SCROLL TO EXPLORE
          </motion.span>
          <div className="mt-2 h-12 w-px bg-gradient-to-b from-[#FFD900] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
