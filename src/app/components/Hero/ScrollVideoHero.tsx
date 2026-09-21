import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function ScrollVideoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [videoState, setVideoState] = useState({
    status: "Loading...",
    duration: 0,
    width: 0,
    height: 0,
    error: ""
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const debugTimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      const video = videoRef.current;
      const container = containerRef.current;
      if (!container || !video) return;
      
      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const scrollY = window.scrollY;
      const scrolled = scrollY - containerTop;
      const scrollTrackHeight = containerHeight - windowHeight;
      
      let progress = scrollTrackHeight > 0 ? scrolled / scrollTrackHeight : 0;
      progress = Math.max(0, Math.min(1, progress));
      
      if (video.readyState >= 1 && Number.isFinite(video.duration) && video.duration > 0) {
        // Smoothly update video current time based on scroll progress
        video.currentTime = progress * video.duration;
        
        // Update debug text without triggering React renders
        if (debugTimeRef.current) {
          debugTimeRef.current.innerText = `Time: ${video.currentTime.toFixed(2)}s / ${video.duration.toFixed(2)}s (Prog: ${(progress * 100).toFixed(1)}%)`;
        }
      }
    };

    const loop = () => {
      handleScroll();
      rafId = requestAnimationFrame(loop);
    };

    // Start tracking scroll immediately
    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setVideoState(prev => ({
        ...prev,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        status: "Metadata Loaded"
      }));
    }
  };

  const handleLoadedData = () => {
    setVideoState(prev => ({ ...prev, status: "Data Loaded" }));
  };

  const handleCanPlay = () => {
    const video = videoRef.current;
    if (video) {
      // Force frame decode for some browsers that show black screen until played
      video.play().then(() => {
        video.pause();
      }).catch(() => {});
      
      setVideoState(prev => ({
        ...prev,
        status: `Ready — ${video.videoWidth} × ${video.videoHeight} — ${video.duration.toFixed(1)}s`
      }));
      setIsLoaded(true);
    }
  };

  const handleError = () => {
    const video = videoRef.current;
    if (video && video.error) {
      setVideoState(prev => ({
        ...prev,
        status: "ERROR — unable to load MP4",
        error: `${video.error.code}: ${video.error.message}`
      }));
    } else {
      setVideoState(prev => ({
        ...prev,
        status: "ERROR — unable to load MP4"
      }));
    }
  };

  return (
    <section id="home" ref={containerRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Loading Spinner */}
        {!isLoaded && (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-black">
            <div className="w-12 h-12 border-4 border-[#FFD900]/20 border-t-[#FFD900] rounded-full animate-spin" />
            <p className="text-[#FFD900] mt-4 tracking-widest text-xs uppercase">Loading Experience</p>
          </div>
        )}

        {/* Video Background */}
        <video
          ref={videoRef}
          src="/videos/bnb-event-animation.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 z-10 w-full h-full object-cover"
          onLoadedMetadata={handleLoadedMetadata}
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onError={handleError}
          style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 z-20" style={{ background: "linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.1) 40%, rgba(5,5,5,0.85) 100%)" }} />

        {/* Text */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="absolute inset-0 z-30 flex flex-col justify-end pb-24 px-6 md:px-16 max-w-7xl mx-auto w-full pointer-events-none"
        >
          <div className="flex items-center gap-3 mb-7 pointer-events-auto">
            <div className="h-px w-10 bg-[#FFD900]" />
            <span className="text-[#FFD900] text-[11px] tracking-[0.35em] font-medium uppercase">Premium Event Planners</span>
          </div>

          <h1
            className="text-[clamp(2.8rem,8vw,6rem)] font-bold leading-[1.02] mb-5 text-white pointer-events-auto"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            We Turn Moments<br />
            <span className="text-[#FFD900]">Into Beautiful</span><br />
            Memories
          </h1>

          <p className="text-[#A0A0A0] text-base md:text-lg max-w-xl mb-3 leading-relaxed pointer-events-auto">
            Premium Event Planning & Decoration Services in{" "}
            <span className="text-white">Hosur, Bangalore, Krishnagiri & Dharmapuri</span>.
          </p>
          <p className="text-[#FFD900]/70 text-[12px] tracking-[0.25em] uppercase mb-10 pointer-events-auto">
            Creating Beautiful Memories is our Business
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 pointer-events-auto">
            <a
              href="#what-we-do"
              className="group flex items-center gap-3 text-white hover:text-[#050505] hover:bg-[#FFD900] px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.10)",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
              }}
            >
              EXPLORE OUR WORK
              <ChevronDown size={15} className="group-hover:translate-y-1 transition-transform duration-300" />
            </a>
            <a
              href="#make-an-enquiry"
              className="flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            >
              Make an Enquiry <ArrowRight size={15} />
            </a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute right-8 bottom-20 hidden md:flex flex-col items-center gap-2 z-30"
        >
          <motion.span 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="text-[#A0A0A0] text-[10px] tracking-[0.25em]" 
            style={{ writingMode: "vertical-rl" }}
          >
            SCROLL TO EXPLORE ↓
          </motion.span>
          <div className="w-px h-12 bg-gradient-to-b from-[#FFD900] to-transparent mt-2" />
        </motion.div>
        
        {/* Debug Indicator */}
        <div className="absolute bottom-4 left-4 z-50 bg-black/80 text-white text-[10px] p-2 font-mono rounded">
          <p>Video:</p>
          <p>{videoState.status}</p>
          <p ref={debugTimeRef}>Time: 0.00s / 0.00s</p>
          {videoState.error && <p className="text-red-500">{videoState.error}</p>}
        </div>

      </div>
    </section>
  );
}
