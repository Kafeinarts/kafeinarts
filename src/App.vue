<template>
  <!-- Skip link: aksesibilitas & SEO (lewati navigasi header) -->
  <a href="#main-content" class="skip-link">{{ $t('common.skipToContent') }}</a>

  <SiteHeader />

  <router-view v-slot="{ Component }">
    <transition name="page">
      <component :is="Component" :key="$route.fullPath" />
    </transition>
  </router-view>

  <SiteFooter />

  <ScrollTop />

  <!-- Preloader -->
  <div id="preloader" v-if="loading"></div>
</template>

<script>
import SiteHeader from "@/components/layout/SiteHeader.vue"
import SiteFooter from "@/components/layout/SiteFooter.vue"
import ScrollTop from "@/components/layout/ScrollTop.vue"
import { initAOS, refreshAosSafely } from "@/utils/aos"
import { initSeo } from "@/utils/seo"

export default {
  name: "App",
  components: {
    SiteHeader,
    SiteFooter,
    ScrollTop,
  },
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    // Kelas halaman dipakai CSS: .index-page .header (navbar transparan)
    // dan .index-page.scrolled .header (navbar solid). Tema `theme-neon`
    // sudah ditaruh di <body> lewat index.html sehingga aktif sebelum mount.
    document.body.classList.add("index-page")

    // Structured data (JSON-LD) + sinkronisasi <title>/canonical
    initSeo()

    // Preloader dihapus setelah halaman selesai dimuat
    const hidePreloader = () => {
      this.loading = false
    }
    if (document.readyState === "complete") {
      hidePreloader()
    } else {
      window.addEventListener("load", hidePreloader, { once: true })
    }
    // Fallback agar preloader tidak menyangkut
    this.preloaderTimer = setTimeout(hidePreloader, 2500)

    // Seluruh section sudah dirender oleh child components sebelum mounted() ini
    this.$nextTick(() => {
      initAOS()
      this.aosTimer = setTimeout(() => refreshAosSafely(), 500)
    })

    // SPA: refresh posisi animasi AOS setiap pindah halaman.
    // Bersihkan sisa kunci scroll dari modal Bootstrap yang belum selesai
    // transisinya saat user berpindah halaman (bisa membuat body stuck).
    this.$router.afterEach(() => {
      this.$nextTick(() => {
        refreshAosSafely()
        window.setTimeout(() => {
          document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove())
          document.body.classList.remove("modal-open", "mobile-nav-active")
          document.body.style.removeProperty("overflow")
          document.body.style.removeProperty("padding-right")
        }, 450)
      })
    })
  },
  beforeUnmount() {
    document.body.classList.remove("index-page", "scrolled", "mobile-nav-active")
    if (this.preloaderTimer) clearTimeout(this.preloaderTimer)
    if (this.aosTimer) clearTimeout(this.aosTimer)
  },
}
</script>

<style>
/* Transisi halaman yang halus dan murah (hanya opacity + transform). */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>
