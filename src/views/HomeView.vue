<template>
  <main id="main-content" class="nx-home js-reveal" tabindex="-1">
    <!-- Latar: mesh glow + grid halus -->
    <div class="nx-bg" aria-hidden="true">
      <span class="nx-glow nx-glow-a"></span>
      <span class="nx-glow nx-glow-b"></span>
      <span class="nx-grid-lines"></span>
    </div>

    <!-- ================= HERO ================= -->
    <section class="nx-hero">
      <div class="nx-container nx-hero-grid">
        <div class="nx-hero-copy">
          <div class="nx-topline nx-reveal">
            <span class="nx-status"><i></i>{{ $t("home.heroBadge") }}</span>
            <span class="nx-mono nx-dim">{{ $t("home.heroIndex") }}</span>
          </div>

          <h1 class="nx-display nx-reveal" style="--nx-delay: 0.05s">
            <span>{{ $t("home.heroLine1") }}</span>
            <span class="nx-gradient">{{ $t("home.heroLine2") }}</span>
          </h1>

          <div class="nx-type-line nx-reveal" style="--nx-delay: 0.08s">
            <span class="nx-mono">{{ $t("home.heroLine3Prefix") }}</span>
            <em class="nx-type">{{ typedText }}</em>
          </div>

          <p class="nx-lead nx-reveal" style="--nx-delay: 0.1s" v-html="$t('home.heroDesc')"></p>

          <div class="nx-actions nx-reveal" style="--nx-delay: 0.15s">
            <router-link :to="{ name: 'order' }" class="nx-btn nx-btn-primary">
              {{ $t("home.startOrder") }} <i class="bi bi-arrow-up-right"></i>
            </router-link>
            <router-link :to="{ name: 'products' }" class="nx-btn nx-btn-outline">
              <i class="bi bi-grid"></i> {{ $t("home.browseCatalog") }}
            </router-link>
          </div>

          <ul class="nx-trust nx-reveal" style="--nx-delay: 0.2s">
            <li v-for="item in trustItems" :key="item"><i class="bi bi-check2"></i>{{ $t(item) }}</li>
          </ul>
        </div>

        <!-- Identitas brand: pakai logo asli, tanpa three.js / canvas 3D. -->
        <div class="nx-hero-visual nx-reveal" style="--nx-delay: 0.12s">
          <div class="nx-brand-stage">
            <div class="nx-stage-grid" aria-hidden="true"></div>
            <div class="nx-orbit nx-orbit-a" aria-hidden="true"></div>
            <div class="nx-orbit nx-orbit-b" aria-hidden="true"></div>
            <div class="nx-scan-line" aria-hidden="true"></div>

            <div class="nx-brand-card">
              <div class="nx-brand-card-top">
                <span class="nx-mono">{{ $t("home.visualLabel") }}</span>
                <span class="nx-live"><i></i>LIVE</span>
              </div>

              <div class="nx-logo-core">
                <span class="nx-logo-glow" aria-hidden="true"></span>
                <img :src="heroLogo" alt="Kafeinarts Interactive" class="nx-hero-logo" />
              </div>

              <div class="nx-brand-card-foot">
                <span class="nx-mono">{{ $t("home.visualStatus") }}</span>
                <span class="nx-chip-row">
                  <i class="bi bi-box-seam"></i>{{ $t("home.visualProducts") }}
                </span>
              </div>
            </div>

            <div class="nx-stage-chip nx-stage-chip-a">
              <i class="bi bi-lightning-charge-fill"></i>
              <span>{{ $t("home.visualTag1") }}</span>
            </div>
            <div class="nx-stage-chip nx-stage-chip-b">
              <b>{{ pad(products.length) }}</b>
              <span>{{ $t("home.visualTag2") }}</span>
            </div>
            <div class="nx-stage-chip nx-stage-chip-c">
              <i class="bi bi-shield-check"></i>
              <span>{{ $t("home.visualTag3") }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= MARQUEE ================= -->
    <div class="nx-marquee" aria-hidden="true">
      <div class="nx-marquee-inner">{{ $t("home.ticker") }}&nbsp;&nbsp;{{ $t("home.ticker") }}</div>
    </div>

    <!-- ================= ABOUT / STATS ================= -->
    <section id="about" class="nx-section nx-about">
      <div class="nx-container nx-about-grid">
        <div class="nx-sec-head nx-reveal">
          <span class="nx-eyebrow"><b>01</b>{{ $t("home.aboutKicker") }}</span>
          <h2 class="nx-h2">{{ $t("home.aboutTitle") }}</h2>
          <p class="nx-text">{{ $t("home.aboutDesc") }}</p>
          <router-link :to="{ name: 'about' }" class="nx-link">
            {{ $t("home.aboutMore") }} <i class="bi bi-arrow-up-right"></i>
          </router-link>
        </div>

        <div class="nx-stat-grid">
          <article
            v-for="(stat, i) in stats"
            :key="stat.key"
            class="nx-stat nx-reveal"
            :style="{ '--nx-delay': `${i * 0.08}s` }"
          >
            <span class="nx-stat-bar"></span>
            <b>{{ pad(stat.value) }}</b>
            <span>{{ $t(stat.key) }}</span>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= KATALOG ================= -->
    <section id="products" class="nx-section nx-catalog">
      <div class="nx-container">
        <div class="nx-catalog-head nx-reveal">
          <div>
            <span class="nx-eyebrow"><b>02</b>{{ $t("home.catalogKicker") }}</span>
            <h2 class="nx-h2">{{ $t("home.catalogTitle") }}</h2>
            <p class="nx-text">{{ $t("home.catalogDesc") }}</p>
          </div>
          <div class="nx-filter">
            <span class="nx-mono nx-dim">[ {{ $t("home.filterLabel") }} ]</span>
            <div class="nx-tabs">
              <button
                v-for="tab in filterTabs"
                :key="tab.key"
                type="button"
                class="nx-tab"
                :class="{ active: activeFilter === tab.key }"
                @click="activeFilter = tab.key"
              >
                {{ $t(tab.i18n) }} <span>{{ countFor(tab.key) }}</span>
              </button>
            </div>
            <span class="nx-mono nx-price">{{ $t("home.filterNote") }}: <b>{{ $t("home.filterNoteValue") }}</b></span>
          </div>
        </div>

        <div v-if="filteredProducts.length" class="nx-grid">
          <article
            v-for="(product, i) in filteredProducts"
            :key="product.slug"
            class="nx-card nx-reveal"
            :class="{ 'nx-card--featured': isFeatured(product) }"
            :style="{ '--nx-delay': `${Math.min(i, 8) * 0.05}s` }"
          >
            <div class="nx-card-top">
              <span v-if="isFeatured(product)" class="nx-badge"><i class="bi bi-stars"></i>{{ $t("home.featuredBadge") }}</span>
              <span v-else class="nx-icon"><i class="bi" :class="product.icon"></i></span>
              <span class="nx-num">{{ pad(productIndex(product) + 1) }}</span>
            </div>

            <span class="nx-cat">// {{ categoryLabel(product) }}</span>
            <h3>{{ isFeatured(product) ? product.name : product.shortName }}</h3>
            <p class="nx-tagline">{{ product.tagline }}</p>

            <ul v-if="chips(product).length" class="nx-chips">
              <li v-for="chip in chips(product)" :key="chip">{{ chip }}</li>
            </ul>

            <div class="nx-card-foot">
              <router-link :to="detailRoute(product)" class="nx-detail">{{ $t("home.cardDetail") }}</router-link>
              <router-link :to="orderRoute(product)" class="nx-order">{{ $t("home.cardOrder") }} <i class="bi bi-arrow-up-right"></i></router-link>
            </div>
          </article>
        </div>

        <div v-else class="nx-empty">{{ $t("home.emptyProducts") }}</div>

        <div class="nx-catalog-foot nx-reveal">
          <router-link :to="{ name: 'products' }" class="nx-btn nx-btn-outline">
            {{ $t("common.viewAllProducts") }} <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ================= ALUR KERJA ================= -->
    <section id="process" class="nx-section nx-flow">
      <div class="nx-container">
        <div class="nx-sec-head nx-sec-head--wide nx-reveal">
          <div>
            <span class="nx-eyebrow"><b>03</b>{{ $t("home.flowKicker") }}</span>
            <h2 class="nx-h2">{{ $t("home.flowTitle") }}</h2>
          </div>
          <p class="nx-text">{{ $t("home.flowDesc") }}</p>
        </div>

        <div class="nx-flow-grid">
          <article
            v-for="(step, i) in workflow"
            :key="step.step"
            class="nx-step nx-reveal"
            :style="{ '--nx-delay': `${i * 0.07}s` }"
          >
            <span class="nx-step-no">{{ pad(step.step) }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= KAPABILITAS ================= -->
    <section id="services" class="nx-section nx-services">
      <div class="nx-container">
        <div class="nx-sec-head nx-sec-head--wide nx-reveal">
          <div>
            <span class="nx-eyebrow"><b>04</b>{{ $t("home.servicesKicker") }}</span>
            <h2 class="nx-h2">{{ $t("home.servicesTitle") }}</h2>
          </div>
          <p class="nx-text">{{ $t("home.servicesDesc") }}</p>
        </div>

        <div class="nx-service-grid">
          <article
            v-for="(service, i) in services"
            :key="service.title"
            class="nx-service nx-reveal"
            :style="{ '--nx-delay': `${i * 0.06}s` }"
          >
            <span class="nx-service-icon"><i class="bi" :class="service.icon"></i></span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.desc }}</p>
            <i class="bi bi-arrow-up-right nx-service-arrow"></i>
          </article>
        </div>
      </div>
    </section>

    <!-- ================= FAQ ================= -->
    <section class="nx-section nx-faq">
      <div class="nx-container nx-faq-grid">
        <div class="nx-faq-intro nx-reveal">
          <span class="nx-eyebrow"><b>05</b>{{ $t("home.faqKicker") }}</span>
          <h2 class="nx-h2">{{ $t("home.faqTitle") }}</h2>
          <router-link :to="{ name: 'faq' }" class="nx-link">
            {{ $t("home.faqMore") }} <i class="bi bi-arrow-up-right"></i>
          </router-link>
          <div class="nx-note">
            <i class="bi bi-chat-dots"></i>
            <p>{{ $t("home.faqNote") }}</p>
          </div>
        </div>

        <div class="nx-accordion nx-reveal" style="--nx-delay: 0.08s">
          <details v-for="(item, i) in faqItems" :key="i" class="nx-acc">
            <summary><span>{{ pad(i + 1) }}</span>{{ item.q }}<i class="bi bi-plus-lg"></i></summary>
            <div class="nx-acc-body"><p v-html="item.a"></p></div>
          </details>
        </div>
      </div>
    </section>

    <!-- ================= CTA ================= -->
    <section class="nx-cta">
      <div class="nx-container">
        <div class="nx-cta-panel nx-reveal">
          <div class="nx-cta-grid" aria-hidden="true"></div>
          <div class="nx-cta-copy">
            <span class="nx-cta-kicker">{{ $t("home.ctaKicker") }}</span>
            <h2 v-html="$t('home.ctaTitle')"></h2>
            <p>{{ $t("home.ctaDesc") }}</p>
          </div>
          <div class="nx-cta-side">
            <a :href="waUrl" target="_blank" rel="noopener" class="nx-btn-dark">
              <i class="bi bi-whatsapp"></i> {{ $t("home.ctaButton") }}
            </a>
            <span class="nx-mono">{{ $t("home.ctaNote") }}</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { siteData } from "@/data/siteData"
