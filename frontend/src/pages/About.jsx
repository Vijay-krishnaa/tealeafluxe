import { Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  Droplets,
  Earth,
  Globe,
  HandHeart,
  Heart,
  Leaf,
  MapPin,
  Recycle,
  Sprout,
  Star,
  Sun,
  Users,
  Wind,
} from "lucide-react";
import { motion } from "motion/react";
import Button from "../components/Button";
import PageTransition from "../components/PageTransition";
import SectionContainer, {
  SectionHeading,
} from "../components/SectionContainer";
import testimonials from "../data/testimonials";

/* ─── Data ─────────────────────────────────────────────────────────── */

const brandStory = [
  {
    lead: "Born in Mumbai, Shaped by Darjeeling",
    body: "In 2018, Arjun Mehta — a Mumbai-born tea connoisseur who spent three years training with master blenders in Darjeeling's Makaibari estate — founded Swadistchai with a single, unwavering conviction: that India's finest teas deserved to reach Indian homes with the same reverence they received abroad. He had tasted what was possible. He refused to accept less.",
  },
  {
    lead: "The Sourcing Philosophy",
    body: "From the beginning, Swadistchai made a commitment that defines everything: we visit every garden we source from. No brokers. No middlemen. No exceptions. Our team travels across Darjeeling's fog-wrapped hillsides during first flush season, through the monsoon estates of Upper Assam, and into the high-altitude plots of the Nilgiris Blue Mountains. Slow, intentional, and deeply personal.",
  },
  {
    lead: "From Garden to Cup — Always Whole Leaf",
    body: "India's commercial tea industry runs largely on broken leaf and dust — the residue of mass production. We chose a different standard from day one: only whole leaves, harvested at peak vitality, treated with the reverence they deserve. The difference in the cup is not subtle. It is transformational. Every tin we ship carries that standard.",
  },
];

const sourcingSteps = [
  {
    number: "01",
    icon: MapPin,
    title: "Garden Partnership",
    desc: "We identify and visit estates that share our values — small-batch, family-run, naturally farmed. Relationships built over years, not contracts.",
  },
  {
    number: "02",
    icon: Sun,
    title: "Seasonal Harvest",
    desc: "We time our orders to specific harvest windows — first flush, second flush, or post-monsoon — for flavour profiles at their peak expression.",
  },
  {
    number: "03",
    icon: Star,
    title: "Cupping & Selection",
    desc: "Every incoming batch is cupped blind by our team. Only teas that pass our sensory benchmarks are accepted. We reject roughly 40% of what we try.",
  },
  {
    number: "04",
    icon: Wind,
    title: "Careful Transit",
    desc: "Temperature-controlled shipment from origin preserves aroma integrity. Teas travel in food-grade foil, sealed at source, opened only on arrival.",
  },
  {
    number: "05",
    icon: Droplets,
    title: "Small-Batch Packing",
    desc: "We pack to order in our Mumbai facility — never holding large pre-packed stock. Freshness is not a marketing claim here; it is the operating model.",
  },
  {
    number: "06",
    icon: Heart,
    title: "Direct to Your Door",
    desc: "Every order ships with a garden card — a small note on the estate, the harvest date, and brewing notes written by the grower themselves.",
  },
];

