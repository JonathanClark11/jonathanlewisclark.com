"use client";

import { useEffect, useRef, useState } from "react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${delay ? `reveal-delay-${delay}` : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Career", href: "#career" },
    { label: "Ventures", href: "#ventures" },
    { label: "Skills", href: "#skills" },
    { label: "Leadership", href: "#leadership" },
    { label: "Interests", href: "#interests" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bg-primary/90 backdrop-blur-md border-b border-border-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-accent-copper tracking-wide"
        >
          JLC
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link text-sm font-light text-text-secondary hover:text-text-primary tracking-widest uppercase"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-text-secondary hover:text-text-primary"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle px-6 pb-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-text-secondary hover:text-text-primary tracking-widest uppercase"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <svg
        className="contour-decoration -right-40 -top-40 w-[600px] h-[600px]"
        viewBox="0 0 600 600"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <ellipse cx="300" cy="300" rx="280" ry="200" opacity="0.3" />
        <ellipse cx="300" cy="300" rx="230" ry="165" opacity="0.25" />
        <ellipse cx="300" cy="300" rx="180" ry="130" opacity="0.2" />
        <ellipse cx="300" cy="300" rx="130" ry="95" opacity="0.15" />
        <ellipse cx="300" cy="300" rx="80" ry="60" opacity="0.1" />
      </svg>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <Reveal>
          <p className="text-accent-copper text-sm tracking-[0.3em] uppercase mb-6 font-light">
            Senior Engineering Leader
          </p>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl sm:text-7xl lg:text-8xl font-light text-text-primary mb-8 leading-[0.95] tracking-tight">
            Jonathan
            <br />
            Lewis Clark
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            12+ years at Amazon building and scaling distributed systems,
            high-performing engineering organizations, and consumer AI products.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="flex items-center justify-center gap-4 text-text-muted text-sm mb-12">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Seattle, WA
            </span>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://linkedin.com/in/JonathanClark11"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-text-secondary hover:text-accent-copper transition-colors text-sm"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href="mailto:JonathanClark11@gmail.com"
              className="group flex items-center gap-2 text-text-secondary hover:text-accent-copper transition-colors text-sm"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="hidden sm:inline">Email</span>
            </a>
            <a
              href="tel:+12066001315"
              className="group flex items-center gap-2 text-text-secondary hover:text-accent-copper transition-colors text-sm"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="hidden sm:inline">+1-206-600-1315</span>
            </a>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-bounce">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </section>
  );
}

const careerData = [
  {
    title: "Senior Manager, Alexa Daily Essentials",
    company: "Amazon",
    location: "Seattle, WA",
    period: "Apr 2022 – Present",
    highlights: [
      "Leading 61-person engineering organization (49 SDEs, 6 SDMs, 1 TPM, 4 interns) across 9 product charters",
      "Delivered 54.5% infrastructure cost reduction within 5 months",
      "Delivered SVP-level goal for AI-backed intelligent features (Calendar Insights)",
      "Leading GenAI charter with science team mandate for AI/ML model deployment",
      "Org growth arc: 34 (join) → 68 (peak) → 61 (current)",
    ],
    elevation: 100,
  },
  {
    title: "Senior Manager / SDM III, AWS Step Functions",
    company: "Amazon Web Services",
    location: "Vancouver, BC",
    period: "Nov 2018 – Apr 2022",
    highlights: [
      "Scaled engineering organization from 2 → 8 → 22 engineers",
      "Led escalation manager group of 16 EMs across Events & Workflows",
      "Promoted three times in four years (SDM II → SDM III → Senior Manager)",
    ],
    elevation: 80,
  },
  {
    title: "SDM II, AWS Step Functions",
    company: "Amazon Web Services",
    location: "Vancouver, BC",
    period: "Apr 2018 – Nov 2018",
    highlights: [
      "Grew initial team from 2 to 8 within 5 months",
      "Became sole owner of AWS Step Functions",
    ],
    elevation: 55,
  },
  {
    title: "Software Development Engineer II",
    company: "Amazon Web Services",
    location: "Vancouver, BC",
    period: "Apr 2016 – Apr 2018",
    highlights: [
      "Developed frontend interface for AWS Step Functions",
      "Designed backend features for security, scalability, and availability",
    ],
    elevation: 40,
  },
  {
    title: "Software Development Engineer",
    company: "Amazon.com",
    location: "Vancouver, BC",
    period: "Jun 2014 – Apr 2016",
    highlights: [
      "Fire Phone, RDS Aurora, Simple Workflow Service (SWF)",
      "Deep work in distributed systems: ACID transactions on DynamoDB, write-ahead logging, consistent hashing",
    ],
    elevation: 25,
  },
];