import { getPrimaryWhatsApp, buildWaUrl } from "@/utils/whatsapp"
import { asset } from "@/utils/asset"

export default {
  name: "HomeView",
  data() {
    return {
      // Referensi array reaktif: ikut terisi saat fetch produk selesai.
      products: siteData.products,
      services: (siteData.services && siteData.services.items) || [],
      activeFilter: "all",
      filterTabs: [
        { key: "all", i18n: "home.filterAll" },
        { key: "system", i18n: "home.filterSystem" },
        { key: "website", i18n: "home.filterWebsite" },
      ],
      trustItems: ["home.trust1", "home.trust2", "home.trust3"],
      typedText: "",
      wordIndex: 0,
      charIndex: 0,
      deleting: false,
      typeTimer: null,
      revealObserver: null,
      reducedMotion: false,
    }
  },
  computed: {
    heroLogo() {
      // Logo yang sama dengan identitas brand di header/navbar.
      return asset(siteData.brand.logo)
    },
    filteredProducts() {
      if (this.activeFilter === "all") return this.products
      return this.products.filter((product) => product.category === this.activeFilter)
    },
    typewriterWords() {
      const words = this.$t("home.typewriterWords")
      return Array.isArray(words) && words.length ? words : [this.$t("home.heroLine3Accent")]
    },
    workflow() {
      const timeline = siteData.about && siteData.about.timeline
      return (timeline && timeline.steps) || []
    },
    stats() {
      return [
        { key: "home.statSystems", value: this.products.filter((p) => p.category === "system").length },
        { key: "home.statWebsites", value: this.products.filter((p) => p.category === "website").length },
        { key: "home.statProjects", value: this.products.length },
      ]
    },
    faqItems() {
      const items = this.$t("faq.items")
      return Array.isArray(items) ? items.slice(0, 3) : []
    },
    waUrl() {
      const wa = getPrimaryWhatsApp()
      return buildWaUrl(wa.wa, this.$t("home.waMessage"))
    },
  },
  watch: {
    typewriterWords() {
      this.resetTypewriter()
    },
  },
  mounted() {
    this.reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    this.resetTypewriter()
    this.$nextTick(() => this.setupReveal())
  },
  beforeUnmount() {
    clearTimeout(this.typeTimer)
    if (this.revealObserver) this.revealObserver.disconnect()
  },
  methods: {
    resetTypewriter() {
      clearTimeout(this.typeTimer)
      this.wordIndex = 0
      this.charIndex = 0
      this.deleting = false
      this.typedText = ""

      if (this.reducedMotion) {
        this.typedText = this.typewriterWords[0] || ""
        return
      }
      this.typeTimer = setTimeout(() => this.typeStep(), 420)
    },

    typeStep() {
      const word = this.typewriterWords[this.wordIndex] || ""
      if (!word) return

      if (!this.deleting) {
        this.charIndex += 1
        this.typedText = word.slice(0, this.charIndex)
        if (this.charIndex >= word.length) {
          this.deleting = true
          this.typeTimer = setTimeout(() => this.typeStep(), 1500)
          return
        }
        this.typeTimer = setTimeout(() => this.typeStep(), 62 + Math.random() * 55)
        return
      }

      this.charIndex -= 1
      this.typedText = word.slice(0, this.charIndex)
      if (this.charIndex <= 0) {
        this.deleting = false
        this.wordIndex = (this.wordIndex + 1) % this.typewriterWords.length
        this.typeTimer = setTimeout(() => this.typeStep(), 280)
        return
      }
      this.typeTimer = setTimeout(() => this.typeStep(), 34)
    },

    setupReveal() {
      const nodes = this.$el.querySelectorAll(".nx-reveal")
      if (this.reducedMotion || typeof IntersectionObserver === "undefined") {
        nodes.forEach((node) => node.classList.add("is-visible"))
        return
      }
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add("is-visible")
            this.revealObserver.unobserve(entry.target)
          })
        },
        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" },
      )
      nodes.forEach((node) => this.revealObserver.observe(node))
    },

    pad(n) {
      return String(n).padStart(2, "0")
    },
    isFeatured(product) {
      return product.slug === "simrs"
    },
    detailRoute(product) {
      return { name: `product-${product.slug}` }
    },
    orderRoute(product) {
      return { name: "order", query: { product: product.slug } }
    },
    categoryLabel(product) {
      return product.category === "system" ? this.$t("home.filterSystem") : this.$t("home.filterWebsite")
    },
    chips(product) {
      const highlights = product.hero && product.hero.highlights
      if (Array.isArray(highlights) && highlights.length) return highlights.slice(0, 4)
      const features = product.features && product.features.items
      if (Array.isArray(features)) return features.slice(0, 3).map((item) => item.title)
      return []
    },
    productIndex(product) {
      return this.products.findIndex((item) => item.slug === product.slug)
    },
    countFor(key) {
      if (key === "all") return this.products.length
      return this.products.filter((product) => product.category === key).length
    },
  },
}
</script>

