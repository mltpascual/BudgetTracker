/**
 * TIPID — Landing Page
 * Polished layout: Hero → Product Preview (generated mockup) → Feature Sections (6 alternating, with generated mockups)
 * Supports English/Filipino via i18n.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield,
  Smartphone,
  ArrowRight,
  LayoutGrid,
  Wallet,
  Target,
  BarChart3,
  CalendarDays,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

/* ── External mascot assets ── */
const MASCOT_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-hero-bp3JZP7pTnsQwyUv8GpRTC.webp";
const MASCOT_HAPPY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-happy-MhYqoPSPsRvFcB3CkzXrzP.webp";
const MASCOT_COIN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-coin-bBXSjJ8mXoXLhUFaH3AN8S.webp";

/* ── Generated mockup image paths ── */
const M = {
  preview4: "/assets/mockups/preview-4phones.png",
  dashboard: "/assets/mockups/mockup-dashboard.png",
  wallets: "/assets/mockups/mockup-wallets.png",
  analytics: "/assets/mockups/mockup-analytics.png",
  goals: "/assets/mockups/mockup-goals.png",
  history: "/assets/mockups/mockup-history.png",
  settings: "/assets/mockups/mockup-settings.png",
};

/* ── Animation helpers ── */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
};

const fadeLeft = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
};

const fadeRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const },
};