const regions = [
  {
    name: "Darjeeling, India",
    subtitle: "The Champagne of Teas",
    flag: "🇮🇳",
    desc: "Grown at elevations above 2,000 metres in the foothills of the Himalayas, Darjeeling teas are defined by their muscatel character — a naturally occurring grape-like quality prized by connoisseurs worldwide. Our first-flush Darjeeling is harvested in March, when the dormant bushes awaken with singular clarity.",
    teas: ["First Flush", "Second Flush", "Autumnal"],
    tint: "from-emerald-800/20 to-emerald-950/40",
    image:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&h=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Assam, India",
    subtitle: "Bold Brahmaputra Character",
    flag: "🇮🇳",
    desc: "The Brahmaputra valley produces teas of unrivalled body and malt. Grown at low elevation in rich alluvial soil, Assam teas are the morning anchor — bold enough to carry milk, complex enough to stand alone. Our estate partner in Jorhat has been farming the same land for over a century.",
    teas: ["Orthodox TGFOP", "Gold Tips", "Monsoon Flush"],
    tint: "from-amber-800/20 to-amber-950/40",
    image:
      "https://images.unsplash.com/photo-1464822756577-4f5d26ef5e75?w=600&h=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Nilgiris, India",
    subtitle: "Blue Mountain Briskness",
    flag: "🇮🇳",
    desc: "The Blue Mountains of Tamil Nadu produce teas of remarkable brightness and citrus clarity at elevations exceeding 2,000 metres. Often called the 'Darjeeling of the South', Nilgiri teas brew to a luminous amber cup with clean, brisk finish that works beautifully hot or cold-brewed.",
    teas: ["High-Grown Orange Pekoe", "Winter Flush", "Cold Brew"],
    tint: "from-teal-800/20 to-teal-950/40",
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Wuyi Mountains, China",
    subtitle: "Rock Oolong & White Tea",
    flag: "🇨🇳",
    desc: "The mineral-rich rock formations of Fujian's Wuyi range impart a distinctive 'rock bone' character to their oolongs — deep, roasted, and complex. Our Silver Needle white tea comes from a fourth-generation family estate where the drying uses only mountain air and the gentlest of sun.",
    teas: ["Silver Needle", "White Peony", "Da Hong Pao"],
    tint: "from-stone-800/20 to-stone-950/40",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Uji, Japan",
    subtitle: "Ceremonial Matcha",
    flag: "🇯🇵",
    desc: "Uji has been cultivating ceremonial-grade matcha for over 800 years. Our tencha leaves are shade-grown for 30 days before harvest, then stone-ground to order in small quantities that preserve freshness. The result: a vivid emerald powder with natural umami depth that industrial mills cannot replicate.",
    teas: ["Ceremonial Grade", "Gyokuro", "First Harvest"],
    tint: "from-green-800/20 to-green-950/40",
    image:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&h=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Alishan, Taiwan",
    subtitle: "High Mountain Oolong",
    flag: "🇹🇼",
    desc: "At 1,400 metres in the Alishan range, dramatic day-night temperature swings slow the growth of tea leaves, concentrating sugars and building extraordinary floral complexity. Our oolong partner harvests only twice a year, and we are among a handful of buyers given direct access to the spring lot.",
    teas: ["High Mountain Oolong", "Dong Ding", "Jin Xuan"],
    tint: "from-violet-800/20 to-violet-950/40",
    image:
      "https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=600&h=400&q=80&auto=format&fit=crop",
  },
];

const sustainability = [
  {
    icon: Leaf,
    title: "Certified Organic",
    desc: "All our teas are certified organic under EU and USDA standards. No synthetic pesticides, no artificial fertilisers — just healthy soil and generational expertise.",
    badge: "EU & USDA Organic",
  },
  {
    icon: HandHeart,
    title: "Direct Trade",
    desc: "We pay above Fairtrade minimums by an average of 28%, and reinvest 5% of profits directly into garden infrastructure and farmer education.",
    badge: "Direct Trade Verified",
  },
  {
    icon: Recycle,
    title: "Zero-Waste Packaging",
    desc: "All packaging is home-compostable or FSC-certified recycled. Our mailers are made from reclaimed kraft paper. Our tins are designed to be re-used for life.",
    badge: "100% Compostable",
  },
  {
    icon: Earth,
    title: "Carbon Neutral Shipping",
    desc: "We offset 120% of all shipping emissions through verified reforestation projects in the Western Ghats and the Himalayas — regions connected to our tea origins.",
    badge: "Carbon Neutral",
  },
];

const values = [
  {
    icon: Leaf,
    title: "Purity of Leaf",
    desc: "Whole-leaf. Single-origin. No additives, no flavourings, no fillers. Just the leaf, the season, and the garden.",
  },
  {
    icon: Award,
    title: "Uncompromising Quality",
    desc: "We cup every batch before it leaves the garden. If it does not meet our standard, it simply does not come.",
  },
  {
    icon: Globe,
    title: "Radical Transparency",
    desc: "Every tea carries a garden card. Name of the estate. Harvest date. Altitude. The grower. No secrets, no blends.",
  },
  {
    icon: Heart,
    title: "Made With Care",
    desc: "Tea is a ritual of wellbeing. We source, pack, and ship with care because we believe it matters how things arrive.",
  },
  {
    icon: Users,
    title: "Community Investment",
    desc: "5% of all profits flow directly back to the farming communities who make our work possible. Always has. Always will.",
  },
  {
    icon: Sprout,
    title: "Living Earth",
    desc: "Regenerative farming, reforestation partnerships, and zero-waste operations — because the land is not just our supplier, it is our responsibility.",
  },
];

