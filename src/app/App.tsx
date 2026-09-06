import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, Phone, MessageCircle, Instagram, MapPin,
  ArrowRight, ChevronDown,
  Upload, Image as ImageIcon, Settings, LogOut, LayoutGrid, Eye,
} from "lucide-react";

import logoImg from "@/imports/B_BLogo.jpg";
import heroImg from "@/imports/hero-bg.jpg";
import storyLargeImg from "@/imports/20260525_174632.jpg.jpeg";
import storySmallImg from "@/imports/20230902_012659.jpg.jpeg";
import bnbWordmarkImg from "@/imports/bnb-wordmark.png";

import WhatWeDoSection from "./components/WhatWeDo/WhatWeDoSection";
import InstagramSection from "./components/Instagram/InstagramSection";
import {
  adminLogin, adminLogout, adminMe, adminGetCategories, adminGetImages,
  adminGetDashboardStats, adminAddCategory, adminDeleteCategory,
  adminUploadImage, adminDeleteImage, getFullImageUrl,
} from "./lib/api";
import type { APICategory, APIImage } from "./lib/api";
// ─── Data ────────────────────────────────────────────────────────────────────


const EVENT_CATEGORIES = [
  "Engagement", "Reception", "Wedding", "Birthday", "Baby Shower",
  "Naming Ceremony", "Garlands", "Photography & Videography", "LED Walls",
  "Haldi", "Games", "Celebrity Bookings", "House Warming Ceremony",
  "Opening Ceremonies", "Corporate Events", "Other Services",
];

const WHY_CHOOSE = [
  { num: "01", title: "Creative Designs",         desc: "Unique and customised decoration concepts crafted around your vision." },
  { num: "02", title: "Professional Execution",   desc: "Every detail is carefully planned and flawlessly executed." },
  { num: "03", title: "Premium Quality",          desc: "Quality decoration materials and elegant, lasting designs." },
  { num: "04", title: "Complete Event Support",   desc: "From planning to final setup, we manage every detail." },
  { num: "05", title: "Customised Themes",        desc: "Every celebration gets a setup designed around your vision." },
  { num: "06", title: "Memorable Experiences",   desc: "We focus on creating experiences that guests remember for life." },
];

const NAV_LINKS = [
  { label: "Home",              href: "#home"            },
  { label: "What We Do",        href: "#what-we-do"      },
  { label: "Our Story",         href: "#our-story"       },
  { label: "Instagram",         href: "#instagram"       },
  { label: "Why Choose B&B?",   href: "#why-choose-bb"  },
  { label: "Make an Enquiry",   href: "#make-an-enquiry" },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type View = "public" | "admin-login" | "admin-dashboard";

interface FormData {
  name: string; phone: string; email: string; eventType: string;
  eventDate: string; location: string; guests: string; message: string;
}

// ─── Glassmorphism helpers ───────────────────────────────────────────────────

const glassSurface = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.10)",
} as const;

const glassHover = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.14)",
} as const;

function isAdminPath(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === "/admin" ||
    path.startsWith("/admin/") ||
    path === "/admin-login" ||
    hash === "#admin" ||
    hash.startsWith("#/admin")
  );
}

