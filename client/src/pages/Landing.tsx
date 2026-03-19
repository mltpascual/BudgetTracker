/**
 * TIPID — Landing Page
 * Marketing page with hero, features, and CTA. Tarsi-inspired layout.
 * Supports English/Filipino via i18n.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Wallet,
  CalendarDays,
  Target,
  TrendingUp,
  HandCoins,
  Download,
  Shield,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const MASCOT_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-hero-bp3JZP7pTnsQwyUv8GpRTC.webp";
const MASCOT_HAPPY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-happy-MhYqoPSPsRvFcB3CkzXrzP.webp";
const MASCOT_COIN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663343684150/FNkkFLEF8kYQYkpqvCkWgV/mascot-coin-bBXSjJ8mXoXLhUFaH3AN8S.webp";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

export default function Landing() {
  const { t, lang } = useLanguage();

  const FEATURES = [
    {
      icon: Wallet,
      title: lang === "fil" ? "Multiple Wallets" : "Multiple Wallets",
      desc: lang === "fil" ? "I-track ang cash, bank accounts, at e-wallets mo sa isang lugar." : "Track cash, bank accounts, and e-wallets all in one place.",
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      icon: CalendarDays,
      title: lang === "fil" ? "Calendar History" : "Calendar History",
      desc: lang === "fil" ? "Tingnan ang spending patterns mo gamit ang monthly calendar view." : "See your spending patterns with a beautiful monthly calendar view.",
      color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    },
    {
      icon: Target,
      title: lang === "fil" ? "Monthly Budgets" : "Monthly Budgets",
      desc: lang === "fil" ? "Mag-set ng spending limits per category at manatiling on track." : "Set spending limits per category and stay on track.",
      color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    },
    {
      icon: TrendingUp,
      title: lang === "fil" ? "Savings Goals" : "Savings Goals",
      desc: lang === "fil" ? "Mag-set ng targets at panoorin ang progress mo." : "Set targets and watch your progress grow over time.",
      color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      icon: HandCoins,
      title: lang === "fil" ? "Debt Tracker" : "Debt Tracker",
      desc: lang === "fil" ? "I-track ang utang mo at pinahiram mo." : "Keep track of what you owe and what others owe you.",
      color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    },
    {
      icon: Download,
      title: lang === "fil" ? "JSON Backup" : "JSON Backup",
      desc: lang === "fil" ? "I-export at i-import ang data mo anytime. Data mo, control mo." : "Export and import your data anytime. Your data, your control.",
      color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={MASCOT_HAPPY} alt="Tipid" className="w-8 h-8 object-contain" />
            <span className="text-lg font-extrabold font-display text-foreground">Tipid</span>
          </div>
          <Link href="/app">
            <span className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold font-display active:scale-95 transition-transform">
              {t("landingOpenApp")}
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={MASCOT_HERO}
            alt="Tipid Hero"
            className="w-full h-full object-cover opacity-20"
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
              className="w-32 h-32 mx-auto mb-6 object-contain drop-shadow-lg"
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
          </motion.div>
        </div>
      </section>

      {/* Privacy Banner */}
      <section className="max-w-5xl mx-auto px-5 -mt-6 mb-12 relative z-10">
        <motion.div
          className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm flex items-center gap-4"
          {...fadeUp}
          transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold font-display text-foreground">
              {lang === "fil" ? "100% Private & Offline" : "100% Private & Offline"}
            </p>
            <p className="text-xs text-muted-foreground font-body">
              {lang === "fil"
                ? "Walang servers, walang accounts, walang tracking. Naka-save ang data mo sa device mo lang."
                : "No servers, no accounts, no tracking. Your financial data stays on your device and never leaves."}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <motion.div className="text-center mb-10" {...fadeUp}>
          <h2 className="text-2xl md:text-3xl font-extrabold font-display text-foreground mb-2">
            {t("landingFeaturesDesc")}
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            {lang === "fil" ? "Simple pero powerful na tools para i-manage ang pera mo." : "Simple yet powerful tools to manage your money."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-card rounded-2xl p-5 border border-border/50 hover:shadow-md transition-shadow"
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-display text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PWA Install Banner */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <motion.div
          className="bg-primary rounded-2xl p-6 md:p-8 text-primary-foreground text-center shadow-lg shadow-primary/20"
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

      {/* Footer */}
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