/* ── Feature Section Component ── */
function FeatureSection({
  icon: Icon,
  label,
  heading,
  description,
  mockup,
  reverse = false,
  bgAccent = false,
}: {
  icon: React.ElementType;
  label: string;
  heading: string;
  description: string;
  mockup: string;
  reverse?: boolean;
  bgAccent?: boolean;
}) {
  return (
    <section className={`py-14 md:py-20 ${bgAccent ? "bg-primary/[0.03]" : ""}`}>
      <div
        className={`max-w-6xl mx-auto px-5 flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center gap-8 md:gap-14`}
      >
        {/* Text side */}
        <motion.div
          className="flex-1 max-w-lg"
          {...(reverse ? fadeRight : fadeLeft)}
        >
          <div className="flex items-center gap-2 mb-4">
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold font-display uppercase tracking-widest text-primary">
              {label}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black font-display text-foreground leading-tight mb-4">
            {heading}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-body leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Mockup side */}
        <motion.div
          className="flex-1 flex justify-center"
          {...(reverse ? fadeLeft : fadeRight)}
        >
          <img
            src={mockup}
            alt={label}
            className="w-full max-w-[320px] md:max-w-[380px] h-auto object-contain drop-shadow-xl"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Main Landing Page ── */
export default function Landing() {
  const { t, lang } = useLanguage();

  /* Feature sections data — 6 key features only */
  const FEATURES = [
    {
      icon: LayoutGrid,
      label: lang === "fil" ? "Smart Dashboard" : "Smart Dashboard",
      heading:
        lang === "fil"
          ? "Makita ang buong money picture mo sa isang tingin."
          : "See your full money picture at a glance.",
      description:
        lang === "fil"
          ? "Total balance, income vs expenses, monthly budget progress, quick actions, goals, debts, at recurring entries — lahat nasa home screen mo."
          : "Total balance, income vs expenses, monthly budget progress, quick actions, goals, debts, and recurring entries — all on your home screen.",
      mockup: M.dashboard,
    },
    {
      icon: Wallet,
      label: lang === "fil" ? "Multiple Wallets" : "Multiple Wallets",
      heading:
        lang === "fil"
          ? "I-track ang lahat ng accounts mo sa isang lugar."
          : "Track all your accounts in one place.",
      description:
        lang === "fil"
          ? "Cash, BDO, GCash, BPI — lahat ng wallets mo with individual balances at insights kung gaano katagal ang pera mo."
          : "Cash, BDO, GCash, BPI — all your wallets with individual balances and insights on how long your money lasts.",
      mockup: M.wallets,
    },
    {
      icon: Target,
      label: lang === "fil" ? "Goals & Savings" : "Goals & Savings",
      heading:
        lang === "fil"
          ? "Mag-set ng goals at i-track ang savings mo."
          : "Set goals and track your savings.",
      description:
        lang === "fil"
          ? "Emergency fund, new laptop, Japan trip — i-set ang target amount at due date, at makita ang progress mo with visual bars."
          : "Emergency fund, new laptop, Japan trip — set your target amount and due date, and see your progress with visual bars.",
      mockup: M.goals,
    },
    {
      icon: BarChart3,
      label: lang === "fil" ? "Analytics & Insights" : "Analytics & Insights",
      heading:
        lang === "fil"
          ? "Makita kung saan napupunta ang pera mo."
          : "See where your money goes.",
      description:
        lang === "fil"
          ? "Donut charts, spending breakdown per category, income vs expense trends — lahat ng data na kailangan mo para mag-decide nang tama."
          : "Donut charts, spending breakdown per category, income vs expense trends — all the data you need to make better decisions.",
      mockup: M.analytics,
    },
    {
      icon: CalendarDays,
      label: lang === "fil" ? "Calendar History" : "Calendar History",
      heading:
        lang === "fil"
          ? "Tingnan ang spending patterns mo sa calendar."
          : "See your spending patterns on a calendar.",
      description:
        lang === "fil"
          ? "Monthly calendar view with transaction dots, daily totals, at income/expense summary. Makita kung anong araw ka pinaka-gastos."
          : "Monthly calendar view with transaction dots, daily totals, and income/expense summary. See which days you spend the most.",
      mockup: M.history,
    },
    {
      icon: Settings,
      label: lang === "fil" ? "Full Customization" : "Full Customization",
      heading:
        lang === "fil"
          ? "I-customize ang lahat ayon sa gusto mo."
          : "Customize everything to your liking.",
      description:
        lang === "fil"
          ? "Language, currency, themes, custom categories, export/backup — ikaw ang boss ng app mo. Data mo, control mo."
          : "Language, currency, themes, custom categories, export/backup — you're the boss of your app. Your data, your control.",
      mockup: M.settings,
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={MASCOT_HAPPY} alt="Tipid" className="w-8 h-8 object-contain" />
            <span className="text-lg font-extrabold font-display text-foreground">Tipid</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium font-body text-muted-foreground">
            <a href="#preview" className="hover:text-foreground transition-colors">Preview</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </div>
          <Link href="/app">
            <span className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold font-display active:scale-95 transition-transform">
              {t("landingOpenApp")}
            </span>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={MASCOT_HERO}
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5 pt-16 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <img
              src={MASCOT_COIN}
              alt="Tipid Mascot"
              className="w-28 h-28 mx-auto mb-6 object-contain drop-shadow-lg"
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-black font-display text-foreground leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {lang === "fil" ? (
              <>Budgeting Nang Walang<br /><span className="text-primary">Stress</span></>
            ) : (
              <>Budgeting Without<br /><span className="text-primary">The Stress</span></>
            )}
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-muted-foreground font-body max-w-md mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t("landingHeroDesc")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/app">
              <span className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-base font-bold font-display shadow-lg shadow-primary/30 active:scale-95 transition-transform">
                {lang === "fil" ? "Mag-Start Na" : "Get Started"} <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
            <a
              href="#preview"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-bold font-display text-foreground hover:bg-accent transition-colors"
            >
              {lang === "fil" ? "Tingnan kung paano" : "See how it works"}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Privacy Banner ── */}
      <section className="max-w-5xl mx-auto px-5 -mt-6 mb-16 relative z-10">
        <motion.div
          className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm flex items-center gap-4"
          {...fadeUp}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold font-display text-foreground">
              100% Private &amp; Offline
            </p>
            <p className="text-xs text-muted-foreground font-body">
              {lang === "fil"
                ? "Walang servers, walang accounts, walang tracking. Naka-save ang data mo sa device mo lang."
                : "No servers, no accounts, no tracking. Your financial data stays on your device and never leaves."}
            </p>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRODUCT PREVIEW — Generated 4-phone mockup image
          ══════════════════════════════════════════════════════ */}
      <section id="preview" className="py-16 md:py-24 bg-primary/[0.03]">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div className="text-center mb-10 max-w-2xl mx-auto" {...fadeUp}>
            <span className="text-xs font-bold font-display uppercase tracking-widest text-primary mb-3 block">
              {lang === "fil" ? "Product Preview" : "Product Preview"}
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-foreground leading-tight mb-4">
              {t("landingPreviewHeading")}
            </h2>
            <p className="text-base text-muted-foreground font-body leading-relaxed">
              {t("landingPreviewDesc")}
            </p>
          </motion.div>

          {/* Generated 4-phone mockup image */}
          <motion.div className="max-w-5xl mx-auto" {...fadeUp}>
            <img
              src={M.preview4}
              alt="Tipid app preview showing Dashboard, Wallets, Analytics, and History screens"
              className="w-full h-auto rounded-2xl"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES — 6 key features with generated mockups
          ══════════════════════════════════════════════════════ */}
      <section id="features" className="pt-16 md:pt-20">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div className="text-center mb-4 max-w-2xl mx-auto" {...fadeUp}>
            <span className="text-xs font-bold font-display uppercase tracking-widest text-primary mb-3 block">
              {t("landingFeatures")}
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-foreground leading-tight mb-4">
              {t("landingFeaturesHeading")}
            </h2>
            <p className="text-base text-muted-foreground font-body leading-relaxed">
              {t("landingFeaturesSubDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Individual feature sections — alternating left/right */}
      {FEATURES.map((feature, index) => (
        <FeatureSection
          key={feature.label}
          icon={feature.icon}
          label={feature.label}
          heading={feature.heading}
          description={feature.description}
          mockup={feature.mockup}
          reverse={index % 2 === 1}
          bgAccent={index % 2 === 0}
        />
      ))}

      {/* ── CTA / Install Banner ── */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <motion.div
          className="bg-primary rounded-2xl p-6 md:p-10 text-primary-foreground text-center shadow-lg shadow-primary/20"
          {...fadeUp}
        >
          <Smartphone className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-xl md:text-2xl font-extrabold font-display mb-2">
            {lang === "fil" ? "I-Install Bilang App" : "Install As An App"}
          </h2>
          <p className="text-sm opacity-80 font-body max-w-md mx-auto mb-5">
            {lang === "fil"
              ? "I-add ang Tipid sa home screen mo para sa native app experience. Gumagana offline, walang app store needed!"
              : "Add Tipid to your home screen for a native app experience. Works offline, no app store needed!"}
          </p>
          <Link href="/app">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary text-sm font-bold font-display active:scale-95 transition-transform">
              {t("landingCTA")} <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-8">
        <div className="max-w-5xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={MASCOT_HAPPY} alt="Tipid" className="w-6 h-6 object-contain" />
            <span className="text-sm font-bold font-display text-foreground">Tipid</span>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            {t("landingFooter")}
          </p>
        </div>
      </footer>
    </div>
  );
}
