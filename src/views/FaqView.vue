<template>
  <main id="main-content" class="main" tabindex="-1">
    <PageHero
      :title="$t('faq.title')"
      :tagline="$t('faq.tagline')"
      :desc="$t('faq.desc')"
      icon="bi-patch-question"
      icon-color="#0d9488"
      cover="faq"
    >
      <a href="#faq-list" class="btn-hero-primary text-decoration-none">
        <i class="bi bi-search me-2"></i>{{ $t('faq.findAnswers') }}
      </a>
      <router-link :to="{ name: 'contact' }" class="btn-hero-outline text-decoration-none">
        <i class="bi bi-chat-dots me-2"></i>{{ $t('faq.contactUs') }}
      </router-link>
    </PageHero>

    <section id="faq-list" class="section faq-section">
      <span class="faq-glow faq-glow-left" aria-hidden="true"></span>
      <span class="faq-glow faq-glow-right" aria-hidden="true"></span>

      <div class="container faq-container">
        <!-- Intro + pencarian -->
        <div class="faq-head" data-aos="fade-up">
          <span class="faq-eyebrow">
            <i class="bi bi-life-preserver" aria-hidden="true"></i>
            {{ $t('faq.eyebrow') }}
          </span>
          <h2>{{ $t('faq.heading') }}</h2>
          <p>{{ $t('faq.intro') }}</p>

          <div class="faq-search">
            <i class="bi bi-search" aria-hidden="true"></i>
            <label for="faq-search-input" class="visually-hidden">{{ $t('faq.searchLabel') }}</label>
            <input
              id="faq-search-input"
              v-model="query"
              type="search"
              :placeholder="$t('faq.searchPlaceholder')"
              autocomplete="off"
            />
            <button
              v-if="query"
              type="button"
              class="faq-clear"
              :aria-label="$t('faq.clearSearch')"
              @click="query = ''"
            >
              <i class="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div class="row gy-4">
          <!-- Accordion FAQ -->
          <div class="col-lg-8">
            <div v-if="filteredItems.length" class="faq-list">
              <article
                v-for="item in filteredItems"
                :id="'faq-item-' + item.index"
                :key="item.index"
                class="faq-item"
                :class="{ open: isActive(item.index) }"
              >
                <h3 class="faq-question-wrap">
                  <button
                    :id="'faq-question-' + item.index"
                    type="button"
                    class="faq-question"
                    :aria-expanded="isActive(item.index) ? 'true' : 'false'"
                    :aria-controls="'faq-answer-' + item.index"
                    @click="toggle(item.index)"
                  >
                    <span class="faq-item-icon">
                      <i class="bi" :class="item.icon" aria-hidden="true"></i>
                    </span>
                    <span class="faq-item-text">
                      <span class="faq-item-cat">{{ item.category }}</span>
                      <span class="faq-item-q">{{ item.q }}</span>
                    </span>
                    <span class="faq-toggle" aria-hidden="true">
                      <i class="bi bi-plus-lg"></i>
                    </span>
                  </button>
                </h3>

                <div
                  :id="'faq-answer-' + item.index"
                  class="faq-answer"
                  role="region"
                  :aria-labelledby="'faq-question-' + item.index"
                  :aria-hidden="isActive(item.index) ? 'false' : 'true'"
                >
                  <div class="faq-answer-inner">
                    <div class="faq-answer-content" v-html="item.a"></div>
                  </div>
                </div>
              </article>
            </div>

            <p v-if="query && filteredItems.length" class="faq-results">
              {{ $t('faq.resultCount', { count: filteredItems.length, total: faqItems.length }) }}
            </p>

            <!-- Empty state pencarian -->
            <div v-if="!filteredItems.length" class="faq-empty">
              <div class="faq-empty-icon">
                <i class="bi bi-search" aria-hidden="true"></i>
              </div>
              <h3>{{ $t('faq.emptyTitle', { query: query.trim() }) }}</h3>
              <p>{{ $t('faq.emptyDesc') }}</p>
              <button type="button" class="faq-empty-btn" @click="resetSearch">
                <i class="bi bi-arrow-counterclockwise me-2" aria-hidden="true"></i>
                {{ $t('faq.emptyReset') }}
              </button>
            </div>
          </div>

          <!-- Sidebar bantuan -->
          <div class="col-lg-4">
            <aside class="faq-side">
              <div class="faq-panel">
                <p class="faq-panel-title">{{ $t('faq.quickTopics') }}</p>
                <button
                  v-for="item in faqItems"
                  :key="'topic-' + item.index"
                  type="button"
                  class="faq-topic"
                  :class="{ active: isActive(item.index) }"
                  @click="focusTopic(item.index)"
                >
                  <span class="faq-topic-icon">
                    <i class="bi" :class="item.icon" aria-hidden="true"></i>
                  </span>
                  <span>{{ item.category }}</span>
                  <i class="bi bi-arrow-right faq-topic-arrow" aria-hidden="true"></i>
                </button>
              </div>

              <div class="faq-support">
                <div class="faq-support-icon">
                  <i class="bi bi-chat-heart" aria-hidden="true"></i>
                </div>
                <h3>{{ $t('faq.supportTitle') }}</h3>
                <p>{{ $t('faq.supportDesc') }}</p>

                <a :href="waUrl" target="_blank" rel="noopener" class="faq-support-btn faq-support-primary">
                  <i class="bi bi-whatsapp" aria-hidden="true"></i>
                  {{ $t('faq.chatWa') }}
                </a>
                <router-link :to="{ name: 'contact' }" class="faq-support-btn faq-support-ghost">
                  <i class="bi bi-envelope" aria-hidden="true"></i>
                  {{ $t('faq.sendMessage') }}
                </router-link>

                <div class="faq-support-meta">
                  <span>
                    <i class="bi bi-clock" aria-hidden="true"></i>
                    {{ $t('faq.responseTime') }} <strong>{{ $t('faq.responseValue') }}</strong>
                  </span>
                  <span>
                    <i class="bi bi-shield-check" aria-hidden="true"></i>
                    {{ $t('faq.freeConsult') }}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <section class="section pt-0">
      <div class="container">
        <CtaBanner :title="$t('faq.ctaTitle')" :desc="$t('faq.ctaDesc')">
          <router-link :to="{ name: 'contact' }" class="btn-hero-primary text-decoration-none">
            <i class="bi bi-chat-dots me-2"></i>{{ $t('faq.ctaPrimary') }}
          </router-link>
          <router-link :to="{ name: 'services' }" class="btn-hero-outline text-decoration-none">
            <i class="bi bi-grid me-2"></i>{{ $t('faq.ctaSecondary') }}
          </router-link>
        </CtaBanner>
      </div>
    </section>
  </main>
