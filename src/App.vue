<template>
  <div :class="isPublic ? 'public-app' : 'admin-app'">
    <!-- Skip link: aksesibilitas & SEO (khusus halaman publik) -->
    <a v-if="isPublic" href="#main-content" class="skip-link">{{ $t("common.skipToContent") }}</a>

    <template v-if="isPublic">
      <SiteHeader />
      <router-view />
      <SiteFooter />
      <ScrollTop />
      <FloatingWhatsApp />
      <div id="preloader" v-if="loading"></div>
    </template>

    <!-- /admin memakai layout Quasar murni (tanpa chrome website) -->
    <router-view v-else />
  </div>
</template>

<script>
import SiteHeader from "@/components/layout/SiteHeader.vue"
import SiteFooter from "@/components/layout/SiteFooter.vue"
import ScrollTop from "@/components/layout/ScrollTop.vue"
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp.vue"
import { initAOS, refreshAosSafely } from "@/utils/aos"
import { initSeo } from "@/utils/seo"

export default {
  name: "App",
  components: {
    SiteHeader,
    SiteFooter,
    ScrollTop,
    FloatingWhatsApp,
  },
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    isPublic() {
      return this.$route.meta.layout !== "admin"
    },
  },
  watch: {
    isPublic: {
      immediate: true,
      handler() {
        this.$nextTick(this.syncBodyClass)
      },
    },
  },
  methods: {
    syncBodyClass() {
      const body = document.body
      body.classList.toggle("index-page", this.isPublic)
      body.classList.toggle("admin-page", !this.isPublic)
      if (!this.isPublic) {
        body.classList.remove("scrolled", "mobile-nav-active")
      }
    },
  },
  mounted() {
    document.body.classList.add("index-page")

    if (this.isPublic) {
      initSeo()
      const hidePreloader = () => {
        this.loading = false
      }
      if (document.readyState === "complete") {
        hidePreloader()
      } else {
        window.addEventListener("load", hidePreloader, { once: true })
      }
      this.preloaderTimer = setTimeout(hidePreloader, 2500)

      this.$nextTick(() => {
        initAOS()
        this.aosTimer = setTimeout(() => refreshAosSafely(), 500)
      })
    } else {
      this.loading = false
    }

    // SPA: refresh posisi animasi AOS setiap pindah halaman (publik saja).
    this.unregisterAfterEach = this.$router.afterEach(() => {
      this.$nextTick(() => {
        this.syncBodyClass()
        if (this.isPublic) refreshAosSafely()
      })
    })
    this.syncBodyClass()
  },
  beforeUnmount() {
    document.body.classList.remove("index-page", "admin-page", "scrolled", "mobile-nav-active")
    if (this.preloaderTimer) clearTimeout(this.preloaderTimer)
    if (this.aosTimer) clearTimeout(this.aosTimer)
    if (this.unregisterAfterEach) this.unregisterAfterEach()
  },
}
</script>