/* Team — all images replaced with tea/nature imagery, NO human faces */
const teamMembers = [
  {
    name: "Arjun Mehta",
    role: "Founder & Master Blender",
    origin: "Mumbai, India",
    bio: "Trained for three years with master blenders in Darjeeling's Makaibari estate. Arjun's palate and relentless pursuit of provenance are the foundation of everything we do.",
    initials: "AM",
    imageUrl:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&q=80&auto=format&fit=crop",
    fallbackUrl:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Priya Nair",
    role: "Head of India Sourcing",
    origin: "Darjeeling, India",
    bio: "Born in the foothills of the Himalayas, Priya manages our garden partnerships across Darjeeling, Assam, and the Nilgiris. She is fluent in every estate she visits.",
    initials: "PN",
    imageUrl:
      "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&q=80&auto=format&fit=crop",
    fallbackUrl:
      "https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=400&h=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Mei Lin",
    role: "International Origins",
    origin: "Fujian, China",
    bio: "Third-generation tea taster with deep relationships in Fujian, Taiwan, and Uji. Mei oversees all international sourcing and quality benchmarks.",
    initials: "ML",
    imageUrl:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=400&q=80&auto=format&fit=crop",
    fallbackUrl:
      "https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400&h=400&q=80&auto=format&fit=crop",
  },
  {
    name: "Takashi Mori",
    role: "Japan & Taiwan Liaison",
    origin: "Kyoto, Japan",
    bio: "A certified Japanese tea ceremony instructor, Takashi navigates the world of ceremonial matcha and high-mountain oolong with rare cultural insight and precision.",
    initials: "TM",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=400&q=80&auto=format&fit=crop",
    fallbackUrl:
      "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=400&h=400&q=80&auto=format&fit=crop",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] },
});

/* ─── Component ─────────────────────────────────────────────────────── */