</template>

<script>
import PageHero from "@/components/ui/PageHero.vue"
import CtaBanner from "@/components/ui/CtaBanner.vue"
import { usePageSeo } from "@/composables/usePageSeo"
import { siteData } from "@/data/siteData"
import { buildWaUrl, getPrimaryWhatsApp } from "@/utils/whatsapp"

export default {
  name: "FaqView",
  components: { PageHero, CtaBanner },
  setup() {
    usePageSeo({
      title: `FAQ — ${siteData.seo.name}`,
      description: siteData.faq.subtitle,
      path: "/faq",
    })
  },
  data() {
    return {
      faq: siteData.faq,
      activeIndex: 0,
      query: "",
    }
  },
  computed: {
    /** Konten FAQ diambil dari kamus i18n; fallback ke data JSON bila belum diterjemahkan. */
    faqItems() {
      return (this.faq.items || []).map((item, index) => ({
        ...item,
        index,
        q: this.$t(`faq.items.${index}.q`, {}, item.q),
        a: this.$t(`faq.items.${index}.a`, {}, item.a),
        category: item.categoryKey
          ? this.$t(`faq.categories.${item.categoryKey}`, {}, item.categoryKey)
          : "",
      }))
    },
    /** Hasil pencarian — cocokkan pertanyaan dan isi jawaban (tag HTML diabaikan). */
    filteredItems() {
      const keyword = this.query.trim().toLowerCase()
      if (!keyword) return this.faqItems
      return this.faqItems.filter((item) => {
        const haystack = `${item.q} ${this.stripHtml(item.a)}`.toLowerCase()
        return haystack.includes(keyword)
      })
    },
    waUrl() {
      const target = getPrimaryWhatsApp()
      return buildWaUrl(target.wa, this.$t("faq.waMessage"))
    },
  },
  watch: {
    /** Saat mencari, buka otomatis hasil pertama agar jawaban langsung terlihat. */
    query() {
      const results = this.filteredItems
      if (!results.length) return
      if (!results.some((item) => item.index === this.activeIndex)) {
        this.activeIndex = results[0].index
      }
    },
  },
  methods: {
    stripHtml(html) {
      return String(html || "").replace(/<[^>]*>/g, " ")
    },
    isActive(index) {
      return this.activeIndex === index
    },
    toggle(index) {
      this.activeIndex = this.activeIndex === index ? -1 : index
    },
    resetSearch() {
      this.query = ""
      this.activeIndex = 0
    },
    /** Klik topik di sidebar: buka item terkait lalu gulir ke posisinya. */
    focusTopic(index) {
      this.query = ""
      this.activeIndex = index
      this.$nextTick(() => {
        const el = document.getElementById(`faq-item-${index}`)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
      })
    },
  },
}
</script>

