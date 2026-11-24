<template>
  <main id="main-content" class="main" tabindex="-1">
    <PageHero
      title="Produk Kami"
      tagline="Sistem, aplikasi, dan website siap pakai"
      desc="Semua produk dapat dikustomisasi penuh — pilih fitur yang Anda butuhkan lalu kirim order langsung ke WhatsApp kami. Harga disepakati setelah scope project jelas."
      icon="bi-box-seam"
      icon-color="#1d4ed8"
      cover="system"
    >
      <router-link :to="{ name: 'order' }" class="btn-hero-primary text-decoration-none">
        <i class="bi bi-lightning-charge me-2"></i>Order Sistem
      </router-link>
      <router-link :to="{ name: 'contact' }" class="btn-hero-outline text-decoration-none">
        <i class="bi bi-whatsapp me-2"></i>Konsultasikan Sekarang
      </router-link>
    </PageHero>

    <section class="section catalog-section">
      <div class="container">
        <!-- Toolbar katalog: judul + filter kategori -->
        <div class="catalog-toolbar" data-aos="fade-up">
          <div class="catalog-toolbar-copy">
            <span class="catalog-kicker"><i class="bi bi-collection"></i>Katalog Produk</span>
            <h2 class="catalog-heading">Pilih fondasi digital bisnis Anda</h2>
            <p class="catalog-meta">
              Menampilkan <strong>{{ filteredProducts.length }}</strong> dari
              {{ products.length }} produk — semua bisa disesuaikan.
            </p>
          </div>

          <div class="catalog-filters" role="group" aria-label="Filter kategori produk">
            <button
              v-for="cat in filterTabs"
              :key="cat.key"
              type="button"
              class="filter-btn"
              :class="{ 'is-active': activeCategory === cat.key }"
              :aria-pressed="activeCategory === cat.key"
              @click="activeCategory = cat.key"
            >
              <i class="bi" :class="cat.icon"></i>
              <span>{{ cat.label }}</span>
              <span class="filter-count">{{ cat.count }}</span>
            </button>
          </div>
        </div>

        <!-- Grid produk -->
        <div :key="activeCategory" class="row gy-4 catalog-grid">
          <div
            v-for="(product, index) in filteredProducts"
            :key="product.slug"
            class="col-xl-4 col-md-6 d-flex catalog-card"
            :style="{ '--i': index }"
          >
            <ProductCard :product="product" />
          </div>
        </div>

        <div v-if="!filteredProducts.length" class="catalog-empty">
          <i class="bi bi-inboxes"></i>
          <p>Belum ada produk di kategori ini.</p>
        </div>

        <!-- CTA bawah -->
        <div class="row mt-5">
          <div class="col-12">
            <CtaBanner
              title="Butuh sistem yang benar-benar custom?"
              desc="Semua produk di atas dapat dikustomisasi — modul tambahan, integrasi pihak ketiga, hingga migrasi data dari sistem lama Anda."
            >
              <router-link :to="{ name: 'order' }" class="btn-hero-primary text-decoration-none">
                <i class="bi bi-ui-checks-grid me-2"></i>Pilih Fitur &amp; Order
              </router-link>
            </CtaBanner>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import PageHero from "@/components/ui/PageHero.vue"
import ProductCard from "@/components/ui/ProductCard.vue"
import CtaBanner from "@/components/ui/CtaBanner.vue"
import { usePageSeo } from "@/composables/usePageSeo"
import { siteData } from "@/data/siteData"

export default {
  name: "ProductsView",
  components: { PageHero, ProductCard, CtaBanner },
  setup() {
    usePageSeo({
      title: `Produk Kami — ${siteData.seo.name}`,
      description: siteData.catalogPage.subtitle,
      path: "/products",
    })
  },
  data() {
    return {
      categories: siteData.categories,
      products: siteData.products,
      activeCategory: "all",
    }
  },
  computed: {
    filterTabs() {
      const icons = { all: "bi-grid", system: "bi-diagram-3", website: "bi-window" }
      const countFor = (key) =>
        key === "all" ? this.products.length : this.products.filter((p) => p.category === key).length

      return [
        { key: "all", label: "Semua", icon: icons.all, count: countFor("all") },
        ...this.categories.map((c) => ({
          ...c,
          icon: icons[c.key] || "bi-tag",
          count: countFor(c.key),
        })),
      ]
    },
    filteredProducts() {
      if (this.activeCategory === "all") return this.products
      return this.products.filter((p) => p.category === this.activeCategory)
    },
  },
}
</script>

<style scoped>
.catalog-section {
  position: relative;
  background:
    radial-gradient(ellipse at 90% 0%, rgba(0, 32, 93, 0.06), transparent 42%),
    linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%);
}

/* ---------- Toolbar katalog ---------- */
.catalog-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
  margin-bottom: 30px;
  padding: 24px 26px;
  border: 1px solid rgba(0, 32, 93, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 12px 34px rgba(0, 32, 93, 0.06);
  backdrop-filter: blur(8px);
}

.catalog-toolbar-copy {
  max-width: 520px;
}

.catalog-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #1d4ed8;
}

.catalog-kicker i {
  font-size: 0.9rem;
}

.catalog-heading {
  margin: 0 0 7px;
  font-size: clamp(1.3rem, 2.4vw, 1.65rem);
  font-weight: 700;
  line-height: 1.25;
  color: var(--heading-color);
}

.catalog-meta {
  margin: 0;
  font-size: 0.86rem;
  color: color-mix(in srgb, var(--default-color), transparent 12%);
}

.catalog-meta strong {
  color: #00205d;
}

/* Filter pill */
.catalog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 5px;
  border: 1px solid rgba(0, 32, 93, 0.09);
  border-radius: 16px;
  background: #f3f6fb;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border: 1px solid transparent;
  border-radius: 11px;
  background: transparent;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.filter-btn i {
  font-size: 0.9rem;
  opacity: 0.8;
}

.filter-btn:hover {
  color: #00205d;
  background: rgba(255, 255, 255, 0.7);
}

.filter-btn.is-active {
  color: #fff;
  background: linear-gradient(135deg, #00205d, #1d4ed8);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 18px rgba(0, 32, 93, 0.2);
}

.filter-btn.is-active i {
  opacity: 1;
}

.filter-count {
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(0, 32, 93, 0.07);
  font-size: 0.68rem;
  font-weight: 700;
  text-align: center;
}

.filter-btn.is-active .filter-count {
  background: rgba(255, 255, 255, 0.22);
}

/* ---------- Grid & animasi masuk ---------- */
.catalog-card {
  animation: catalogCardIn 0.45s ease both;
  animation-delay: calc(var(--i, 0) * 55ms);
}

@keyframes catalogCardIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.catalog-empty {
  padding: 54px 20px;
  text-align: center;
  color: color-mix(in srgb, var(--default-color), transparent 22%);
}

.catalog-empty i {
  font-size: 2.2rem;
  color: #94a3b8;
}

.catalog-empty p {
  margin: 10px 0 0;
}

@media (max-width: 991.98px) {
  .catalog-toolbar {
    align-items: flex-start;
    padding: 20px;
  }

  .catalog-filters {
    width: 100%;
  }
}

@media (max-width: 575.98px) {
  .catalog-toolbar {
    padding: 18px;
    border-radius: 16px;
  }

  .filter-btn {
    flex: 1 1 auto;
    justify-content: center;
    padding: 8px 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .catalog-card {
    animation: none;
  }

  .filter-btn {
    transition: none;
  }
}
</style>