export default function About() {
  return (
    <PageTransition>
      <div className="pt-16 lg:pt-20">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <div className="relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1464822756577-4f5d26ef5e75?w=1400&h=720&q=80&auto=format&fit=crop"
            alt="Tea garden at golden hour — origin of every cup we craft"
            className="w-full h-full object-cover object-center scale-105"
            style={{ transformOrigin: "center 60%" }}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=1400&h=720&q=80&auto=format&fit=crop";
              e.target.onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-14 md:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              >
                <span
                  className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-3"
                  style={{
                    color: "#FFF8F0",
                    textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                  }}
                >
                  Our Story
                </span>
                <h1
                  className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.15] max-w-2xl"
                  style={{
                    color: "#ffffff",
                    textShadow: "0 2px 12px rgba(0,0,0,0.75)",
                  }}
                >
                  Born in Mumbai.
                  <br />
                  <span
                    style={{
                      color: "var(--tea-gold)",
                      textShadow: "0 2px 10px rgba(0,0,0,0.6)",
                    }}
                  >
                    Grown in Darjeeling.
                  </span>
                </h1>
                <p
                  className="mt-4 text-base md:text-lg leading-relaxed max-w-xl"
                  style={{
                    color: "#FFF8F0",
                    textShadow: "0 1px 6px rgba(0,0,0,0.65)",
                  }}
                >
                  We travel to the source so you never have to wonder where your
                  tea comes from. Every leaf tells the truth.
                </p>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="absolute bottom-6 right-8 text-primary-foreground/50 text-xs tracking-widest hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            SCROLL TO EXPLORE
          </motion.div>
        </div>

        {/* ── MISSION STATEMENT ────────────────────────────────────── */}
        <SectionContainer className="bg-card border-b border-border" tight>
          <motion.div {...fadeUp()} className="max-w-3xl mx-auto text-center">
            <p className="font-display text-xl md:text-2xl lg:text-3xl font-medium text-foreground leading-relaxed">
              "We founded{" "}
              <em className="not-italic text-primary font-semibold">
                Swadistchai
              </em>{" "}
              on one belief — that from garden to cup, every leaf carries the
              soul of its origin, and every person who tends it deserves to be
              honoured."
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-border" />
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                Arjun Mehta, Founder & Master Blender
              </span>
              <div className="h-px w-12 bg-border" />
            </div>
          </motion.div>
        </SectionContainer>

        {/* ── BRAND STORY ──────────────────────────────────────────── */}
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
            <motion.div {...fadeLeft()}>
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-4">
                The Story Behind Every Cup
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground leading-tight mb-6">
                A Journey That Began
                <br />
                in the Heart of Mumbai
              </h2>
              <div className="space-y-6">
                {brandStory.map((para) => (
                  <motion.div
                    key={para.lead}
                    {...fadeUp(0.1 + brandStory.indexOf(para) * 0.1)}
                  >
                    <h3 className="font-semibold text-sm text-foreground mb-1.5">
                      {para.lead}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {para.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeRight(0.1)} className="relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-tea">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop"
                  alt="Misty tea estate rows — the origin of every cup we craft"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1597481499750-3e6b22637536?w=800&q=80&auto=format&fit=crop";
                    e.target.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
              <motion.div
                {...fadeUp(0.3)}
                className="absolute -bottom-5 -left-4 md:-left-8 bg-card border border-border rounded-xl px-5 py-4 shadow-tea"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-display text-3xl font-bold text-primary">
                      12
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Estate Partners
                    </div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <div className="font-display text-3xl font-bold text-primary">
                      5
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Countries
                    </div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="text-center">
                    <div className="font-display text-3xl font-bold text-primary">
                      2018
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Founded, Mumbai
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </SectionContainer>

        {/* ── SUSTAINABILITY ────────────────────────────────────────── */}
        <SectionContainer className="bg-primary text-primary-foreground">
          <SectionHeading
            label="Our Responsibility"
            title="Farming the Future, Not Just the Season"
            subtitle="Sustainability is not a badge we wear. It is the only way we know how to operate."
            centered
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sustainability.map(({ icon: Icon, title, desc, badge }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: i * 0.09,
                }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="relative bg-primary-foreground/10 rounded-xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/18 hover:border-accent/50 hover:shadow-[0_8px_36px_-4px_oklch(0_0_0/0.4)] transition-smooth cursor-default overflow-hidden group"
                data-ocid={`sustainability-${i}`}
              >
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-smooth bg-gradient-to-br from-accent/8 via-transparent to-accent/5 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-accent/25 flex items-center justify-center mb-4 group-hover:bg-accent/40 group-hover:scale-110 transition-smooth">
                    <Icon size={22} className="text-accent" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 mb-3">
                    <CheckCircle2
                      size={12}
                      className="text-accent flex-shrink-0"
                    />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-accent">
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-sm text-primary-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-primary-foreground/85 text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* ── HOW WE SOURCE ─────────────────────────────────────────── */}
        <SectionContainer className="bg-background">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <SectionHeading
                label="From Farm to Cup"
                title="Every Step Matters. No Step is Skipped."
                subtitle="Our sourcing process is deliberately inefficient by industry standards. We think that is exactly the point."
              />
              <motion.div
                {...fadeLeft(0.15)}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-tea"
              >
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&h=600&q=80&auto=format&fit=crop"
                  alt="Green tea garden terraces — every step of our process matters"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=800&h=600&q=80&auto=format&fit=crop";
                    e.target.onerror = null;
                  }}
                />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 gap-4 pt-0 lg:pt-14">
              {sourcingSteps.map(({ number, icon: Icon, title, desc }, i) => (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: i * 0.07,
                  }}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 bg-card rounded-xl p-5 border border-border hover:border-primary/40 hover:shadow-tea transition-smooth group"
                  data-ocid={`sourcing-step-${number}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-smooth">
                      <Icon size={18} className="text-primary" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-accent tracking-widest">
                        {number}
                      </span>
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors-smooth">
                        {title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* ── TEA REGIONS ───────────────────────────────────────────── */}
        <SectionContainer className="bg-muted/30">
          <SectionHeading
            label="Origins"
            title="Where Our Teas Are Born"
            subtitle="Six distinct landscapes. Six utterly different expressions of what tea can be."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regions.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 22,
                  delay: i * 0.08,
                }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-tea hover:border-primary/35 transition-smooth cursor-default"
                data-ocid={`region-${i}`}
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={region.image}
                    alt={region.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&q=80&auto=format&fit=crop";
                      e.target.onerror = null;
                    }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${region.tint} mix-blend-multiply`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 z-10">
                    <span className="text-3xl drop-shadow-lg">
                      {region.flag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <MapPin size={15} className="text-white/80 drop-shadow" />
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-accent">
                    {region.subtitle}
                  </span>
                  <h3 className="font-display font-semibold text-base text-foreground mt-1 mb-2 group-hover:text-primary transition-colors-smooth">
                    {region.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                    {region.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {region.teas.map((tea) => (
                      <span
                        key={tea}
                        className="text-[10px] px-2 py-0.5 bg-primary/8 text-primary rounded-full font-medium border border-primary/15 group-hover:bg-primary/15 transition-smooth"
                      >
                        {tea}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* ── VALUES ───────────────────────────────────────────────── */}
        <SectionContainer className="bg-background">
          <SectionHeading
            label="What We Believe"
            title="Six Pillars. One Standard."
            subtitle="Our values are not aspirations — they are the terms under which we operate."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 22,
                  delay: i * 0.08,
                }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="group flex gap-4 bg-card rounded-xl p-6 border border-border hover:border-primary/35 hover:shadow-tea transition-smooth"
                data-ocid={`value-pillar-${i}`}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-smooth">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-foreground mb-1.5 group-hover:text-primary transition-colors-smooth">
                    {title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* ── TEAM ─────────────────────────────────────────────────── */}
        <SectionContainer className="bg-muted/30">
          <SectionHeading
            label="The People Behind the Leaves"
            title="Our Team"
            subtitle="Small by design. Expert by necessity. Every person on our team has spent years in the gardens they serve."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 22,
                  delay: i * 0.09,
                }}
                whileHover={{ y: -4, scale: 1.015 }}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-tea hover:border-primary/25 transition-smooth group"
                data-ocid={`team-member-${i}`}
              >
                {/* Tea/nature image fills top of card */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={member.imageUrl}
                    alt={`${member.name} — ${member.role}`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-smooth"
                    onError={(e) => {
                      e.target.src =
                        member.fallbackUrl ||
                        "https://images.unsplash.com/photo-1566748963551-6f5b3fc0d5e1?w=400&h=400&q=80&auto=format&fit=crop";
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {/* Initials badge overlay */}
                  <div className="absolute bottom-3 left-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold shadow-tea backdrop-blur-sm">
                      {member.initials}
                    </span>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors-smooth">
                    {member.name}
                  </h3>
                  <p className="text-[11px] font-medium text-accent mt-0.5 mb-0.5">
                    {member.role}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1 mb-3">
                    <MapPin size={10} className="flex-shrink-0" />
                    {member.origin}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <SectionContainer className="bg-card border-t border-border">
          <SectionHeading
            label="From Our Community"
            title="In Their Own Words"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                {...fadeUp(i * 0.08)}
                whileHover={{ y: -4 }}
                className="bg-background rounded-xl p-6 border border-border shadow-card hover:shadow-tea hover:border-primary/25 transition-smooth"
                data-ocid={`about-testimonial-${t.id}`}
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className="text-accent fill-accent"
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-foreground/80 italic leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* ── CLOSING CTA ────────────────────────────────────────────── */}
        <SectionContainer className="bg-primary">
          <motion.div {...fadeUp()} className="max-w-2xl mx-auto text-center">
            <Leaf className="mx-auto text-accent mb-4" size={32} />
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4 leading-tight">
              Taste What Integrity
              <br />
              Looks Like in a Cup
            </h2>
            <p className="text-primary-foreground/90 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
              Every tea we offer carries the story of the land it came from and
              the people who tended it. When you choose Swadistchai, you are
              part of that story.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/shop" data-ocid="about-shop-cta">
                <Button variant="gold" size="lg">
                  Explore Our Collection
                </Button>
              </Link>
              <Link to="/contact" data-ocid="about-contact-cta">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>
        </SectionContainer>
      </div>
    </PageTransition>
  );
}