function CareerTimeline() {
  return (
    <section id="career" className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-accent-copper text-sm tracking-[0.3em] uppercase mb-3 font-light">
            Trajectory
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light mb-16 tracking-tight">
            Career Elevation
          </h2>
        </Reveal>

        <div className="relative">
          <div className="timeline-line" />

          {careerData.map((role, i) => (
            <Reveal key={i} delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}>
              <div
                className={`relative pl-12 md:pl-0 pb-16 last:pb-0 ${
                  i % 2 === 0
                    ? "md:pr-[calc(50%+2rem)] md:text-right"
                    : "md:pl-[calc(50%+2rem)]"
                }`}
              >
                <div className="timeline-dot" />

                <div className="bg-bg-card/60 backdrop-blur-sm border border-border-subtle rounded-lg p-6 hover:border-border-hover transition-colors">
                  <span className="text-accent-copper text-xs tracking-widest uppercase font-light">
                    {role.period}
                  </span>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl font-medium mt-2 mb-1 text-text-primary">
                    {role.title}
                  </h3>
                  <p className="text-text-muted text-sm mb-4">
                    {role.company} &middot; {role.location}
                  </p>

                  <ul
                    className={`space-y-2 ${
                      i % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    {role.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="text-text-secondary text-sm font-light leading-relaxed"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M2 20l7.5-7.5L13 16l9-12" />
                    </svg>
                    <div className="flex-1 h-1 bg-bg-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-copper-dim to-accent-copper rounded-full elevation-bar"
                        style={{ width: `${role.elevation}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const ventures = [
  {
    name: "BudgiePlanner",
    url: "https://budgieplanner.com",
    role: "Founder & CEO",
    period: "2024 – Present",
    description:
      "AI-powered budgeting and financial planning product built on Claude/Anthropic models using Claude Code.",
    tag: "Active",
    tagColor: "bg-green-900/40 text-green-400 border-green-800/50",
  },
  {
    name: "Gretchen",
    role: "Founder",
    period: "2023 – 2024",
    description:
      "Legal AI assistant product for email. Solo founder, operated in parallel with Amazon role.",
    tag: "Completed",
    tagColor: "bg-bg-tertiary text-text-muted border-border-subtle",
  },
  {
    name: "Medimap Systems",
    role: "Co-Founder & CTO",
    period: "2015 – 2017",
    description:
      "Healthcare marketplace connecting patients to walk-in clinics. Achieved 72% market share across Canada. Raised $1.5M seed round. Built while working full-time at Amazon.",
    tag: "$1.5M Raised",
    tagColor: "bg-amber-900/40 text-amber-400 border-amber-800/50",
  },
];

function Ventures() {
  return (
    <section id="ventures" className="py-24 sm:py-32 px-6 bg-bg-secondary/50">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-accent-copper text-sm tracking-[0.3em] uppercase mb-3 font-light">
            Entrepreneurship
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light mb-16 tracking-tight">
            Ventures
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventures.map((v, i) => (
            <Reveal key={v.name} delay={Math.min(i + 1, 3) as 1 | 2 | 3}>
              <div className="venture-card bg-bg-card/80 border border-border-subtle rounded-lg p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-medium text-text-primary">
                    {v.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${v.tagColor} whitespace-nowrap`}
                  >
                    {v.tag}
                  </span>
                </div>
                <p className="text-accent-copper text-xs tracking-widest uppercase font-light mb-1">
                  {v.role}
                </p>
                <p className="text-text-muted text-xs mb-4">{v.period}</p>
                <p className="text-text-secondary text-sm font-light leading-relaxed flex-1">
                  {v.description}
                </p>
                {v.url && (
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-accent-copper text-sm hover:text-accent-copper-light transition-colors"
                  >
                    Visit
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4.5 19.5l15-15M4.5 4.5h15v15" />
                    </svg>
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const skillCategories = [
  {
    label: "Core Strengths",
    skills: [
      "Distributed Systems",
      "Workflow Orchestration",
      "Cloud Infrastructure (AWS)",
      "Engineering Leadership",
      "AI/ML Product Delivery",
    ],
  },
  {
    label: "Languages & Frameworks",
    skills: ["Java / Spring", "Python", "Node.js", "React / React Native", "Angular"],
  },
  {
    label: "Infrastructure",
    skills: ["DynamoDB", "RDS Aurora", "Step Functions", "Lambda", "CI/CD Pipelines"],
  },
  {
    label: "AI & Emerging Tech",
    skills: ["Large Language Models", "Claude / Anthropic API", "Claude Code", "ChatGPT / OpenAI"],
  },
];

function Skills() {
  return (
    <section id="skills" className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-accent-copper text-sm tracking-[0.3em] uppercase mb-3 font-light">
            Expertise
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light mb-16 tracking-tight">
            Technical Skills
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-10">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.label} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
              <div>
                <h3 className="text-text-muted text-xs tracking-[0.2em] uppercase mb-4 font-light">
                  {cat.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span
                      key={s}
                      className="skill-badge bg-bg-tertiary border border-border-subtle text-text-secondary text-sm px-3 py-1.5 rounded cursor-default"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const leadershipStats = [
  { value: "61", label: "Engineers Led" },
  { value: "6", label: "SDM Direct Reports" },
  { value: "17+", label: "People Managers" },
  { value: "~8yr", label: "SDE I → Sr. Manager" },
];

function Leadership() {
  return (
    <section id="leadership" className="py-24 sm:py-32 px-6 bg-bg-secondary/50">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-accent-copper text-sm tracking-[0.3em] uppercase mb-3 font-light">
            Scale
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light mb-16 tracking-tight">
            Leadership
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {leadershipStats.map((stat, i) => (
            <Reveal key={stat.label} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
              <div className="text-center p-6 bg-bg-card/60 border border-border-subtle rounded-lg">
                <div className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light text-accent-copper mb-2">
                  {stat.value}
                </div>
                <div className="text-text-muted text-xs tracking-widest uppercase">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <div className="bg-bg-card/40 border border-border-subtle rounded-lg p-8 max-w-3xl mx-auto">
            <blockquote className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl font-light text-text-primary leading-relaxed italic">
              &ldquo;The thread that runs through my career is building and
              scaling — taking something from zero or near-zero and growing it
              into a high-performing system and team.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-8 h-px bg-accent-copper shrink-0" />
              <p className="text-text-secondary text-sm font-light">
                In 2022, I deliberately moved from AWS to Alexa — from B2B to
                B2C, from infrastructure to product, into AI and science. I
                found a different operating culture and brought what I knew:
                within five months, I delivered a 54.5% infrastructure cost
                reduction.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const summits = [
  { name: "Mt. Baker", elevation: 10781, ft: "10,781'" },
  { name: "Mt. Temple", elevation: 11627, ft: "11,627'" },
  { name: "Mt. Democrat", elevation: 14148, ft: "14,148'" },
  { name: "Mt. Rainier", elevation: 14410, ft: "14,410'" },
  { name: "Mt. Massive", elevation: 14421, ft: "14,421'" },
  { name: "Mt. Elbert", elevation: 14433, ft: "14,433'" },
];

const maxElevation = 14433;

function Interests() {
  return (
    <section id="interests" className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-accent-copper text-sm tracking-[0.3em] uppercase mb-3 font-light">
            Beyond Work
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl sm:text-5xl font-light mb-16 tracking-tight">
            Interests
          </h2>
        </Reveal>

        <Reveal delay={1}>
          <div className="mb-12">
            <h3 className="text-text-muted text-xs tracking-[0.2em] uppercase mb-6 font-light">
              Summits Reached
            </h3>
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 sm:h-64">
              {summits.map((s) => {
                const height = (s.elevation / maxElevation) * 100;
                return (
                  <div
                    key={s.name}
                    className="flex-1 flex flex-col items-center justify-end h-full group"
                  >
                    <span className="text-accent-copper text-[10px] sm:text-xs mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {s.ft}
                    </span>
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-accent-copper-dim/60 to-accent-copper/80 group-hover:from-accent-copper-dim group-hover:to-accent-copper transition-all duration-300 relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-copper opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-text-muted text-[9px] sm:text-xs mt-2 text-center leading-tight">
                      {s.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Reveal delay={2}>
            <div className="bg-bg-card/60 border border-border-subtle rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-accent-copper">
                  <path d="M12 3l3.5 7.5L23 12l-7.5 3.5L12 23l-3.5-7.5L1 12l7.5-3.5L12 3z" />
                </svg>
                <h3 className="text-text-primary text-sm font-medium">Canoeing</h3>
              </div>
              <p className="text-text-secondary text-sm font-light">
                Bowron Lake Circuit, Spatsizi &amp; Upper Stikine Rivers
              </p>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <div className="bg-bg-card/60 border border-border-subtle rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-accent-copper">
                  <path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                </svg>
                <h3 className="text-text-primary text-sm font-medium">Running</h3>
              </div>
              <p className="text-text-secondary text-sm font-light">
                Youngest participant in the 2004 Vancouver Marathon at age 12
              </p>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="bg-bg-card/60 border border-border-subtle rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-accent-copper">
                  <path d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.75 10.5h-1.5A3.375 3.375 0 007.5 14.25v4.5" />
                </svg>
                <h3 className="text-text-primary text-sm font-medium">Sports</h3>
              </div>
              <p className="text-text-secondary text-sm font-light">
                Golf, Rugby (6 years), Soccer (2 years)
              </p>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="bg-bg-card/60 border border-border-subtle rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-accent-copper">
                  <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.466.732-3.558" />
                </svg>
                <h3 className="text-text-primary text-sm font-medium">Travel</h3>
              </div>
              <p className="text-text-secondary text-sm font-light">
                Exploring new places and cultures around the world
              </p>
            </div>
          </Reveal>

          <Reveal delay={3}>
            <div className="bg-bg-card/60 border border-border-subtle rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-accent-copper">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <h3 className="text-text-primary text-sm font-medium">Family</h3>
              </div>
              <p className="text-text-secondary text-sm font-light">
                Proud dad to a 4-year-old daughter
              </p>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="bg-bg-card/60 border border-border-subtle rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-accent-copper">
                  <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <h3 className="text-text-primary text-sm font-medium">Fitness &amp; Biking</h3>
              </div>
              <p className="text-text-secondary text-sm font-light">
                Exercise and cycling to stay sharp
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="py-16 px-6 bg-bg-secondary/50">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-accent-copper text-sm tracking-[0.3em] uppercase mb-2 font-light">
                Education
              </p>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl sm:text-3xl font-light text-text-primary">
                Bachelor of Science, Computer Science
              </h3>
            </div>
            <div className="sm:text-right">
              <p className="text-text-secondary text-sm font-light">
                University of British Columbia
              </p>
              <p className="text-text-muted text-sm">2014</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="py-16 px-6 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <h2 className="font-[family-name:var(--font-cormorant)] text-3xl sm:text-4xl font-light text-text-primary mb-4">
              Get in Touch
            </h2>
            <div className="space-y-2">
              <a
                href="mailto:JonathanClark11@gmail.com"
                className="block text-text-secondary hover:text-accent-copper transition-colors text-sm"
              >
                JonathanClark11@gmail.com
              </a>
              <a
                href="tel:+12066001315"
                className="block text-text-secondary hover:text-accent-copper transition-colors text-sm"
              >
                +1-206-600-1315
              </a>
              <a
                href="https://linkedin.com/in/JonathanClark11"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-text-secondary hover:text-accent-copper transition-colors text-sm"
              >
                linkedin.com/in/JonathanClark11
              </a>
            </div>
          </div>
          <div className="text-text-muted text-xs">
            <p>Seattle, WA</p>
            <p className="mt-1">&copy; {new Date().getFullYear()} Jonathan Lewis Clark</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <CareerTimeline />
      <Ventures />
      <Skills />
      <Leadership />
      <Interests />
      <Education />
      <Footer />
    </main>
  );
}
