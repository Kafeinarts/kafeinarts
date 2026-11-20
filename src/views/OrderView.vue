<template>
  <main id="main-content" class="main" tabindex="-1">
    <PageHero
      :title="config.page.title"
      :tagline="$t(hasProduct ? 'order.taglineLocked' : 'order.taglineDefault')"
      :desc="config.page.subtitle"
      icon="bi-cart4"
      icon-color="#15803d"
      cover="order"
    />

    <section class="section">
      <div class="container">
        <div class="row gy-4">
          <!-- Wizard order -->
          <div class="col-lg-8" data-aos="fade-up">
            <OrderWizard :initial-product="$route.query.product || ''" @sent="onSent" />

            <div v-if="sent" class="alert alert-success mt-3 mb-0" role="alert">
              <i class="bi bi-check-circle me-1"></i>
              {{ $t('order.sentNotice') }}
              <a :href="sentUrl" target="_blank" rel="noopener">WhatsApp <i class="bi bi-box-arrow-up-right"></i></a>
            </div>
          </div>

          <!-- Informasi pendukung -->
          <aside class="col-lg-4">
            <div class="card border-0 shadow-sm mb-4" data-aos="fade-up" data-aos-delay="100">
              <div class="card-body p-4">
                <h3 class="h6 fw-bold text-uppercase mb-3">{{ $t('order.flowTitle') }}</h3>
                <ol class="order-flow list-unstyled mb-0">
                  <li v-for="(step, i) in flowSteps" :key="step.key" class="d-flex gap-3 mb-3">
                    <span class="order-flow-number">{{ i + 1 }}</span>
                    <div>
                      <strong>{{ step.label }}</strong>
                      <p class="mb-0 small text-muted">{{ step.desc }}</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <div class="card border-0 shadow-sm" data-aos="fade-up" data-aos-delay="200">
              <div class="card-body p-4">
                <h3 class="h6 fw-bold text-uppercase mb-3">{{ $t('order.whyNoPrice') }}</h3>
                <p class="small text-muted">{{ $t('order.priceNote', {}, config.priceNote) }}</p>
                <a :href="directWaUrl" target="_blank" rel="noopener" class="btn btn-success w-100 mt-2">
                  <i class="bi bi-whatsapp me-1"></i> {{ $t('order.chatWa') }} {{ primaryWa.display }}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import PageHero from "@/components/ui/PageHero.vue"
import OrderWizard from "@/components/ui/OrderWizard.vue"
import { usePageSeo } from "@/composables/usePageSeo"
import { siteData } from "@/data/siteData"
import { buildWaUrl, getPrimaryWhatsApp } from "@/utils/whatsapp"

export default {
  name: "OrderView",
  components: { PageHero, OrderWizard },
  setup() {
    usePageSeo({
      title: `Order Sistem — ${siteData.seo.name}`,
      description: siteData.orderWizard.page.subtitle,
      path: "/order",
    })
  },
  data() {
    return {
      config: siteData.orderWizard,
      primaryWa: getPrimaryWhatsApp(),
      sent: false,
      sentUrl: "",
    }
  },
  computed: {
    hasProduct() {
      return Boolean(this.$route.query.product)
    },
    /** Alur ditampilkan sesuai wizard: langkah pilih produk hilang jika produk sudah ditentukan. */
    flowSteps() {
      return this.config.steps
        .filter((step) => this.hasProduct || step.key !== "product")
        .map((step) => {
          const index = this.config.steps.findIndex((s) => s.key === step.key)
          const original = ((this.config.section.steps || [])[index] || {}).desc || ""
          const labelMap = {
            product: "order.stepProduct",
            features: "order.stepFeatures",
            profile: "order.stepProfile",
            review: "order.stepReview",
          }
          const descMap = {
            product: "order.flowProduct",
            features: "order.flowFeatures",
            profile: "order.flowProfile",
            review: "order.flowReview",
          }
          return {
            ...step,
            label: this.$t(labelMap[step.key], {}, step.label),
            desc: this.$t(descMap[step.key], {}, original),
          }
        })
    },
    directWaUrl() {
      return buildWaUrl(this.primaryWa.wa, "Halo Kafeinarts, saya ingin mendiskusikan order sistem/website.")
    },
  },
  methods: {
    onSent(payload) {
      this.sentUrl = payload.url
      this.sent = true
    },
  },
}
</script>

<style scoped>
.order-flow-number {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--accent-color), transparent 88%);
  color: var(--accent-color);
  font-size: 0.8rem;
  font-weight: 700;
}

.order-flow li:last-child {
  margin-bottom: 0;
}
</style>