<style scoped>
/* ============================================================
   MOBILE-FIRST — Neon green / Black / Blue / White
   ============================================================ */
.nx-home {
  --bg: #05070c;
  --bg-soft: #080d18;
  --panel: rgba(255, 255, 255, 0.035);
  --panel-strong: rgba(255, 255, 255, 0.06);
  --line: rgba(255, 255, 255, 0.1);
  --line-strong: rgba(255, 255, 255, 0.18);
  --acid: #c8ff2e;
  --blue: #3d7bff;
  --blue-soft: #7ea6ff;
  --white: #ffffff;
  --text: #eef2fb;
  --muted: #8d9ab4;

  position: relative;
  overflow: hidden;
  padding-top: 72px;
  background: var(--bg);
  color: var(--text);
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Latar mesh + grid */
.nx-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.nx-grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 62%);
  mask-image: linear-gradient(to bottom, #000 0%, transparent 62%);
}
.nx-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}
.nx-glow-a {
  width: 380px;
  height: 380px;
  top: -130px;
  right: -140px;
  background: radial-gradient(circle, rgba(200, 255, 46, 0.2), transparent 68%);
}
.nx-glow-b {
  width: 420px;
  height: 420px;
  top: 760px;
  left: -190px;
  background: radial-gradient(circle, rgba(61, 123, 255, 0.24), transparent 68%);
}