<style scoped>
.faq-section {
  position: relative;
  padding-top: 72px;
}

.faq-container {
  position: relative;
  z-index: 1;
}

/* Aksen dekoratif lembut di latar */
.faq-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.faq-glow-left {
  width: 460px;
  height: 460px;
  top: 30px;
  left: -220px;
  background: radial-gradient(circle, rgba(13, 148, 136, 0.12), transparent 65%);
}

.faq-glow-right {
  width: 520px;
  height: 520px;
  right: -240px;
  bottom: -80px;
  background: radial-gradient(circle, rgba(0, 32, 93, 0.09), transparent 68%);
}

/* Kepala section + pencarian */
.faq-head {
  max-width: 720px;
  margin: 0 auto 46px;
  text-align: center;
}

.faq-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding: 7px 15px;
  border: 1px solid rgba(13, 148, 136, 0.2);
  border-radius: 50px;
  background: rgba(13, 148, 136, 0.08);
  color: #0f766e;
  font-family: var(--heading-font);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.faq-head h2 {
  margin-bottom: 12px;
  color: var(--heading-color);
  font-size: clamp(1.65rem, 3.2vw, 2.25rem);
  font-weight: 700;
}

.faq-head > p {
  max-width: 610px;
  margin: 0 auto 26px;
  color: #5b6577;
  font-size: 0.96rem;
  line-height: 1.75;
}

.faq-search {
  display: flex;
  align-items: center;
  max-width: 620px;
  margin: 0 auto;
  padding: 6px 8px 6px 18px;
  border: 1px solid rgba(0, 32, 93, 0.1);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 34px rgba(0, 32, 93, 0.08);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.faq-search:focus-within {
  border-color: rgba(13, 148, 136, 0.5);
  box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.11), 0 16px 40px rgba(0, 32, 93, 0.1);
}

.faq-search > i {
  flex-shrink: 0;
  color: #0d9488;
  font-size: 1.05rem;
}

.faq-search input {
  flex: 1;
  min-width: 0;
  padding: 12px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--heading-color);
  font-size: 0.94rem;
}

.faq-search input::placeholder {
  color: #9aa3b5;
}

.faq-search input::-webkit-search-cancel-button {
  display: none;
}

