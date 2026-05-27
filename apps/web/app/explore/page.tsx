"use client"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  FileText,
  Globe,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const navItems = [
  ["Stats", "#stats"],
  ["Missions", "#missions"],
  ["formFactory", "/"],
  ["Store", "#pricing"],
  ["Contact", "#contact"],
]

export default function formFactoryArcadeHome() {

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090909] font-mono text-[#f4f4f4]">
      <StageTexture />
      <Navbar />

      <main className="relative z-10">
        <HeroSection />

        <FeatureShowcaseSection />
        <BuilderWorkflowSection />
        <FormTypesSection />
        <AnalyticsPreviewSection />
        <VisibilityModesSection />
        <TechStackSection />
        <ExploreFormsSection />
        <ApiDocsSection />

        <FAQSection />
        <ContactSection />
      </main>
    </div>
  )
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-5 z-50 px-4">
      <nav className="relative mx-auto flex h-[68px] max-w-[1110px] items-center justify-between overflow-hidden rounded-[12px] border border-white/10 bg-[#efefef] px-10 shadow-[0_8px_0_rgba(255,255,255,0.12),0_20px_60px_rgba(0,0,0,0.9)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/80" />

        {navItems.map(([label, href], index) => (
          <Link
            key={label}
            href={href}
            className={`relative z-10 text-[20px] tracking-[0.18em] text-black transition-all duration-200 hover:scale-[1.04] hover:opacity-70 ${index === 2 ? "text-[20px] tracking-normal" : ""}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

function HeroSection() {
  const router = useRouter()
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 pb-28 pt-32">
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20"
        style={{
          height: "64px",
          backgroundImage: "url('/effects/floor.webp')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 64px",
          imageRendering: "pixelated",
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-30 mx-auto max-w-4xl text-center"
      >
        <motion.h1
          variants={fadeUp}
          className="text-center font-mono text-4xl font-black uppercase leading-[1.25] tracking-[0.08em] text-white sm:text-6xl"
          style={{
            imageRendering: "pixelated",
            textShadow: "0 0 2px rgba(255,255,255,0.4)",
          }}
        >
          YOUR TEAM&apos;S CREATIVE
          <br />
          FRONTEND EXTENSION
        </motion.h1>



        <motion.div variants={fadeUp} className="mt-12">
          <button
            onClick={() => router.push("/signup")}
            className="h-[52px] rounded-[8px] border border-black/10 bg-[#efefef] px-6 text-[28px] text-black shadow-[0_5px_0_rgb(140,140,140),0_10px_20px_rgba(0,0,0,0.35)] transition-all duration-75 hover:translate-y-[1px] hover:shadow-[0_4px_0_rgb(140,140,140),0_8px_16px_rgba(0,0,0,0.35)] active:translate-y-[4px] active:shadow-[0_1px_0_rgb(140,140,140)]">
            Get Started
          </button>

          <div className="mt-5 text-[10px] uppercase tracking-[0.2em] text-white/35">
            Press to continue
          </div>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-[58px] left-[7%] z-30 hidden md:block">
        <Image
          src="https://shakanksh.com/npc/npc-idle.webp"
          alt="warrior"
          width={160}
          height={190}
          priority
          unoptimized
          className="h-[190px] w-auto object-contain"
          draggable={false}
          style={{
            imageRendering: "pixelated",
          }}
        />
      </div>

      <div className="pointer-events-none absolute bottom-[58px] right-[7%] z-30 hidden md:block">
        <Image
          src="https://shakanksh.com/boss/boss-idle.webp"
          alt="boss"
          width={180}
          height={210}
          priority
          unoptimized
          className="h-[210px] w-auto object-contain"
          draggable={false}
          style={{
            imageRendering: "pixelated",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20"
        style={{
          height: "64px",
          backgroundImage: "url('/effects/floor.webp')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 64px",
          imageRendering: "pixelated",
        }}
      />
    </section>
  )
}

function FeatureShowcaseSection() {
  const features = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Dynamic Form Builder",
      text: "Create flexible forms with text, email, rating, select, checkbox and date fields.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Protected Creator Dashboard",
      text: "Manage forms, responses, analytics and themes with authenticated workflows.",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Public + Unlisted Modes",
      text: "Launch forms publicly or share hidden direct-access links.",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Analytics Engine",
      text: "Track response count, completion rates and traffic insights.",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Automation",
      text: "Send confirmations and notifications to creators and respondents.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Type-Safe APIs",
      text: "Powered by tRPC + Zod with fully typed client-server communication.",
    },
  ]

  return (
    <section
      id="stats"
      className=" px-5 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          level="Level 01 - Core Systems"
          title="Production SaaS Features"
          quote="Every form is a playable workflow."
          text="Built like a modern Typeform-style platform with scalable architecture, response analytics and production-grade APIs."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group border border-white/10 bg-[#101010] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
            >
              <div className="flex h-12 w-12 items-center justify-center border border-white/15 bg-black">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-xl font-black uppercase text-white">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/58">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BuilderWorkflowSection() {
  const steps = [
    "Create Form",
    "Add Dynamic Fields",
    "Configure Validations",
    "Publish Share Link",
    "Collect Responses",
    "Analyze Results",
  ]

  return (
    <section className="relative border-t border-white/10 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          level="Level 02 - Workflow"
          title="How formFactory Works"
          quote="Build. Publish. Collect."
          text="A creator-first workflow engineered for startups, communities and modern teams."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="border border-white/10 bg-[#0f0f0f] p-6"
            >
              <div className="text-sm uppercase tracking-[0.2em] text-white/35">
                Phase {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-5 text-2xl font-black uppercase text-white">
                {step}
              </h3>

              <div className="mt-8 flex items-center text-white/45">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FormTypesSection() {
  const forms = [
    "Startup Hiring Form",
    "Anime Fan Survey",
    "Gaming Tournament Signup",
    "Community Feedback Loop",
    "Movie Review Poll",
    "Hackathon Registration",
  ]

  return (
    <section className="relative border-t border-white/10 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          level="Level 03 - Templates"
          title="Creative Form Templates"
          quote="Not another boring survey."
          text="Seeded with demo-ready templates inspired by games, anime, startups and tech culture."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {forms.map((item) => (
            <div
              key={item}
              className="relative overflow-hidden border border-white/10 bg-[#0c0c0c] p-6"
            >
              <div className="absolute right-3 top-3 text-white/15">
                <Sparkles className="h-8 w-8" />
              </div>

              <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                Featured Template
              </div>

              <h3 className="mt-5 text-2xl font-black uppercase text-white">
                {item}
              </h3>

              <div className="mt-10 flex items-center gap-2 text-sm text-white/45">
                <Check className="h-4 w-4" />
                Shareable Public Link
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AnalyticsPreviewSection() {
  const stats = [
    ["Forms Published", "128"],
    ["Responses Collected", "84K"],
    ["Completion Rate", "92%"],
    ["API Requests", "1.8M"],
  ]

  return (
    <section className="relative border-t border-white/10 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          level="Level 04 - Analytics"
          title="Response Intelligence"
          quote="Data becomes strategy."
          text="Track performance with response metrics, completion insights and export-ready analytics."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="border border-white/10 bg-[#0f0f0f] p-6"
            >
              <div className="text-sm uppercase tracking-[0.16em] text-white/35">
                {label}
              </div>

              <div className="mt-6 text-5xl font-black text-white">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisibilityModesSection() {
  return (
    <section className="relative border-t border-white/10 px-5 py-24">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <div className="border border-white/10 bg-[#101010] p-8">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6" />
            <h3 className="text-3xl font-black uppercase text-white">
              Public Forms
            </h3>
          </div>

          <p className="mt-6 text-sm leading-7 text-white/58">
            Discoverable through explore pages, galleries and community listings.
            Anyone can open and submit responses.
          </p>
        </div>

        <div className="border border-white/10 bg-[#101010] p-8">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6" />
            <h3 className="text-3xl font-black uppercase text-white">
              Unlisted Forms
            </h3>
          </div>

          <p className="mt-6 text-sm leading-7 text-white/58">
            Hidden from public discovery. Accessible only through direct links.
          </p>
        </div>
      </div>
    </section>
  )
}

function TechStackSection() {
  const stack = [
    "Next.js",
    "tRPC",
    "Turborepo",
    "Drizzle ORM",
    "PostgreSQL",
    "Zod",
    "Scalar",
    "Tailwind",
  ]

  return (
    <section className="relative border-t border-white/10 px-5 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <SectionIntro
          level="Level 06 - Infrastructure"
          title="Modern Engineering Stack"
          quote="Typed end-to-end."
          text="Structured for scalability using shared packages, type-safe APIs and production-first architecture."
        />

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {stack.map((item) => (
            <div
              key={item}
              className="border border-white/15 bg-[#101010] px-5 py-3 text-sm uppercase tracking-[0.14em] text-white"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



function ExploreFormsSection() {
  return (
    <section className="relative border-t border-white/10 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          level="Level 08 - Explore"
          title="Public Form Gallery"
          quote="Community-built experiences."
          text="Browse trending public forms, startup applications and creative survey templates."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            "Indie Hacker Survey",
            "Valorant Tournament Signup",
            "Anime Convention Registration",
          ].map((item) => (
            <div
              key={item}
              className="border border-white/10 bg-[#101010] p-6"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                Public Form
              </div>

              <h3 className="mt-4 text-2xl font-black uppercase text-white">
                {item}
              </h3>

              <Button
                className="mt-8 rounded-none border border-white bg-white text-black hover:bg-white/90"
              >
                Open Form
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ApiDocsSection() {
  return (
    <section className="relative border-t border-white/10 px-5 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="text-xs uppercase tracking-[0.24em] text-white/40">
          Level 09 - Developer Mode
        </div>

        <h2 className="mt-5 text-5xl font-black uppercase text-white">
          Scalar API Documentation
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/58">
          Interactive API playground powered by Scalar with typed backend routes
          using tRPC and Zod schemas.
        </p>

        <div className="mt-10">
          <Button
            className="rounded-none border border-white bg-white px-8 py-6 text-black hover:bg-white/90"
            asChild
          >
            <Link href="/api-docs">
              Open API Docs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}


function FAQSection() {
  const faqs = [
    {
      q: "What can I build?",
      a: "Surveys, lead forms, feedback loops, onboarding forms, applications and internal tools with shareable links.",
    },
    {
      q: "Do respondents need accounts?",
      a: "No. Creators sign in to manage forms, but respondents can submit through public or unlisted links.",
    },
    {
      q: "Is there an API?",
      a: "Yes. formFactory includes API documentation and typed internals powered by tRPC, Zod and Drizzle.",
    },
  ]

  return (
    <section className="relative border-t border-white/10 px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionIntro
          level="Level 05 - FAQ"
          title="Got Questions?"
          quote="Query resolved."
          text="A quick codex for the common things teams ask before launching their first form mission."
        />

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.q}
              className="grid gap-4 border border-white/20 bg-[#101010] p-5 md:grid-cols-[90px_1fr]"
            >
              <div className="text-xl font-black text-white/45">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-xl font-black uppercase text-white">
                  {faq.q}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="relative border-t border-white/10 px-5 py-24"
    >
      <div className="mx-auto max-w-5xl text-center">
        <div className="text-xs uppercase tracking-[0.22em] text-white/45">
          Available for new campaigns
        </div>
        <h2 className="mt-5 text-4xl font-black uppercase leading-tight text-white sm:text-6xl">
          Launch your first
          <span className="block">form mission.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/58">
          Create a form, publish a link and watch response data arrive in your
          dashboard. No hourly tracking, no spreadsheet chaos, no login wall for
          respondents.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            className="h-14 rounded-none border border-white bg-white px-8 font-black text-[#111] hover:bg-white/85"
            asChild
          >
            <Link href="/sign-up">
              Start Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-none border-white/30 bg-transparent px-8 font-black text-white hover:bg-white hover:text-[#111]"
            asChild
          >
            <Link href="/api-docs">
              Read API Docs
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <footer className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs uppercase tracking-[0.18em] text-white/38 sm:flex-row">
          <span>© 2026 formFactory</span>
          <span>Turborepo / tRPC / Drizzle / Zod / Next.js</span>
        </footer>
      </div>
    </section>
  )
}

function SectionIntro({
  level,
  title,
  quote,
  text,
}: {
  level: string
  title: string
  quote: string
  text: string
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.24em] text-white/42">
        {level}
      </div>
      <h2 className="mt-4 text-4xl font-black uppercase leading-tight text-white sm:text-6xl">
        {title}
      </h2>
      <div className="mt-5 text-sm text-white/70">&quot;{quote}&quot;</div>
      <p className="mt-6 max-w-2xl text-sm leading-7 text-white/56">{text}</p>
    </div>
  )
}

function StageTexture() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[#090909]" />
      <div className="absolute inset-0 opacity-[0.06]">
        <PixelNoise />
      </div>
    </div>
  )
}

function PixelNoise() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="h-full w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="noise-grid" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0v36" fill="none" stroke="#fff" strokeOpacity="0.28" />
          <rect x="7" y="7" width="2" height="2" fill="#fff" opacity="0.85" />
          <rect x="27" y="22" width="2" height="2" fill="#fff" opacity="0.45" />
        </pattern>
      </defs>
      <rect width="1200" height="800" fill="url(#noise-grid)" />
    </svg>
  )
}