.nx-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 1.1rem;
}

.nx-mono {
  font-family: "SFMono-Regular", Consolas, "Courier New", monospace;
}
.nx-dim {
  color: var(--muted);
}

/* Scroll reveal */
.js-reveal .nx-reveal {
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--nx-delay, 0s);
}
.js-reveal .nx-reveal.is-visible {
  opacity: 1;
  transform: none;
}

/* ---------------- HERO ---------------- */
.nx-hero {
  position: relative;
  padding: 2rem 0 2.6rem;
}
.nx-hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.2rem;
  align-items: center;
}
.nx-topline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 0.9rem;
  margin-bottom: 1.3rem;
  border-bottom: 1px solid var(--line);
}
.nx-status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--acid);
  padding: 0.4rem 0.7rem;
  border: 1px solid rgba(200, 255, 46, 0.28);
  border-radius: 999px;
  background: rgba(200, 255, 46, 0.06);
}
.nx-status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--acid);
  box-shadow: 0 0 10px var(--acid);
  animation: nx-pulse 2s ease-in-out infinite;
}
@keyframes nx-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.75); }
}
.nx-topline .nx-mono {
  font-size: 0.62rem;
  letter-spacing: 0.12em;
}

.nx-display {
  margin: 0;
  font-size: clamp(2rem, 9.4vw, 3.3rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.05em;
  color: var(--white);
}
.nx-display > span {
  display: block;
}
.nx-gradient {
  font-size: 0.78em;
  background: linear-gradient(105deg, var(--acid) 0%, #8de8a0 38%, var(--blue-soft) 78%, var(--blue) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nx-type-line {
  margin-top: 0.6rem;
  font-size: clamp(0.95rem, 4.4vw, 1.35rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #c2cce0;
}
.nx-type {
  display: inline-block;
  min-width: 8ch;
  color: var(--acid);
  font-style: normal;
  font-weight: 600;
  white-space: nowrap;
  text-shadow: 0 0 26px rgba(200, 255, 46, 0.35);
}
.nx-type::after {
  content: "";
  display: inline-block;
  width: 0.06em;
  height: 0.82em;
  margin-left: 0.08em;
  background: var(--acid);
  vertical-align: -0.08em;
  animation: nx-caret 1s steps(1) infinite;
}
@keyframes nx-caret {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.nx-lead {
  max-width: 36rem;
  margin: 1.3rem 0 0;
  color: #a9b6cd;
  font-size: 0.88rem;
  line-height: 1.75;
}
.nx-lead :deep(b) {
  color: var(--white);
  font-weight: 600;
}

.nx-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1.6rem;
}
.nx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.78rem 1.15rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}
.nx-btn:hover {
  transform: translateY(-2px);
}
.nx-btn-primary {
  color: #05070c;
  background: linear-gradient(100deg, var(--acid) 0%, #a8ff67 55%, var(--blue-soft) 100%);
  box-shadow: 0 10px 30px rgba(200, 255, 46, 0.2);
}
.nx-btn-primary:hover {
  box-shadow: 0 14px 38px rgba(200, 255, 46, 0.34);
}
.nx-btn-outline {
  color: var(--white);
  border-color: var(--line-strong);
  background: rgba(255, 255, 255, 0.03);
}
.nx-btn-outline:hover {
  border-color: var(--acid);
  color: var(--acid);
}

.nx-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.1rem;
  list-style: none;
  padding: 0;
  margin: 1.6rem 0 0;
}
.nx-trust li {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  color: var(--muted);
}
.nx-trust i {
  color: var(--acid);
  font-size: 0.8rem;
}

/* Logo showcase — modern startup, tanpa three.js/canvas. */
.nx-hero-visual {
  position: relative;
  min-width: 0;
}
.nx-brand-stage {
  position: relative;
  display: grid;
  place-items: center;
  isolation: isolate;
  min-height: 380px;
  padding: 2.2rem 1.4rem;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  border-radius: 30px;
  background:
    radial-gradient(circle at 50% 38%, rgba(200, 255, 46, 0.16), transparent 34%),
    radial-gradient(circle at 75% 80%, rgba(61, 123, 255, 0.2), transparent 42%),
    linear-gradient(155deg, rgba(14, 22, 40, 0.94), rgba(5, 8, 14, 0.98));
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.nx-brand-stage::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05), transparent 60%);
  pointer-events: none;
}
.nx-stage-grid {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 34px 34px;
  -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 15%, transparent 72%);
  mask-image: radial-gradient(circle at 50% 50%, #000 15%, transparent 72%);
}
.nx-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgba(200, 255, 46, 0.18);
  border-radius: 50%;
  animation: nx-orbit-spin 18s linear infinite;
}
.nx-orbit::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--acid);
  box-shadow: 0 0 14px var(--acid);
}
.nx-orbit-a {
  width: 320px;
  height: 320px;
}
.nx-orbit-b {
  width: 440px;
  height: 440px;
  border-color: rgba(126, 166, 255, 0.16);
  animation-direction: reverse;
  animation-duration: 26s;
}
.nx-orbit-b::after {
  background: var(--blue-soft);
  box-shadow: 0 0 14px var(--blue-soft);
}
@keyframes nx-orbit-spin {
  to { transform: rotate(360deg); }
}
.nx-scan-line {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 8%;
  width: 84%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 255, 46, 0.65), transparent);
  box-shadow: 0 0 18px rgba(200, 255, 46, 0.35);
  animation: nx-scan 5s ease-in-out infinite;
}
@keyframes nx-scan {
  0%, 100% { transform: translateY(70px); opacity: 0; }
  20%, 80% { opacity: 0.7; }
  50% { transform: translateY(300px); opacity: 0.35; }
}
.nx-brand-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 340px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(16, 25, 45, 0.88), rgba(6, 10, 18, 0.92));
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}
.nx-brand-card-top,
.nx-brand-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
}
.nx-brand-card-top {
  border-bottom: 1px solid var(--line);
}
.nx-brand-card-foot {
  border-top: 1px solid var(--line);
}
.nx-brand-card-top .nx-mono,
.nx-brand-card-foot .nx-mono {
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  color: #9fb0cc;
  text-transform: uppercase;
}
.nx-live {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.52rem;
  letter-spacing: 0.14em;
  color: var(--acid);
}
.nx-live i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--acid);
  box-shadow: 0 0 8px var(--acid);
}
.nx-logo-core {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 240px;
  padding: 1.5rem;
}
.nx-logo-glow {
  position: absolute;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 255, 46, 0.22), transparent 68%);
  filter: blur(6px);
}
.nx-hero-logo {
  position: relative;
  z-index: 1;
  width: min(74%, 220px);
  max-height: 190px;
  object-fit: contain;
  filter: drop-shadow(0 16px 30px rgba(0, 0, 0, 0.55));
}
.nx-chip-row {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--blue-soft);
}
.nx-stage-chip {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  background: rgba(8, 13, 24, 0.86);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.42);
  font-size: 0.6rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}