.faq-clear {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: #eef1f6;
  color: #5b6577;
  font-size: 0.78rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.faq-clear:hover {
  background: #e2e7ef;
  color: var(--heading-color);
}

/* Daftar accordion */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faq-item {
  overflow: hidden;
  border: 1px solid rgba(0, 32, 93, 0.1);
  border-radius: 16px;
  background: #fff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.faq-item:hover {
  border-color: rgba(0, 32, 93, 0.2);
  box-shadow: 0 12px 30px rgba(0, 32, 93, 0.07);
}

.faq-item.open {
  border-color: rgba(13, 148, 136, 0.42);
  background: linear-gradient(180deg, rgba(13, 148, 136, 0.035), #fff 42%);
  box-shadow: 0 18px 44px rgba(0, 32, 93, 0.1);
}

.faq-question-wrap {
  margin: 0;
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 18px 20px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.faq-question:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: -3px;
  border-radius: 16px;
}

.faq-item-icon {
  flex: 0 0 44px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 32, 93, 0.06);
  color: var(--heading-color);
  font-size: 1.12rem;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.faq-item.open .faq-item-icon {
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: #fff;
  box-shadow: 0 8px 18px rgba(13, 148, 136, 0.28);
}

.faq-item-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.faq-item-cat {
  color: #0f766e;
  font-family: var(--heading-font);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.faq-item-q {
  color: var(--heading-color);
  font-family: var(--heading-font);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.45;
}

.faq-toggle {
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(0, 32, 93, 0.12);
  border-radius: 50%;
  color: #5b6577;
  font-size: 0.8rem;
  transition: transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

.faq-item.open .faq-toggle {
  transform: rotate(45deg);
  border-color: var(--heading-color);
  background: var(--heading-color);
  color: #fff;
}

/* Jawaban dengan animasi buka/tutup */
.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.38s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.open .faq-answer {
  grid-template-rows: 1fr;
}

.faq-answer-inner {
  overflow: hidden;
}

.faq-answer-content {
  padding: 0 24px 22px 80px;
  color: #5b6577;
  font-size: 0.93rem;
  line-height: 1.8;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s;
}

.faq-item.open .faq-answer-content {
  opacity: 1;
  transform: none;
}

.faq-answer-content :deep(em) {
  padding: 0 4px;
  border-radius: 4px;
  background: rgba(13, 148, 136, 0.09);
  color: #0f766e;
  font-style: normal;
  font-weight: 600;
}

.faq-answer-content :deep(a) {
  color: #0f766e;
  text-decoration: underline;
}

.faq-results {
  margin: 16px 4px 0;
  color: #8a93a6;
  font-size: 0.8rem;
}

/* Empty state */
.faq-empty {
  padding: 54px 24px;
  border: 1px dashed rgba(0, 32, 93, 0.18);
  border-radius: 16px;
  background: #fff;
  text-align: center;
}

.faq-empty-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: rgba(13, 148, 136, 0.1);
  color: #0d9488;
  font-size: 1.35rem;
}

.faq-empty h3 {
  margin-bottom: 8px;
  color: var(--heading-color);
  font-size: 1.1rem;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.faq-empty p {
  max-width: 420px;
  margin: 0 auto 20px;
  color: #5b6577;
  font-size: 0.9rem;
  line-height: 1.7;
}

.faq-empty-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border: 1px solid rgba(0, 32, 93, 0.14);
  border-radius: 50px;
  background: #fff;
  color: var(--heading-color);
  font-family: var(--heading-font);
  font-size: 0.85rem;
  font-weight: 600;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.faq-empty-btn:hover {
  border-color: rgba(13, 148, 136, 0.4);
  background: rgba(13, 148, 136, 0.06);
}

/* Sidebar */
.faq-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-panel {
  padding: 20px;
  border: 1px solid rgba(0, 32, 93, 0.1);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 32, 93, 0.05);
}

.faq-panel-title {
  margin: 0 0 12px;
  color: #8a93a6;
  font-family: var(--heading-font);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.faq-topic {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 9px 8px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--heading-color);
  font-family: var(--heading-font);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  transition: background 0.2s ease, color 0.2s ease;
}

.faq-topic:hover,
.faq-topic.active {
  background: rgba(13, 148, 136, 0.07);
  color: #0f766e;
}

.faq-topic-icon {
  flex: 0 0 32px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(0, 32, 93, 0.05);
  color: var(--heading-color);
  font-size: 0.82rem;
  transition: background 0.2s ease, color 0.2s ease;
}

.faq-topic:hover .faq-topic-icon {
  background: rgba(13, 148, 136, 0.14);
  color: #0f766e;
}

.faq-topic.active .faq-topic-icon {
  background: linear-gradient(135deg, #0d9488, #0f766e);
  color: #fff;
}

.faq-topic-arrow {
  margin-left: auto;
  color: #0d9488;
  font-size: 0.78rem;
  opacity: 0.45;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.faq-topic:hover .faq-topic-arrow,
.faq-topic.active .faq-topic-arrow {
  transform: translateX(3px);
  opacity: 1;
}

/* Kartu bantuan */
.faq-support {
  position: relative;
  overflow: hidden;
  padding: 24px;
  border-radius: 18px;
  background: linear-gradient(150deg, #00205d 0%, #04307f 58%, #0b4f9e 100%);
  box-shadow: 0 20px 40px rgba(0, 32, 93, 0.2);
  color: #fff;
}

.faq-support::before {
  content: "";
  position: absolute;
  top: -70px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(13, 148, 136, 0.55), transparent 68%);
  pointer-events: none;
}

.faq-support::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.13) 1px, transparent 1px);
  background-size: 18px 18px;
  -webkit-mask-image: linear-gradient(135deg, transparent 40%, #000 100%);
  mask-image: linear-gradient(135deg, transparent 40%, #000 100%);
  pointer-events: none;
}

.faq-support > * {
  position: relative;
  z-index: 1;
}

.faq-support-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.1);
  color: #7dd3c7;
  font-size: 1.2rem;
}

.faq-support h3 {
  margin-bottom: 8px;
  color: #fff;
  font-size: 1.18rem;
  font-weight: 700;
}

.faq-support > p {
  margin-bottom: 18px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.87rem;
  line-height: 1.7;
}

.faq-support-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  padding: 11px 16px;
  border-radius: 11px;
  font-family: var(--heading-font);
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.faq-support-btn + .faq-support-btn {
  margin-top: 9px;
}

.faq-support-primary {
  background: #fff;
  color: var(--heading-color);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
}

.faq-support-primary i {
  color: #16a34a;
}

.faq-support-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.22);
  color: var(--heading-color);
}

.faq-support-ghost {
  border: 1px solid rgba(255, 255, 255, 0.34);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.faq-support-ghost:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.faq-support-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 16px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.73rem;
}

.faq-support-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.faq-support-meta i {
  color: #7dd3c7;
}

.faq-support-meta strong {
  color: #fff;
  font-weight: 600;
}

@media (max-width: 991.98px) {
  .faq-section {
    padding-top: 56px;
  }

  .faq-head {
    margin-bottom: 34px;
  }
}

@media (max-width: 575.98px) {
  .faq-question {
    gap: 12px;
    padding: 16px;
  }

  .faq-item-icon {
    flex-basis: 38px;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    font-size: 1rem;
  }

  .faq-item-q {
    font-size: 0.94rem;
  }

  .faq-answer-content {
    padding: 0 16px 18px;
    font-size: 0.9rem;
  }

  .faq-search input {
    font-size: 16px;
  }

  .faq-support {
    padding: 22px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-item,
  .faq-answer,
  .faq-answer-content,
  .faq-toggle,
  .faq-item-icon,
  .faq-topic,
  .faq-topic-icon,
  .faq-topic-arrow {
    transition: none;
  }
}
</style>
