<template>
  <main id="main-content" class="main" tabindex="-1">
    <PageHero
      title="Jasa Pembuatan Website di Depok"
      tagline="Website profesional, cepat, dan siap dipakai bisnis Anda"
      desc="Kafeinarts melayani jasa bikin web untuk UMKM, perusahaan, klinik, sekolah, dan instansi di Depok, Bogor, Bekasi, Jakarta, serta seluruh Indonesia. Dari company profile, landing page, toko online, hingga sistem web custom."
      icon="bi-code-slash"
      icon-color="#0e7490"
      cover="grid"
      :breadcrumbs="breadcrumbs"
    >
      <router-link :to="{ name: 'contact' }" class="btn-hero-primary text-decoration-none">
        <i class="bi bi-whatsapp me-2"></i>Konsultasi Gratis
      </router-link>
      <router-link :to="{ name: 'products' }" class="btn-hero-outline text-decoration-none">
        <i class="bi bi-box-seam me-2"></i>Lihat Paket Website
      </router-link>
    </PageHero>

    <section class="section">
      <div class="container">
        <SectionHeading
          title="Jasa pembuatan website yang rapi, cepat, dan berdampak"
          subtitle="Satu tim untuk desain, development, database, hingga deployment"
        />
        <div class="row gy-4">
          <div v-for="item in highlights" :key="item.title" class="col-md-6 col-xl-3 d-flex">
            <FeatureCard v-bind="item" color="#00205D" />
          </div>
        </div>
      </div>
    </section>

    <section class="section light-background">
      <div class="container">
        <SectionHeading
          title="Jenis website yang kami buat"
          subtitle="Disesuaikan dengan kebutuhan dan budget Anda"
        />
        <div class="row gy-4">
          <div v-for="item in packages" :key="item.title" class="col-md-6 col-lg-4 d-flex">
            <article class="service-card h-100 w-100">
              <div class="service-icon"><i class="bi" :class="item.icon"></i></div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
              <router-link :to="item.to" class="service-link">
                {{ item.linkLabel }} <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <SectionHeading title="Alur pembuatan website" subtitle="Transparan dari awal sampai go-live" />
        <div class="row gy-4">
          <div v-for="(step, i) in steps" :key="step.title" class="col-md-6 col-xl-3 d-flex">
            <article class="process-card h-100 w-100">
              <span class="process-step">0{{ i + 1 }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section light-background">
      <div class="container">
        <SectionHeading
          title="Pertanyaan yang sering ditanyakan"
          subtitle="Seputar jasa pembuatan website di Depok dan sekitarnya"
        />
        <div class="faq-list">
          <details v-for="item in faqs" :key="item.q" class="faq-item">
            <summary>{{ item.q }}</summary>
            <p>{{ item.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <section class="section pt-0">
      <div class="container">
        <CtaBanner
          title="Butuh jasa bikin web di Depok?"
          desc="Ceritakan kebutuhan Anda. Kami berikan saran teknis, estimasi biaya, dan timeline yang jelas — tanpa biaya konsultasi."
        >
          <router-link :to="{ name: 'contact' }" class="btn-hero-primary text-decoration-none">
            <i class="bi bi-whatsapp me-2"></i>Hubungi Kami
          </router-link>
          <router-link :to="{ name: 'order' }" class="btn-hero-outline text-decoration-none">
            <i class="bi bi-cart-check me-2"></i>Order Website
          </router-link>
        </CtaBanner>
      </div>
    </section>
  </main>
</template>

<script>
import PageHero from "@/components/ui/PageHero.vue"
import SectionHeading from "@/components/ui/SectionHeading.vue"
import FeatureCard from "@/components/ui/FeatureCard.vue"
import CtaBanner from "@/components/ui/CtaBanner.vue"
import { usePageSeo } from "@/composables/usePageSeo"

const SEO = {
  title: "Jasa Pembuatan Website Depok — Kafeinarts",
  description:
    "Butuh jasa pembuatan website di Depok? Kafeinarts membuat website company profile, landing page, toko online, dan sistem web custom dengan Laravel, Vue.js, React & Next.js. Konsultasi gratis.",
  keywords:
    "jasa pembuatan website depok, jasa pembuatan website, jasa bikin web, jasa web depok, pembuatan website depok, web developer depok, jasa website depok, company profile depok, landing page depok, pembuatan website bogor, pembuatan website bekasi",
  path: "/jasa-pembuatan-website-depok",
  image: "assets/img/og-image.png",
  imageAlt: "Jasa Pembuatan Website di Depok — Kafeinarts",
}

export default {
  name: "WebsiteServiceView",
  components: { PageHero, SectionHeading, FeatureCard, CtaBanner },
  setup() {
    usePageSeo(SEO)
  },
  data() {
    return {
      breadcrumbs: [
        { label: "Beranda", to: { name: "home" } },
        { label: "Jasa Pembuatan Website", to: { name: "website-service-depok" } },
      ],
      highlights: [
        {
          title: "Desain responsif",
          desc: "Tampilan rapi di HP, tablet, dan desktop. Fokus pada kenyamanan pengunjung dan konversi.",
          icon: "bi-phone",
          delay: 0,
        },
        {
          title: "Stack modern",
          desc: "Laravel, PHP, Vue.js, Quasar, React, dan Next.js untuk hasil yang cepat dan mudah dikembangkan.",
          icon: "bi-code-square",
          delay: 80,
        },
        {
          title: "SEO & performa",
          desc: "Struktur halaman ramah crawler, metadata lengkap, dan optimasi kecepatan sejak awal.",
          icon: "bi-search",
          delay: 160,
        },
        {
          title: "Support & garansi",
          desc: "Pendampingan setelah peluncuran, revisi transparan, dan perawatan sesuai kebutuhan.",
          icon: "bi-shield-check",
          delay: 240,
        },
      ],
      packages: [
        {
          title: "Website Company Profile",
          desc: "Website perusahaan yang menampilkan layanan, portofolio, tim, dan kontak dengan tampilan profesional.",
          icon: "bi-building",
          to: { name: "product-company-profile" },
          linkLabel: "Lihat detail paket",
        },
        {
          title: "Landing Page",
          desc: "Halaman kampanye yang ringan, cepat, dan dioptimalkan untuk konversi serta iklan.",
          icon: "bi-layout-text-window",
          to: { name: "product-landing-page" },
          linkLabel: "Lihat detail paket",
        },
        {
          title: "Toko Online & POS",
          desc: "Katalog produk, keranjang, pembayaran, dan kasir terintegrasi untuk bisnis retail dan F&B.",
          icon: "bi-cart3",
          to: { name: "product-point-of-sale" },
          linkLabel: "Lihat detail paket",
        },
        {
          title: "Sistem Web Custom",
          desc: "ERP, CRM, LMS, SIMRS, dan sistem internal lain dibangun sesuai alur kerja bisnis Anda.",
          icon: "bi-diagram-3",
          to: { name: "products" },
          linkLabel: "Jelajahi produk",
        },
        {
          title: "Integrasi & API",
          desc: "Payment gateway, WhatsApp, SATUSEHAT, dan integrasi pihak ketiga lainnya.",
          icon: "bi-plug",
          to: { name: "services" },
          linkLabel: "Lihat layanan",
        },
        {
          title: "Maintenance & Upgrade",
          desc: "Perbaikan bug, pembaruan fitur, backup, dan monitoring setelah website tayang.",
          icon: "bi-tools",
          to: { name: "contact" },
          linkLabel: "Diskusikan kebutuhan",
        },
      ],
      steps: [
        { title: "Konsultasi", desc: "Kami dengarkan kebutuhan, target audiens, dan fitur yang dibutuhkan." },
        { title: "Desain & Struktur", desc: "Wireframe, desain UI, serta struktur konten dan SEO disiapkan." },
        { title: "Development", desc: "Frontend, backend, database, dan integrasi dikerjakan end-to-end." },
        { title: "Uji & Tayang", desc: "Testing, perbaikan, deploy, dan pendampingan pasca peluncuran." },
      ],
      faqs: [
        {
          q: "Berapa biaya jasa pembuatan website di Depok?",
          a: "Biaya tergantung jenis dan kompleksitas website. Landing page dan company profile mulai dari paket terjangkau, sedangkan sistem seperti ERP, LMS, atau SIMRS dihitung per modul. Konsultasi dan penawaran resmi selalu gratis.",
        },
        {
          q: "Berapa lama pengerjaan website?",
          a: "Website company profile dan landing page umumnya selesai dalam 1–3 minggu. Sistem yang lebih kompleks seperti ERP atau SIMRS membutuhkan 3–8 minggu tergantung fitur dan integrasi.",
        },
        {
          q: "Apakah bisa dibuatkan website untuk area luar Depok?",
          a: "Ya. Kami melayani onsite di Depok, Bogor, Bekasi, Jakarta, dan sekitarnya, serta melayani klien dari seluruh Indonesia secara remote.",
        },
        {
          q: "Teknologi apa yang digunakan?",
          a: "Backend memakai Laravel/PHP dan MySQL. Frontend memakai Vue.js, Quasar, React, atau Next.js. Kami juga mengerjakan REST API, PWA, Docker, CI/CD, serta integrasi payment gateway dan autentikasi.",
        },
      ],
    }
  },
}
</script>

<style scoped>
.service-card,
.process-card {
  background: var(--surface-color);
  border: 1px solid color-mix(in srgb, var(--default-color), transparent 92%);
  border-radius: 14px;
  padding: 26px 22px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover,
.process-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 32px rgba(0, 32, 93, 0.1);
}

.service-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--accent-color), transparent 90%);
  color: var(--accent-color);
  margin-bottom: 14px;
}

.service-icon i {
  font-size: 22px;
}

.service-card h3,
.process-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.service-card p,
.process-card p {
  font-size: 0.92rem;
  margin-bottom: 14px;
}

.service-link {
  color: var(--accent-color);
  font-weight: 600;
  text-decoration: none;
}

.process-card {
  position: relative;
}

.process-step {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 1.8rem;
  font-weight: 800;
  color: color-mix(in srgb, var(--accent-color), transparent 85%);
}

.faq-list {
  max-width: 860px;
  margin: 0 auto;
}

.faq-item {
  background: var(--surface-color);
  border: 1px solid color-mix(in srgb, var(--default-color), transparent 92%);
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 16px 20px;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 700;
  color: var(--heading-color);
}

.faq-item p {
  margin: 12px 0 0;
  font-size: 0.95rem;
}
</style>
