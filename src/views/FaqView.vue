<template>
  <main id="main-content" class="main" tabindex="-1">
    <PageHero
      :title="$t('faq.title')"
      :tagline="$t('faq.tagline')"
      :desc="$t('faq.desc')"
      icon="bi-patch-question"
      icon-color="#0d9488"
      cover="faq"
    />

    <section class="section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-9" data-aos="fade-up">
            <div class="accordion" id="faqAccordion">
              <div v-for="(item, i) in faqItems" :key="i" class="accordion-item">
                <h3 class="accordion-header">
                  <button
                    class="accordion-button"
                    :class="{ collapsed: !isActive(i) }"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="'#faq-' + i"
                    :aria-expanded="isActive(i) ? 'true' : 'false'"
                    @click="setActive(i)"
                  >
                    {{ item.q }}
                  </button>
                </h3>
                <div
                  :id="'faq-' + i"
                  class="accordion-collapse collapse"
                  :class="{ show: isActive(i) }"
                  data-bs-parent="#faqAccordion"
                >
                  <div class="accordion-body" v-html="item.a"></div>
                </div>
              </div>
            </div>

            <div class="text-center mt-5">
              <p class="text-muted mb-3">{{ $t('faq.noAnswer') }}</p>
              <router-link :to="{ name: 'contact' }" class="btn-hero-primary text-decoration-none">
                <i class="bi bi-chat-dots me-2"></i>{{ $t('faq.askUs') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import PageHero from "@/components/ui/PageHero.vue"
import { usePageSeo } from "@/composables/usePageSeo"
import { siteData } from "@/data/siteData"

export default {
  name: "FaqView",
  components: { PageHero },
  setup() {
    usePageSeo({
      title: `FAQ — ${siteData.seo.name}`,
      description: siteData.faq.subtitle,
      path: "/faq",
    })
  },
  data() {
    return { faq: siteData.faq, activeIndex: 0 }
  },
  computed: {
    /** Konten FAQ diambil dari kamus i18n; fallback ke data JSON bila belum diterjemahkan. */
    faqItems() {
      return (this.faq.items || []).map((item, i) => ({
        ...item,
        q: this.$t(`faq.items.${i}.q`, {}, item.q),
        a: this.$t(`faq.items.${i}.a`, {}, item.a),
      }))
    },
  },
  methods: {
    isActive(i) {
      return this.activeIndex === i
    },
    setActive(i) {
      this.activeIndex = i
    },
  },
}
</script>