.nx-stage-chip i {
  font-size: 0.9rem;
}
.nx-stage-chip b {
  font-size: 1rem;
  line-height: 1;
  color: var(--white);
}
.nx-stage-chip-a {
  top: 20%;
  left: 0.6rem;
  border-color: rgba(200, 255, 46, 0.35);
}
.nx-stage-chip-a i { color: var(--acid); }
.nx-stage-chip-b {
  right: 0.6rem;
  bottom: 24%;
  border-color: rgba(126, 166, 255, 0.35);
}
.nx-stage-chip-b b { color: var(--blue-soft); }
.nx-stage-chip-c {
  left: 8%;
  bottom: 9%;
  border-color: rgba(255, 255, 255, 0.16);
}
.nx-stage-chip-c i { color: var(--blue-soft); }

/* ---------------- MARQUEE ---------------- */
.nx-marquee {
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: 0.55rem 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: rgba(8, 13, 24, 0.7);
}
.nx-marquee-inner {
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9fb0cc;
  white-space: nowrap;
  animation: nx-marquee 30s linear infinite;
}
@keyframes nx-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* ---------------- SECTION UMUM ---------------- */
.nx-section {
  position: relative;
  z-index: 1;
  padding: 3.4rem 0;
}
.nx-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--acid);
}
.nx-eyebrow b {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 1px solid rgba(200, 255, 46, 0.3);
  background: rgba(200, 255, 46, 0.07);
  font-size: 0.58rem;
}
.nx-h2 {
  margin: 0.9rem 0 0.9rem;
  font-size: clamp(1.65rem, 7vw, 2.4rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.045em;
  color: var(--white);
}
.nx-text {
  max-width: 34rem;
  margin: 0;
  color: #9aa8c0;
  font-size: 0.85rem;
  line-height: 1.75;
}
.nx-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--blue-soft);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.2s ease, gap 0.2s ease;
}
.nx-link:hover {
  color: var(--acid);
  gap: 0.8rem;
}
.nx-sec-head--wide {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.8rem;
}

