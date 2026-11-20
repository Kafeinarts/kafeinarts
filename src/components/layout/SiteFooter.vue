<template>
  <!-- dark-background: samakan palet dengan navbar (#00205D + teks putih) -->
  <footer id="footer" class="footer dark-background">
    <!-- Newsletter Section -->
    <div class="footer-newsletter">
      <div class="container">
        <div class="row justify-content-center text-center">
          <div class="col-lg-6">
            <h3>{{ $t('footer.newsletterTitle') }}</h3>
            <p>{{ $t('footer.newsletterDesc') }}</p>
            <form class="php-email-form" @submit.prevent="subscribe">
              <div class="newsletter-form" v-show="!subscribed">
                <input
                  v-model="email"
                  type="email"
                  name="email"
                  :placeholder="$t('footer.newsletterPlaceholder')"
                  required
                />
                <input type="submit" :value="$t('footer.newsletterButton')" />
              </div>
              <div class="loading" v-if="loading" :style="{ display: 'block' }">{{ $t('footer.loading') }}</div>
              <div class="error-message" v-if="error" :style="{ display: 'block' }">{{ error }}</div>
              <div class="sent-message" v-if="subscribed" :style="{ display: 'block' }">
                {{ $t('footer.subscribeSuccess') }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer Top -->
    <div class="container footer-top">
      <div class="row gy-4">
        <!-- Info Kontak -->
        <div class="col-lg-4 col-md-6 footer-about">
          <router-link :to="{ name: 'home' }" class="d-flex align-items-center">
            <span class="sitename">{{ data.about.title }}</span>
          </router-link>
          <div class="footer-contact pt-3">
            <p v-for="(line, i) in data.about.address" :key="i">{{ line }}</p>
            <p class="mt-3">
              <strong>{{ $t('common.phone') }}</strong> <span>{{ data.about.phone }}</span>
            </p>
            <p><strong>{{ $t('common.email') }}</strong> <span>{{ data.about.email }}</span></p>
          </div>
        </div>

        <!-- Link Navigasi -->
        <div class="col-lg-2 col-md-3 col-6 footer-links">
          <h3>{{ $t('footer.usefulLinks') }}</h3>
          <ul>
            <li v-for="link in data.links.useful" :key="link.label">
              <i class="bi bi-chevron-right"></i>
              <router-link :to="link.to">{{ $t(link.i18nKey || link.label) }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Link Produk -->
        <div class="col-lg-2 col-md-3 col-6 footer-links">
          <h3>{{ $t('footer.ourProducts') }}</h3>
          <ul>
            <li v-for="link in data.links.services" :key="link.label">
              <i class="bi bi-chevron-right"></i>
              <router-link :to="link.to">{{ $t(link.i18nKey || link.label) }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Dukungan -->
        <div class="col-lg-2 col-md-3 col-6 footer-links">
          <h3>{{ $t('footer.support') }}</h3>
          <ul>
            <li v-for="link in data.links.support" :key="link.label">
              <i class="bi bi-chevron-right"></i>
              <router-link :to="link.to">{{ $t(link.i18nKey || link.label) }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Sosial Media -->
        <div class="col-lg-2 col-md-3 col-6">
          <h3>{{ $t('footer.followUs') }}</h3>
          <div class="social-links d-flex flex-wrap">
            <a
              v-for="s in data.social"
              :key="s.icon"
              :href="s.href"
              :aria-label="s.label || s.icon"
            >
              <i class="bi" :class="s.icon"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="container copyright text-center mt-4">
      <p>
        &copy; {{ data.copyright.year }} <span>{{ $t('common.copyright') }}</span>
        <strong class="px-1 sitename">{{ data.copyright.brand }}</strong>
        <span>{{ $t('footer.copyrightNote') }}</span>
      </p>
    </div>
  </footer>
</template>

<script>
import { siteData } from "@/data/siteData"

export default {
  name: "SiteFooter",
  data() {
    return {
      data: siteData.footer,
      email: "",
      loading: false,
      subscribed: false,
      error: "",
    }
  },
  methods: {
    subscribe() {
      this.error = ""
      if (!this.email || !/^\S+@\S+\.\S+$/.test(this.email)) {
        this.error = this.$t("footer.invalidEmail")
        return
      }
      // Tidak ada backend newsletter di build statis — tampilkan konfirmasi sukses.
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.subscribed = true
        this.email = ""
      }, 500)
    },
  },
}
</script>

<style scoped>
/* Footer mengikuti warna navbar: biru dongker #00205D dengan teks putih.
   `dark-background` (main.css) sudah mengganti variabel warna; aturan di
   bawah hanya menyesuaikan elemen yang memakai --accent-color agar tetap
   terlihat di atas background gelap. */
.footer {
  background-color: #00205d;
  color: #fff;
}

.footer .footer-newsletter {
  background-color: rgba(255, 255, 255, 0.05);
}

.footer .footer-newsletter .newsletter-form,
.footer .footer-newsletter .newsletter-form input[type="email"] {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.35);
  color: #fff;
}

.footer .footer-newsletter .newsletter-form input[type="email"]::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.footer .footer-newsletter .newsletter-form input[type="submit"] {
  background: #fff;
  color: #00205d;
}

.footer .footer-newsletter .newsletter-form input[type="submit"]:hover {
  background: rgba(255, 255, 255, 0.85);
  color: #00205d;
}

.footer .footer-links ul i,
.footer .footer-links ul a:hover,
.footer .social-links a:hover {
  color: #fff;
}

.footer .social-links a:hover {
  border-color: #fff;
}

.footer .copyright {
  border-top-color: rgba(255, 255, 255, 0.2);
}
</style>
