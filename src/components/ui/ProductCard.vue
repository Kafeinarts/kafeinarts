<template>
  <!-- ProductCard: kartu produk di katalog (reusable) -->
  <router-link :to="productRoute" class="product-card-link text-decoration-none">
    <article class="product-card h-100" :style="{ '--product-accent': product.color }">
      <!-- Cover: warna produk + ikon besar sebagai aksen, ikon utama menimpa body -->
      <div class="product-card-cover">
        <span class="product-card-orbit" aria-hidden="true"></span>
        <i class="bi product-card-watermark" :class="product.icon" aria-hidden="true"></i>

        <div class="product-card-badges">
          <span class="product-card-category">{{ categoryLabel }}</span>
          <span v-if="hasDemo" class="product-card-demo">
            <i class="bi bi-play-circle-fill"></i>Demo
          </span>
        </div>
      </div>

      <div class="product-card-body">
        <span class="product-card-icon" aria-hidden="true">
          <i class="bi" :class="product.icon"></i>
        </span>

        <h3>{{ product.name }}</h3>
        <p class="product-card-tagline">{{ product.tagline }}</p>
        <p class="product-card-desc">{{ product.desc }}</p>

        <ul v-if="highlights.length" class="product-card-highlights" aria-label="Sorotan produk">
          <li v-for="item in highlights" :key="item">
            <i class="bi bi-check2"></i>{{ item }}
          </li>
        </ul>

        <!-- Harga sengaja tidak ditampilkan — disepakati setelah diskusi scope. -->
        <div class="product-card-footer">
          <p class="product-card-price-note">
            <i class="bi bi-chat-dots"></i>Harga sesuai scope
          </p>
          <span class="product-card-cta">
            Detail <i class="bi bi-arrow-up-right"></i>
          </span>
        </div>
      </div>
    </article>
  </router-link>
</template>

<script>
const CATEGORY_LABELS = {
  system: "Sistem & Aplikasi",
  website: "Website",
}

export default {
  name: "ProductCard",
  props: {
    product: { type: Object, required: true },
  },
  computed: {
    productRoute() {
      return { name: `product-${this.product.slug}` }
    },
    categoryLabel() {
      return CATEGORY_LABELS[this.product.category] || "Produk Digital"
    },
    hasDemo() {
      return Boolean(this.product.is_demo && this.product.url_demo)
    },
    highlights() {
      const items = (this.product.hero && this.product.hero.highlights) || []
      return items.slice(0, 3)
    },
  },
}
</script>

<style scoped>
.product-card-link {
  display: block;
  height: 100%;
  border-radius: 20px;
}

.product-card {
  --product-accent: #00205d;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface-color);
  border: 1px solid color-mix(in srgb, var(--default-color), transparent 91%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 32, 93, 0.04);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.product-card:hover {
  transform: translateY(-7px);
  border-color: color-mix(in srgb, var(--product-accent), transparent 62%);
  box-shadow: 0 22px 48px rgba(0, 32, 93, 0.16);
}

.product-card-link:focus-visible {
  outline: none;
}
.product-card-link:focus-visible .product-card {
  outline: 3px solid color-mix(in srgb, var(--product-accent), transparent 35%);
  outline-offset: 3px;
}

/* ---------- Cover berwarna ---------- */
.product-card-cover {
  position: relative;
  min-height: 104px;
  padding: 16px 18px;
  background:
    radial-gradient(circle at 82% 12%, rgba(255, 255, 255, 0.22), transparent 34%),
    linear-gradient(135deg, var(--product-accent), color-mix(in srgb, var(--product-accent), #00205d 68%));
  overflow: hidden;
}

.product-card-orbit {
  position: absolute;
  top: -46px;
  right: 34px;
  width: 132px;
  height: 132px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  pointer-events: none;
}

.product-card-orbit::after {
  content: "";
  position: absolute;
  inset: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
}

.product-card-watermark {
  position: absolute;
  right: 8px;
  bottom: -22px;
  font-size: 108px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.13);
  transform: rotate(-8deg);
  transition: transform 0.45s ease, color 0.45s ease;
  pointer-events: none;
}

.product-card:hover .product-card-watermark {
  transform: rotate(-2deg) scale(1.06);
  color: rgba(255, 255, 255, 0.2);
}

.product-card-badges {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding-right: 64px;
}

.product-card-category,
.product-card-demo {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.26);
  backdrop-filter: blur(4px);
}

.product-card-demo {
  background: rgba(255, 255, 255, 0.94);
  border-color: transparent;
  color: #0a7a4b;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.7rem;
}

.product-card-demo i {
  font-size: 0.78rem;
}

/* Ikon utama: menimpa batas cover dan body */
.product-card-icon {
  position: absolute;
  top: -25px;
  left: 22px;
  z-index: 2;
  width: 58px;
  height: 58px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-color);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 10px 24px rgba(0, 32, 93, 0.2);
}

.product-card-icon i {
  font-size: 27px;
  color: var(--product-accent);
}

/* ---------- Isi kartu ---------- */
.product-card-body {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 40px 22px 20px;
}

.product-card h3 {
  font-size: 1.18rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 5px;
}

.product-card-tagline {
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.45;
  color: color-mix(in srgb, var(--product-accent), #00205d 30%);
  margin-bottom: 10px;
}

.product-card-desc {
  font-size: 0.86rem;
  line-height: 1.62;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
}

.product-card-highlights li {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 4px 8px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--product-accent), transparent 93%);
  border: 1px solid color-mix(in srgb, var(--product-accent), transparent 86%);
  color: color-mix(in srgb, var(--product-accent), #1e293b 35%);
  font-size: 0.69rem;
  font-weight: 600;
  line-height: 1.3;
}

.product-card-highlights li i {
  flex-shrink: 0;
  font-size: 0.74rem;
  color: var(--product-accent);
}

/* ---------- Footer ---------- */
.product-card-footer {
  margin-top: auto;
  padding-top: 13px;
  border-top: 1px dashed color-mix(in srgb, var(--default-color), transparent 86%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.product-card-price-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: color-mix(in srgb, var(--default-color), transparent 12%);
  margin: 0;
}

.product-card-price-note i {
  font-size: 0.82rem;
  color: var(--product-accent);
}

.product-card-cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.78rem;
  color: var(--product-accent);
  transition: gap 0.3s ease;
}

.product-card-cta i {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.product-card:hover .product-card-cta {
  gap: 8px;
}

.product-card:hover .product-card-cta i {
  transform: translate(1px, -1px);
}

@media (max-width: 575.98px) {
  .product-card-cover {
    min-height: 96px;
  }

  .product-card-body {
    padding: 38px 18px 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-card-watermark,
  .product-card-cta,
  .product-card-cta i {
    transition: none;
  }

  .product-card:hover {
    transform: none;
  }
}
</style>