/* ---------------- ABOUT / STATS ---------------- */
.nx-about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}
.nx-stat-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
}
.nx-stat {
  position: relative;
  overflow: hidden;
  padding: 1.2rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;
}
.nx-stat:hover {
  transform: translateY(-3px);
  border-color: rgba(200, 255, 46, 0.35);
  background: var(--panel-strong);
}
.nx-stat-bar {
  position: absolute;
  top: 0;
  left: 1.2rem;
  width: 34px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--acid), var(--blue));
}
.nx-stat b {
  display: block;
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  background: linear-gradient(100deg, var(--acid), var(--blue-soft));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nx-stat > span:last-child {
  display: block;
  margin-top: 0.45rem;
  font-size: 0.66rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ---------------- KATALOG ---------------- */
.nx-catalog-head {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.4rem;
  margin-bottom: 1.8rem;
}
.nx-filter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
}
.nx-filter > .nx-mono {
  font-size: 0.6rem;
  letter-spacing: 0.16em;
}
.nx-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.nx-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--muted);
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}
.nx-tab span {
  opacity: 0.6;
}
.nx-tab:hover {
  color: var(--white);
  border-color: var(--line-strong);
}
.nx-tab.active {
  color: #05070c;
  font-weight: 700;
  border-color: transparent;
  background: linear-gradient(100deg, var(--acid), var(--blue-soft));
  box-shadow: 0 8px 24px rgba(200, 255, 46, 0.2);
}
.nx-price {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
}
.nx-price b {
  color: var(--acid);
  font-weight: 600;
}

.nx-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}
.nx-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 218px;
  padding: 1.15rem;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: linear-gradient(155deg, var(--panel-strong), var(--panel));
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.nx-card:hover {
  transform: translateY(-4px);
  border-color: rgba(200, 255, 46, 0.35);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.42);
}
.nx-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
}
.nx-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(200, 255, 46, 0.25);
  background: rgba(200, 255, 46, 0.06);
  color: var(--acid);
  font-size: 1.05rem;
}
.nx-num {
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.28);
}
.nx-cat {
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.53rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--blue-soft);
}
.nx-card h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--white);
  text-transform: uppercase;
}
.nx-tagline {
  margin: 0;
  color: var(--muted);
  font-size: 0.73rem;
  line-height: 1.5;
}
.nx-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  list-style: none;
  padding: 0;
  margin: 0.1rem 0 0;
}
.nx-chips li {
  padding: 0.18rem 0.42rem;
  border: 1px solid rgba(126, 166, 255, 0.22);
  border-radius: 6px;
  background: rgba(61, 123, 255, 0.06);
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.53rem;
  color: #b9cdf5;
}
.nx-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  padding-top: 0.7rem;
  margin-top: auto;
  border-top: 1px solid var(--line);
}
.nx-detail {
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.6rem;
  color: var(--blue-soft);
  text-decoration: none;
}
.nx-detail:hover { color: var(--acid); }
.nx-order {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.38rem 0.6rem;
  border-radius: 8px;
  background: rgba(200, 255, 46, 0.1);
  border: 1px solid rgba(200, 255, 46, 0.28);
  color: var(--acid);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}