export default function App() {
  const [scrollY, setScrollY]           = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [view, setView]                 = useState<View>(() => (isAdminPath() ? "admin-login" : "public"));
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [adminEmail, setAdminEmail]     = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError]     = useState("");
  const [adminLoggingIn, setAdminLoggingIn] = useState(false);
  const [formData, setFormData]         = useState<FormData>({
    name: "", phone: "", email: "", eventType: "",
    eventDate: "", location: "", guests: "", message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Sync URL changes with Admin / Public view ──
  useEffect(() => {
    const handleLocationChange = () => {
      if (isAdminPath()) {
        adminMe()
          .then((data) => {
            if (data?.success) {
              setView("admin-dashboard");
            } else {
              setView("admin-login");
            }
          })
          .catch(() => {
            setView("admin-login");
          });
      } else {
        setView("public");
      }
    };

    handleLocationChange();

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const navOpaque = scrollY > 60;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminLoggingIn(true);

    try {
      const data = await adminLogin(adminEmail, adminPassword);
      if (data && data.success) {
        if (!window.location.pathname.toLowerCase().startsWith("/admin")) {
          window.history.pushState(null, "", "/admin");
        }
        setView("admin-dashboard");
        setAdminPassword("");
      } else {
        setAdminError(data?.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setAdminError("Could not reach the server. Make sure Flask is running on port 5000.");
    } finally {
      setAdminLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await adminLogout();
    } catch (err) {
      console.error(err);
    }
    window.history.pushState(null, "", "/");
    setView("public");
  };

  const handleBackToWebsite = () => {
    window.history.pushState(null, "", "/");
    setView("public");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 6000);
  };

  if (view === "admin-login") {
    return (
      <AdminLogin
        email={adminEmail} password={adminPassword} error={adminError}
        onEmailChange={setAdminEmail} onPasswordChange={setAdminPassword}
        isSubmitting={adminLoggingIn}
        onSubmit={handleAdminLogin} onBack={handleBackToWebsite}
      />
    );
  }

  if (view === "admin-dashboard") {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          ...glassSurface,
          background: navOpaque ? "rgba(5,5,5,0.92)" : "rgba(5,5,5,0.25)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: navOpaque ? "12px 0" : "20px 0",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 flex-shrink-0">
            <img src={logoImg} alt="B&B Event Planners logo" className="h-9 w-9 rounded-full object-cover" />
            <div className="hidden sm:block leading-tight">
              <p className="text-white font-semibold text-sm tracking-wide">B&B Event Planners</p>
              <p className="text-[#A0A0A0] text-[9px] tracking-[0.18em]">HOSUR • BANGALORE • KRISHNAGIRI • DHARMAPURI</p>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                className="text-[13px] text-[#A0A0A0] hover:text-[#FFD900] transition-colors duration-300 tracking-wide whitespace-nowrap">
                {label}
              </a>
            ))}
          </div>

          {/* Navbar CTA — "Enquiry" */}
          <a
            href="#make-an-enquiry"
            className="hidden lg:flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300"
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
          >
            Enquiry <ArrowRight size={13} />
          </a>

          <button className="lg:hidden text-white p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(5,5,5,0.98)" }}
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {NAV_LINKS.map(({ label, href }) => (
                  <a key={label} href={href}
                    className="text-[#A0A0A0] hover:text-[#FFD900] transition-colors text-sm tracking-wide"
                    onClick={() => setMobileMenuOpen(false)}>
                    {label}
                  </a>
                ))}
                <a href="#make-an-enquiry"
                  className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-5 py-3 tracking-wide transition-all duration-300"
                  style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                  onClick={() => setMobileMenuOpen(false)}>
                  Make an Enquiry <ArrowRight size={14} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ transform: `scale(1.12) translateY(${scrollY * 0.28}px)`, willChange: "transform" }}
        >
          <img src={heroImg} alt="B&B Event Planners Stage Decoration" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.2) 40%, rgba(5,5,5,0.95) 100%)" }} />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="h-px w-10 bg-[#FFD900]" />
              <span className="text-[#FFD900] text-[11px] tracking-[0.35em] font-medium uppercase">Premium Event Planners</span>
            </div>

            <h1
              className="text-[clamp(2.8rem,8vw,6rem)] font-bold leading-[1.02] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              We Turn Moments<br />
              <span className="text-[#FFD900]">Into Beautiful</span><br />
              Memories
            </h1>

            <p className="text-[#A0A0A0] text-base md:text-lg max-w-xl mb-3 leading-relaxed">
              Premium Event Planning & Decoration Services in{" "}
              <span className="text-white">Hosur, Bangalore, Krishnagiri & Dharmapuri</span>.
            </p>
            <p className="text-[#FFD900]/70 text-[12px] tracking-[0.25em] uppercase mb-10">
              Creating Beautiful Memories is our Business
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="#what-we-do"
                className="group flex items-center gap-3 text-white hover:text-[#050505] hover:bg-[#FFD900] px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300"
                style={{
                  ...glassSurface,
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
        </div>

        <motion.div
          className="absolute right-8 bottom-20 hidden md:flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <span className="text-[#A0A0A0] text-[10px] tracking-[0.25em]" style={{ writingMode: "vertical-rl" }}>SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#FFD900] to-transparent" />
        </motion.div>
      </section>

      {/* ── WHAT WE DO — Compact Interactive Module ── */}
      <WhatWeDoSection scrollY={scrollY} />

      {/* ── OUR STORY ── */}
      <section id="our-story" className="py-28 px-6 md:px-16 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Images */}
          <div className="relative h-[480px] lg:h-[560px]">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: "80%", height: "72%", borderRadius: "2px" }}
            >
              <img
                src={storyLargeImg}
                alt="B&B Event Planners — elegant wedding stage"
                className="w-full h-full object-cover"
                style={{ borderRadius: "2px" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 70, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 right-0 overflow-hidden"
              style={{ width: "60%", height: "40%", outline: "4px solid #050505", borderRadius: "2px" }}
            >
              <img
                src={storySmallImg}
                alt="B&B Event Planners — opening ceremony"
                className="w-full h-full object-cover"
                style={{ borderRadius: "2px" }}
              />
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD900]" />
            </motion.div>

            {/* Stats badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute left-4 bottom-[140px] z-10"
              style={{ ...glassSurface, borderRadius: "2px" }}
            >
              <div className="px-5 py-4" style={{ borderLeft: "2px solid #FFD900" }}>
                <p className="text-[#FFD900] text-2xl font-bold leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>26+</p>
                <p className="text-white text-[11px] tracking-wider mt-1">Years as B&B Brand</p>
              </div>
            </motion.div>

            <div className="absolute top-0 right-[20%] w-px h-14 bg-gradient-to-b from-[#FFD900] to-transparent" />
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#FFD900]" />
              <span className="text-[#FFD900] text-[11px] tracking-[0.35em] uppercase">Our Story</span>
            </div>

            <h2
              className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Creating Beautiful Memories
            </h2>
            <p className="text-[#FFD900] text-sm tracking-widest mb-6 uppercase">is our Business</p>

            <p className="text-[#A0A0A0] leading-relaxed mb-4 text-[15px]">
              B&B Event Planners is an event planning and decoration brand focused on creating beautiful,
              memorable and professionally executed celebrations across Hosur, Bangalore, Krishnagiri, and Dharmapuri.
            </p>
            <p className="text-[#A0A0A0] leading-relaxed mb-7 text-[15px]">
              We specialise in Wedding Decoration, Birthday Parties, Baby Showers, Opening Ceremonies,
              House Ceremonies and Corporate Events.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 mb-7">
              {[
                { value: "10+", label: "Years in Event Field" },
                { value: "26+", label: "Years as B&B Brand" },
              ].map((stat) => (
                <div key={stat.label} className="p-4" style={{ ...glassSurface, borderRadius: "2px", borderLeft: "2px solid #FFD900" }}>
                  <p className="text-[#FFD900] text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
                  <p className="text-[#A0A0A0] text-[11px] tracking-wide mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Team */}
            <div className="mb-7 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-px w-5 bg-[#FFD900]/40" />
                <span className="text-[#A0A0A0] text-xs tracking-wide">Founder — <span className="text-white">Latha Ravi</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px w-5 bg-[#FFD900]/40" />
                <span className="text-[#A0A0A0] text-xs tracking-wide">Directors — <span className="text-white">Siddhaarth & Hemanth Kumar</span></span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <MapPin size={14} className="text-[#FFD900] flex-shrink-0" />
              <span className="text-white text-xs sm:text-sm tracking-[0.2em]">HOSUR • BANGALORE • KRISHNAGIRI • DHARMAPURI</span>
            </div>

            <a
              href="#make-an-enquiry"
              className="inline-flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-7 py-3.5 font-semibold tracking-wide transition-all duration-300 text-sm"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            >
              Make an Enquiry <ArrowRight size={15} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── INSTAGRAM REELS & POSTS ── */}
      <InstagramSection />

      {/* ── WHY CHOOSE B&B ── */}
      <section id="why-choose-bb" className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-[#FFD900]" />
            <span className="text-[#FFD900] text-[11px] tracking-[0.35em] uppercase">Why Choose B&B?</span>
          </div>
          <h2
            className="text-[clamp(2rem,5vw,3.8rem)] font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Excellence in<br />Every Detail
          </h2>
        </motion.div>

        {/* Editorial 2-col list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {WHY_CHOOSE.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="relative flex items-start gap-5 px-6 py-7 cursor-default transition-all duration-300 group"
              style={{
                background: hoveredFeature === i ? "rgba(255,217,0,0.02)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <span
                className="text-[28px] font-bold leading-none flex-shrink-0 transition-colors duration-300 mt-0.5"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: hoveredFeature === i ? "#FFD900" : "rgba(255,255,255,0.10)",
                }}
              >
                {item.num}
              </span>
              <div>
                <h3 className="text-[14px] font-semibold text-white mb-1.5 tracking-wide">{item.title}</h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed">{item.desc}</p>
              </div>
              {/* Hover left accent */}
              <div
                className="absolute left-0 top-0 w-0.5 bg-[#FFD900] transition-all duration-400"
                style={{ height: hoveredFeature === i ? "100%" : "0%" }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MAKE AN ENQUIRY ── */}
      <section id="make-an-enquiry" className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#FFD900]" />
              <span className="text-[#FFD900] text-[11px] tracking-[0.35em] uppercase">Make an Enquiry</span>
            </div>
            <h2
              className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Let's Talk About<br />
              <span className="text-[#FFD900]">Your Event</span>
            </h2>
            <p className="text-[#A0A0A0] leading-relaxed text-base mb-10">
              Tell us about your event and our team will get in touch with you.
            </p>

            {/* Contact info */}
            <div className="space-y-5">
              {[
                { icon: <Phone size={14} />, href: "tel:+918056994721", text: "+91 80569 94721" },
                { icon: <Phone size={14} />, href: "tel:+918870076021", text: "+91 88700 76021" },
                { icon: <Phone size={14} />, href: "tel:+917010056054", text: "+91 70100 56054" },
                { icon: <MessageCircle size={14} />, href: "https://wa.me/918056994721", text: "WhatsApp: +91 80569 94721" },
                { icon: <Instagram size={14} />, href: "https://instagram.com/bnbeventplanners", text: "@bnbeventplanners" },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-4 group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-[#FFD900]"
                    style={{ ...glassSurface, borderRadius: "2px", border: "1px solid rgba(255,217,0,0.2)" }}>
                    {c.icon}
                  </div>
                  <span className="text-[#A0A0A0] group-hover:text-white transition-colors text-sm">{c.text}</span>
                </a>
              ))}

              {/* Address */}
              <div className="flex items-start gap-4 pt-2">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-[#FFD900] mt-0.5"
                  style={{ ...glassSurface, borderRadius: "2px", border: "1px solid rgba(255,217,0,0.2)" }}>
                  <MapPin size={14} />
                </div>
                <p className="text-[#A0A0A0] text-sm leading-relaxed">
                  Shop No 1, Hosur Inner Ring Rd,<br />
                  near Bhavani Grand Palace,<br />
                  Vivekanadha Nagar, Hosur,<br />
                  Tamil Nadu 635109
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enquiry Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            onSubmit={handleFormSubmit}
            className="space-y-7"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              {(
                [
                  { name: "name",      label: "Full Name",     type: "text",  placeholder: "Your full name"      },
                  { name: "phone",     label: "Phone Number",  type: "tel",   placeholder: "+91 XXXXX XXXXX"     },
                  { name: "email",     label: "Email Address", type: "email", placeholder: "your@email.com"      },
                  { name: "eventDate", label: "Event Date",    type: "date",  placeholder: ""                    },
                ] as const
              ).map((field) => (
                <div key={field.name}>
                  <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full bg-transparent border-b text-white py-3 text-sm outline-none transition-colors duration-300 focus:border-[#FFD900]"
                    style={{ borderColor: "rgba(255,255,255,0.18)", colorScheme: "dark" }}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full bg-transparent border-b text-white py-3 text-sm outline-none transition-colors duration-300 focus:border-[#FFD900]"
                style={{ borderColor: "rgba(255,255,255,0.18)", background: "#050505", colorScheme: "dark" }}
              >
                <option value="" style={{ background: "#0B0B0B" }}>Select Event Type</option>
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ background: "#0B0B0B" }}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div>
                <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Location</label>
                <input type="text" placeholder="City / Venue"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-transparent border-b text-white py-3 text-sm outline-none transition-colors duration-300 focus:border-[#FFD900]"
                  style={{ borderColor: "rgba(255,255,255,0.18)" }}
                />
              </div>
              <div>
                <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Number of Guests</label>
                <input type="number" placeholder="Expected guests"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full bg-transparent border-b text-white py-3 text-sm outline-none transition-colors duration-300 focus:border-[#FFD900]"
                  style={{ borderColor: "rgba(255,255,255,0.18)", colorScheme: "dark" }}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Message</label>
              <textarea rows={4} placeholder="Tell us about your event..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b text-white py-3 text-sm outline-none transition-colors duration-300 focus:border-[#FFD900] resize-none"
                style={{ borderColor: "rgba(255,255,255,0.18)" }}
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-8 py-4 font-semibold tracking-wide transition-all duration-300 text-sm"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
            >
              {formSubmitted
                ? "✓ Thank you — our team will contact you shortly."
                : <><span>Send Enquiry</span><ArrowRight size={15} /></>}
            </button>
          </motion.form>
        </div>
      </section>


      {/* ── FOOTER ── */}
      <footer className="pt-20 pb-10 px-6 md:px-16" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mb-14">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImg} alt="B&B Event Planners" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="text-white font-bold text-sm">B&B Event Planners</p>
                  <p className="text-[#A0A0A0] text-[9px] tracking-[0.16em]">HOSUR • BANGALORE • KRISHNAGIRI • DHARMAPURI</p>
                </div>
              </div>
              <img
                src={bnbWordmarkImg}
                alt="Balloonz & Bouquetz Event Planners"
                className="h-9 w-auto object-contain mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              />
              <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">
                Creating Beautiful Memories is our Business. Premium event planning and decoration
                services across Hosur, Bangalore, Krishnagiri, and Dharmapuri.
              </p>
              <div className="space-y-1 text-[#A0A0A0] text-xs">
                <p>Founder — <span className="text-white">Latha Ravi</span></p>
                <p>Directors — <span className="text-white">Siddhaarth & Hemanth Kumar</span></p>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-white text-[10px] tracking-[0.3em] uppercase mb-6">Navigation</p>
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map(({ label, href }) => (
                  <a key={label} href={href}
                    className="text-[#A0A0A0] text-sm hover:text-[#FFD900] transition-colors duration-300 w-fit">
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-white text-[10px] tracking-[0.3em] uppercase mb-6">Contact</p>
              <div className="flex flex-col gap-2.5">
                <a href="tel:+918056994721" className="text-[#A0A0A0] text-sm hover:text-white transition-colors">80569 94721</a>
                <a href="tel:+918870076021" className="text-[#A0A0A0] text-sm hover:text-white transition-colors">88700 76021</a>
                <a href="tel:+917010056054" className="text-[#A0A0A0] text-sm hover:text-white transition-colors">70100 56054</a>
                <a href="https://wa.me/918056994721" target="_blank" rel="noreferrer"
                  className="text-[#A0A0A0] text-sm hover:text-[#FFD900] transition-colors">
                  WhatsApp: +91 80569 94721
                </a>
                <a href="https://instagram.com/bnbeventplanners" target="_blank" rel="noreferrer"
                  className="text-[#A0A0A0] text-sm hover:text-[#FFD900] transition-colors">
                  @bnbeventplanners
                </a>
                <p className="text-[#A0A0A0] text-xs leading-relaxed mt-2">
                  Shop No 1, Hosur Inner Ring Rd,<br />
                  near Bhavani Grand Palace,<br />
                  Vivekanadha Nagar, Hosur, TN 635109
                </p>
              </div>
            </div>
          </div>

          <div
            className="pt-6 flex items-center justify-center text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-[#A0A0A0] text-xs">
              © B&amp;B Event Planners. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────────

interface AdminLoginProps {
  email: string; password: string; error: string;
  onEmailChange: (v: string) => void; onPasswordChange: (v: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void; onBack: () => void;
}

function AdminLogin({ email, password, error, onEmailChange, onPasswordChange, isSubmitting, onSubmit, onBack }: AdminLoginProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#050505", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,217,0,0.04) 0%, transparent 60%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
        style={{ ...glassSurface, padding: "52px 44px", borderRadius: "2px" }}
      >
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-8 bg-[#FFD900]" />
            <span className="text-[#FFD900] text-[10px] tracking-[0.4em] uppercase">Admin Access</span>
            <div className="h-px w-8 bg-[#FFD900]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            B&B Event Planners
          </h1>
          <p className="text-[#A0A0A0] text-sm">Sign in to manage your gallery</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-3">Email</label>
            <input type="email" value={email} onChange={(e) => onEmailChange(e.target.value)}
              placeholder="admin@bnbeventplanners.com"
              className="w-full bg-transparent border-b text-white py-3 text-sm outline-none transition-colors duration-300 focus:border-[#FFD900]"
              style={{ borderColor: "rgba(255,255,255,0.18)" }} required />
          </div>
          <div>
            <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-3">Password</label>
            <input type="password" value={password} onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b text-white py-3 text-sm outline-none transition-colors duration-300 focus:border-[#FFD900]"
              style={{ borderColor: "rgba(255,255,255,0.18)" }} required />
          </div>
          {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}
          <button type="submit" disabled={isSubmitting}
            className="w-full text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] disabled:opacity-70 disabled:cursor-not-allowed py-3.5 font-semibold tracking-wide transition-all duration-300 text-sm"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <button onClick={onBack}
          className="w-full mt-7 text-[#A0A0A0] hover:text-white text-sm transition-colors duration-300 text-center">
          ← Back to Website
        </button>
      </motion.div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [categories, setCategories] = useState<APICategory[]>([]);
  const [images, setImages] = useState<APIImage[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [galleryFilter, setGalleryFilter] = useState("all");
  
  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCat, setUploadCat] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFeatured, setUploadFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  async function fetchData() {
    try {
      if (activeSection === "overview") {
        const s = await adminGetDashboardStats();
        if (s?.success) setStats(s.stats);
        const imgs = await adminGetImages();
        setImages(imgs.slice(0, 8));
      } else if (activeSection === "gallery") {
        const imgs = await adminGetImages();
        setImages(imgs);
        const cats = await adminGetCategories();
        setCategories(cats);
      } else if (activeSection === "categories") {
        const cats = await adminGetCategories();
        setCategories(cats);
      } else if (activeSection === "upload") {
        const cats = await adminGetCategories();
        setCategories(cats);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpload() {
    if (!uploadFile) return alert("Please select an image first.");
    if (!uploadCat) return alert("Please select a category.");
    
    setUploading(true);
    const fd = new FormData();
    fd.append("image", uploadFile);
    fd.append("category_id", uploadCat);
    fd.append("title", uploadTitle);
    fd.append("description", uploadDesc);
    fd.append("is_featured", uploadFeatured ? "true" : "false");
    
    try {
      const res = await adminUploadImage(fd);
      if (res.success) {
        alert("Image uploaded successfully!");
        setUploadFile(null);
        setUploadTitle("");
        setUploadDesc("");
        setUploadFeatured(false);
        setActiveSection("gallery"); 
      } else {
        alert("Upload Failed: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error during upload.");
    }
    setUploading(false);
  }

  async function handleDeleteImage(id: number) {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await adminDeleteImage(id);
      if (res.success) {
        setImages(images.filter(img => img.id !== id));
      } else {
        alert("Delete Failed: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error deleting image.");
    }
  }

  async function handleAddCategory() {
    const name = window.prompt("Enter new category name:");
    if (!name) return;
    try {
      const success = await adminAddCategory(name);
      if (success) {
        fetchData();
      } else {
        alert("Failed to add category.");
      }
    } catch (err) {
      alert("Error adding category.");
    }
  }

  async function handleDeleteCategory(id: number) {
    if (!window.confirm("Are you sure you want to delete this category? All associated images will also be removed!")) return;
    try {
      const success = await adminDeleteCategory(id);
      if (success) {
        setCategories(categories.filter(cat => cat.id !== id));
      } else {
        alert("Failed to delete category.");
      }
    } catch (err) {
      alert("Error deleting category.");
    }
  }

  const getCategoryName = (id: number) => {
    return categories.find(c => c.id === id)?.name || "Category";
  };

  const navItems = [
    { id: "overview",    label: "Overview",      icon: <LayoutGrid size={15} /> },
    { id: "gallery",     label: "Gallery",        icon: <ImageIcon size={15} />  },
    { id: "upload",      label: "Upload Image",   icon: <Upload size={15} />     },
    { id: "categories",  label: "Categories",     icon: <Settings size={15} />   },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#050505", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col"
        style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-white font-bold text-sm">B&B Admin</p>
          <p className="text-[#A0A0A0] text-xs mt-0.5">Gallery Management</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all duration-300 text-left"
              style={{
                color: activeSection === item.id ? "#FFD900" : "#A0A0A0",
                background: activeSection === item.id ? "rgba(255,217,0,0.06)" : "transparent",
                borderLeft: activeSection === item.id ? "2px solid #FFD900" : "2px solid transparent",
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#A0A0A0] hover:text-red-400 transition-colors text-left">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {activeSection === "overview" ? "Dashboard Overview"
              : activeSection === "gallery" ? "Gallery Manager"
              : activeSection === "upload" ? "Upload Image"
              : "Categories"}
          </h1>
          <div className="h-px w-10 bg-[#FFD900] mt-3" />
        </div>

        {/* Overview */}
        {activeSection === "overview" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              <div className="p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                <p className="text-[#A0A0A0] text-[10px] tracking-[0.25em] uppercase mb-3">Total Images</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{stats?.total_images || 0}</p>
              </div>
              <div className="p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                <p className="text-[#A0A0A0] text-[10px] tracking-[0.25em] uppercase mb-3">Categories</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{stats?.total_categories || 0}</p>
              </div>
              <div className="p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                <p className="text-[#A0A0A0] text-[10px] tracking-[0.25em] uppercase mb-3">Active Sections</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{stats?.active_categories || 0}</p>
              </div>
              <div className="p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                <p className="text-[#A0A0A0] text-[10px] tracking-[0.25em] uppercase mb-3">Uploaded This Month</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{stats?.uploaded_this_month || 0}</p>
              </div>
            </div>
            <p className="text-[#A0A0A0] text-xs tracking-widest uppercase mb-5">Recent Uploads</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group overflow-hidden h-40" style={{ borderRadius: "2px" }}>
                  <img src={getFullImageUrl(img.thumbnail_url)} alt={img.title || "Image"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
              {images.length === 0 && <p className="text-[#A0A0A0] text-sm">No recent uploads.</p>}
            </div>
          </div>
        )}

        {/* Upload */}
        {activeSection === "upload" && (
          <div className="max-w-lg">
            <label className="block border-2 border-dashed p-16 text-center mb-8 cursor-pointer transition-colors duration-300 hover:border-[#FFD900]/30"
              style={{ borderColor: "rgba(255,255,255,0.12)", borderRadius: "2px" }}>
              <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
              <Upload size={28} className="mx-auto mb-4 text-[#A0A0A0]" />
              <p className="text-white text-sm mb-1">{uploadFile ? uploadFile.name : "Drop image here or click to browse"}</p>
              <p className="text-[#A0A0A0] text-xs">PNG, JPG, WEBP up to 10MB</p>
            </label>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Category</label>
                <select 
                  className="w-full bg-transparent border-b text-white py-3 text-sm outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.18)", background: "#050505", colorScheme: "dark" }}
                  value={uploadCat}
                  onChange={(e) => setUploadCat(e.target.value)}
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map((c) => <option key={c.id} value={c.id.toString()} style={{ background: "#0B0B0B" }}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Title</label>
                <input type="text" placeholder="Image title"
                  value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-transparent border-b text-white py-3 text-sm outline-none focus:border-[#FFD900] transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.18)" }} />
              </div>
              <div>
                <label className="text-[10px] text-[#A0A0A0] tracking-[0.25em] uppercase block mb-2">Description</label>
                <textarea rows={3} placeholder="Optional description..."
                  value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full bg-transparent border-b text-white py-3 text-sm outline-none focus:border-[#FFD900] transition-colors resize-none"
                  style={{ borderColor: "rgba(255,255,255,0.18)" }} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-[#FFD900]" checked={uploadFeatured} onChange={(e) => setUploadFeatured(e.target.checked)} />
                <span className="text-[#A0A0A0] text-sm">Mark as Featured</span>
              </label>
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-7 py-3 font-semibold text-sm transition-all duration-300 disabled:opacity-50"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}>
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
          </div>
        )}

        {/* Gallery */}
        {activeSection === "gallery" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Gallery Images</h2>
              <select 
                className="bg-transparent border-b text-white py-2 px-3 text-sm outline-none"
                style={{ borderColor: "rgba(255,255,255,0.18)", background: "#050505", colorScheme: "dark" }}
                value={galleryFilter}
                onChange={(e) => setGalleryFilter(e.target.value)}
              >
                <option value="all" style={{ background: "#0B0B0B" }}>All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id.toString()} style={{ background: "#0B0B0B" }}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.filter(img => galleryFilter === "all" || img.category_id.toString() === galleryFilter).map((img) => (
                <div key={img.id} className="relative group overflow-hidden h-40" style={{ borderRadius: "2px" }}>
                  <img src={getFullImageUrl(img.thumbnail_url)} alt={img.title || "Image"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                    <p className="text-white text-xs font-medium text-center">{img.title}</p>
                    <p className="text-[#FFD900] text-[10px] tracking-wide">{getCategoryName(img.category_id)}</p>
                    <div className="flex gap-2 mt-1">
                      <a href={getFullImageUrl(img.image_url)} target="_blank" rel="noreferrer" className="p-1.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}><Eye size={11} className="text-white" /></a>
                      <button onClick={() => handleDeleteImage(img.id)} className="p-1.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}><X size={11} className="text-red-400" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {images.filter(img => galleryFilter === "all" || img.category_id.toString() === galleryFilter).length === 0 && <p className="text-[#A0A0A0] text-sm">No images found for this category.</p>}
            </div>
          </div>
        )}

        {/* Categories */}
        {activeSection === "categories" && (
          <div className="max-w-xl">
            <div className="space-y-1.5 mb-8">
              {categories.map((cat) => (
                <div key={cat.id}
                  className="flex items-center justify-between px-5 py-3 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}>
                  <span className="text-white text-sm">{cat.name}</span>
                  <div className="flex gap-4">
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-[#A0A0A0] hover:text-red-400 text-xs transition-colors">Delete</button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <p className="text-[#A0A0A0] text-sm">No categories found.</p>}
            </div>
            <button onClick={handleAddCategory} className="flex items-center gap-2 text-[#050505] bg-[#FFD900] hover:bg-[#E5B800] px-6 py-3 font-semibold text-sm transition-all duration-300"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}>
              + Add Category
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