.nx-order:hover {
  background: var(--acid);
  color: #05070c;
}
.nx-card--featured {
  border-color: rgba(200, 255, 46, 0.4);
  background:
    radial-gradient(circle at 85% 15%, rgba(200, 255, 46, 0.12), transparent 45%),
    radial-gradient(circle at 10% 90%, rgba(61, 123, 255, 0.16), transparent 50%),
    rgba(10, 16, 29, 0.9);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(200, 255, 46, 0.08);
}
.nx-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.55rem;
  border-radius: 7px;
  background: linear-gradient(100deg, var(--acid), var(--blue-soft));
  color: #05070c;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.54rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.nx-card--featured h3 {
  font-size: 1.35rem;
  color: var(--acid);
}
.nx-card--featured .nx-num {
  -webkit-text-stroke: 1px rgba(200, 255, 46, 0.6);
}
.nx-empty {
  padding: 2.5rem 1rem;
  border: 1px dashed var(--line-strong);
  border-radius: 16px;
  text-align: center;
  color: var(--muted);
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}
.nx-catalog-foot {
  display: flex;
  justify-content: center;
  margin-top: 1.8rem;
}

/* ---------------- ALUR KERJA ---------------- */
.nx-flow-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
}
.nx-step {
  display: flex;
  gap: 0.9rem;
  padding: 1.15rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
}
.nx-step-no {
  flex: 0 0 auto;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: transparent;
  background: linear-gradient(120deg, var(--acid), var(--blue));
  -webkit-background-clip: text;
  background-clip: text;
}
.nx-step h3 {
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white);
}
.nx-step p {
  margin: 0;
  font-size: 0.73rem;
  line-height: 1.6;
  color: var(--muted);
}

/* ---------------- KAPABILITAS ---------------- */
.nx-service-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
}
.nx-service {
  position: relative;
  overflow: hidden;
  padding: 1.3rem;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
  transition: transform 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}
.nx-service::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--acid), var(--blue));
  transition: width 0.35s ease;
}
.nx-service:hover {
  transform: translateY(-3px);
  border-color: rgba(126, 166, 255, 0.3);
  background: var(--panel-strong);
}
.nx-service:hover::before { width: 100%; }
.nx-service-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 0.9rem;
  border-radius: 12px;
  border: 1px solid rgba(61, 123, 255, 0.3);
  background: rgba(61, 123, 255, 0.08);
  color: var(--blue-soft);
  font-size: 1.05rem;
}
.nx-service h3 {
  margin: 0 0 0.4rem;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--white);
}
.nx-service p {
  margin: 0;
  font-size: 0.74rem;
  line-height: 1.6;
  color: var(--muted);
}
.nx-service-arrow {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  color: var(--line-strong);
  font-size: 0.8rem;
  transition: color 0.25s ease, transform 0.25s ease;
}
.nx-service:hover .nx-service-arrow {
  color: var(--acid);
  transform: translate(2px, -2px);
}

/* ---------------- FAQ ---------------- */
.nx-faq-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
.nx-note {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  margin-top: 1.6rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(61, 123, 255, 0.24);
  border-radius: 14px;
  background: rgba(61, 123, 255, 0.06);
}
.nx-note i { color: var(--blue-soft); margin-top: 0.15rem; }
.nx-note p { margin: 0; font-size: 0.73rem; line-height: 1.6; color: #b9cdf5; }
.nx-accordion {
  border-top: 1px solid var(--line);
}
.nx-acc {
  border-bottom: 1px solid var(--line);
}
.nx-acc summary {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  padding: 1rem 0;
  list-style: none;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--white);
}
.nx-acc summary::-webkit-details-marker { display: none; }
.nx-acc summary > span {
  flex: 0 0 auto;
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.6rem;
  color: var(--acid);
}
.nx-acc summary > i {
  margin-left: auto;
  color: var(--blue-soft);
  font-size: 0.75rem;
  transition: transform 0.25s ease;
}
.nx-acc[open] summary > i { transform: rotate(45deg); }
.nx-acc-body {
  overflow: hidden;
}
.nx-acc-body p {
  margin: 0 0 1rem;
  padding-left: 1.7rem;
  font-size: 0.76rem;
  line-height: 1.7;
  color: var(--muted);
}
.nx-acc-body :deep(em) { color: #c8d6ee; font-style: normal; }

/* ---------------- CTA ---------------- */
.nx-cta {
  position: relative;
  z-index: 1;
  padding: 0.5rem 0 3.4rem;
}
.nx-cta-panel {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.6rem;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background:
    radial-gradient(circle at 88% 20%, rgba(200, 255, 46, 0.5), transparent 42%),
    linear-gradient(115deg, #1d4ed8 0%, #3d7bff 45%, #6ba3ff 100%);
  box-shadow: 0 24px 70px rgba(29, 78, 216, 0.28);
}
.nx-cta-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 36px 36px;
  -webkit-mask-image: linear-gradient(to right, transparent, #000);
  mask-image: linear-gradient(to right, transparent, #000);
}
.nx-cta-copy, .nx-cta-side { position: relative; }
.nx-cta-kicker {
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}
.nx-cta-panel h2 {
  margin: 0.6rem 0 0.7rem;
  font-size: clamp(1.7rem, 7vw, 2.4rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.045em;
  color: #fff;
}
.nx-cta-panel p {
  max-width: 32rem;
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
}
.nx-cta-side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
}
.nx-btn-dark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  background: #05070c;
  color: var(--acid);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 6px 6px 0 rgba(5, 7, 12, 0.35);
  transition: transform 0.25s ease, background 0.25s ease;
}
.nx-btn-dark:hover {
  background: #0d1424;
  transform: translate(-2px, -2px);
}
.nx-cta-side .nx-mono {
  font-size: 0.54rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.75);
}

/* Focus ring */
.nx-btn:focus-visible,
.nx-link:focus-visible,
.nx-tab:focus-visible,
.nx-detail:focus-visible,
.nx-order:focus-visible,
.nx-acc summary:focus-visible,
.nx-btn-dark:focus-visible {
  outline: 2px solid var(--acid);
  outline-offset: 3px;
}

/* ============================================================
   BREAKPOINT 640px+
   ============================================================ */
@media (min-width: 640px) {
  .nx-container { padding: 0 1.4rem; }
  .nx-display { font-size: clamp(2.8rem, 7.5vw, 3.8rem); }
  .nx-lead { font-size: 0.92rem; }
  .nx-stat-grid { grid-template-columns: repeat(3, 1fr); }
  .nx-grid { grid-template-columns: repeat(2, 1fr); }
  .nx-flow-grid { grid-template-columns: repeat(2, 1fr); }
  .nx-service-grid { grid-template-columns: repeat(2, 1fr); }
  .nx-cta-panel { padding: 2rem; }
}

/* ============================================================
   BREAKPOINT 900px+
   ============================================================ */
@media (min-width: 900px) {
  .nx-home { padding-top: 84px; }
  .nx-container { padding: 0 1.5rem; }
  .nx-glow-a { width: 560px; height: 560px; top: -200px; right: -170px; }
  .nx-glow-b { width: 520px; height: 520px; top: 900px; left: -220px; }

  .nx-hero { padding: 2.6rem 0 3.4rem; }
  .nx-hero-grid {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    gap: 3rem;
  }
  .nx-topline { flex-wrap: nowrap; }
  .nx-display { font-size: clamp(3.4rem, 5.2vw, 4.8rem); }
  .nx-type-line { margin-top: 0.9rem; font-size: 1.05rem; }
  .nx-lead { margin-top: 1.5rem; font-size: 0.95rem; }
  .nx-actions { margin-top: 1.9rem; }
  .nx-hero-visual { max-width: 480px; justify-self: end; width: 100%; }
  .nx-brand-stage { min-height: 440px; }
  .nx-stage-chip-a { left: 0.6rem; }
  .nx-stage-chip-b { right: 0.6rem; }

  .nx-section { padding: 4.5rem 0; }
  .nx-h2 { font-size: clamp(2rem, 4vw, 2.9rem); }
  .nx-text { font-size: 0.9rem; }
  .nx-sec-head--wide {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: end;
    gap: 3rem;
  }

  .nx-about-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
  .nx-stat { padding: 1.5rem; }
  .nx-stat b { font-size: 2.7rem; }

  .nx-catalog-head {
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 3rem;
  }
  .nx-filter { align-items: flex-end; }
  .nx-grid { grid-template-columns: repeat(3, 1fr); }
  .nx-card { min-height: 240px; padding: 1.3rem; }
  .nx-card--featured { grid-column: span 2; }

  .nx-flow-grid { grid-template-columns: repeat(4, 1fr); }
  .nx-service-grid { grid-template-columns: repeat(4, 1fr); }

  .nx-faq-grid { grid-template-columns: 0.85fr 1.15fr; gap: 4rem; }

  .nx-cta-panel {
    grid-template-columns: 1.3fr 0.7fr;
    align-items: center;
    gap: 3rem;
    padding: 2.5rem 2.8rem;
  }
  .nx-cta-side { align-items: flex-end; text-align: right; }
  .nx-cta-panel h2 { font-size: 2.5rem; }
}

/* ============================================================
   BREAKPOINT 1200px+
   ============================================================ */
@media (min-width: 1200px) {
  .nx-display { font-size: 5.4rem; }
  .nx-grid { grid-template-columns: repeat(4, 1fr); }
}

/* ============================================================
   AKSESIBILITAS
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .js-reveal .nx-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .nx-status i, .nx-orbit, .nx-scan-line, .nx-marquee-inner, .nx-type::after { animation: none !important; }
  .nx-btn, .nx-link, .nx-tab, .nx-order, .nx-card, .nx-stat, .nx-service, .nx-btn-dark { transition: none !important; }
}
</style>


