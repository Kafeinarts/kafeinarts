<template>
  <!-- OrderWizard: wizard order — (opsional) pilih produk → fitur → biodata → kirim WhatsApp -->
  <div class="order-wizard card shadow-sm border-0">
    <div class="card-body p-4 p-md-5">
      <!-- Progress steps -->
      <ol class="wizard-steps list-unstyled d-flex justify-content-between mb-4">
        <li
          v-for="(step, i) in activeSteps"
          :key="step.key"
          class="wizard-step"
          :class="{ 'is-active': i === currentStep, 'is-done': i < currentStep }"
        >
          <span class="wizard-step-dot">
            <i v-if="i < currentStep" class="bi bi-check2"></i>
            <i v-else class="bi" :class="stepIcon(step.key)"></i>
          </span>
          <span class="wizard-step-label d-none d-md-inline">{{ stepLabel(step.key) }}</span>
        </li>
      </ol>

      <!-- Info produk terkunci (dipanggil dari halaman detail produk) -->
      <div v-if="isProductLocked" class="alert alert-light border small mb-4">
        <i class="bi bi-box-seam me-2"></i>
        {{ $t('order.lockedNotice', { product: selectedProductName }) }}
        <router-link :to="{ name: 'products' }" class="ms-1">{{ $t('order.changeProduct') }}</router-link>
      </div>

      <!-- Step 1: Pilih produk (hanya dipakai jika produk belum ditentukan) -->
      <div v-if="activeStepKey === 'product'" class="wizard-pane">
        <h4 class="wizard-pane-title mb-1"><i class="bi bi-box-seam me-2"></i>{{ $t('order.chooseTitle') }}</h4>
        <p class="text-muted mb-4">{{ $t('order.chooseDesc') }}</p>

        <div class="d-flex flex-wrap gap-2 mb-4">
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            type="button"
            class="btn order-filter-btn"
            :class="activeCategory === tab.key ? 'btn-primary' : 'btn-outline-secondary'"
            @click="activeCategory = tab.key"
          >
            <i v-if="tab.icon" class="bi me-1" :class="tab.icon"></i>{{ tab.key === 'all' ? $t('order.allCategories') : tab.label }}
          </button>
        </div>

        <div class="row g-3">
          <div v-for="product in filteredProducts" :key="product.slug" class="col-md-6 d-flex">
            <label class="wizard-option order-product-option" :class="{ selected: form.productSlug === product.slug }">
              <input
                type="radio"
                name="order-product"
                class="d-none"
                :value="product.slug"
                :checked="form.productSlug === product.slug"
                @change="selectProduct(product.slug)"
              />
              <span class="order-option-icon">
                <i class="bi" :class="product.icon"></i>
              </span>
              <span class="order-option-text">
                <strong>{{ product.name }}</strong>
                <small class="d-block text-muted">{{ product.tagline }}</small>
              </span>
              <i class="bi bi-check-circle-fill order-option-check"></i>
            </label>
          </div>

          <!-- Opsi custom: selalu tersedia di filter "Semua" -->
          <div v-if="activeCategory === 'all'" class="col-md-6 d-flex">
            <label class="wizard-option order-product-option" :class="{ selected: form.productSlug === customProduct.slug }">
              <input
                type="radio"
                name="order-product"
                class="d-none"
                :value="customProduct.slug"
                :checked="form.productSlug === customProduct.slug"
                @change="selectProduct(customProduct.slug)"
              />
              <span class="order-option-icon order-option-icon-custom">
                <i class="bi" :class="customProduct.icon"></i>
              </span>
              <span class="order-option-text">
                <strong>{{ customProduct.name }}</strong>
                <small class="d-block text-muted">{{ customProduct.tagline }}</small>
              </span>
              <i class="bi bi-check-circle-fill order-option-check"></i>
            </label>
          </div>
        </div>
      </div>

      <!-- Step 2: Pilih fitur -->
      <div v-else-if="activeStepKey === 'features'" class="wizard-pane">
        <h4 class="wizard-pane-title mb-1"><i class="bi bi-ui-checks me-2"></i>{{ $t('order.featureTitle') }}</h4>
        <p class="text-muted mb-4">{{ $t('order.featureDesc', { product: selectedProductName }) }}</p>

        <div v-if="availableFeatures.length" class="row g-3">
          <div v-for="feature in availableFeatures" :key="feature.title" class="col-md-6 d-flex">
            <label class="wizard-option order-feature-option" :class="{ selected: form.features.includes(feature.title) }">
              <input v-model="form.features" type="checkbox" :value="feature.title" class="form-check-input mt-0" />
              <span class="order-feature-icon"><i class="bi" :class="feature.icon || 'bi-check2-square'"></i></span>
              <span>
                <strong>{{ feature.title }}</strong>
                <small class="d-block text-muted">{{ feature.desc }}</small>
              </span>
            </label>
          </div>
        </div>
        <div v-else class="alert alert-light border mb-0">
          <i class="bi bi-info-circle me-2"></i>
          {{ isCustomRequest ? $t('order.customNotice') : $t('order.noFeatureNotice') }}
        </div>

        <div class="mt-4 pt-3 border-top">
          <label class="form-label fw-semibold">
            <i class="bi bi-pencil-square me-1"></i>{{ $t('order.extraTitle') }}
          </label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-pencil"></i></span>
            <textarea
              v-model.trim="form.extraFeatures"
              class="form-control"
              rows="4"
              :placeholder="$t('order.extraPlaceholder')"
            ></textarea>
          </div>
          <div class="form-text">
            <i class="bi bi-lightbulb me-1"></i>{{ $t('order.extraHint') }}
          </div>
        </div>
      </div>

      <!-- Step 3: Biodata -->
      <div v-else-if="activeStepKey === 'profile'" class="wizard-pane">
        <h4 class="wizard-pane-title mb-1"><i class="bi bi-person-vcard me-2"></i>{{ $t('order.profileTitle') }}</h4>
        <p class="text-muted mb-4">{{ $t('order.profileDesc') }}</p>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">{{ $t('order.fieldName') }} <span class="text-danger">*</span></label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input v-model.trim="form.name" type="text" class="form-control" :placeholder="$t('order.namePlaceholder')" required />
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ $t('order.fieldPhone') }} <span class="text-danger">*</span></label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-whatsapp"></i></span>
              <span class="input-group-text">+62</span>
              <input v-model.trim="form.phone" type="tel" class="form-control" :placeholder="$t('order.phonePlaceholder')" required />
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ $t('order.fieldOrg') }} <small class="text-muted">({{ $t('order.optional') }})</small></label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-building"></i></span>
              <input v-model.trim="form.org" type="text" class="form-control" :placeholder="$t('order.optional')" />
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ $t('order.fieldEmail') }} <small class="text-muted">({{ $t('order.optional') }})</small></label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-envelope"></i></span>
              <input v-model.trim="form.email" type="email" class="form-control" :placeholder="$t('order.optional')" />
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ $t('order.fieldCity') }} <small class="text-muted">({{ $t('order.optional') }})</small></label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
              <input v-model.trim="form.city" type="text" class="form-control" :placeholder="$t('order.cityPlaceholder')" />
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">{{ $t('order.fieldTimeline') }}</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-calendar3"></i></span>
              <select v-model="form.timeline" class="form-select">
                <option value="">{{ $t('order.timelineEmpty') }}</option>
                <option v-for="t in timelineOptions" :key="t.key" :value="t.label">{{ t.label }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-3 small text-muted">
          <i class="bi bi-shield-check me-1"></i>{{ $t('order.privacyNote') }}
        </div>
      </div>

      <!-- Step 4: Ringkasan -->
      <div v-else class="wizard-pane">
        <h4 class="wizard-pane-title mb-1"><i class="bi bi-clipboard-check me-2"></i>{{ $t('order.reviewTitle') }}</h4>
        <p class="text-muted mb-4">{{ $t('order.reviewDesc') }}</p>

        <ul class="list-group list-group-flush order-summary mb-4">
          <li class="list-group-item d-flex justify-content-between gap-3">
            <span class="text-muted"><i class="bi bi-box-seam me-1"></i>{{ $t('order.summaryProduct') }}</span>
            <strong class="text-end">{{ selectedProductName }}</strong>
          </li>
          <li class="list-group-item">
            <span class="text-muted d-block mb-1"><i class="bi bi-ui-checks me-1"></i>{{ $t('order.summaryFeatures') }}</span>
            <div v-if="form.features.length" class="d-flex flex-wrap gap-2">
              <span v-for="f in form.features" :key="f" class="badge rounded-pill text-bg-light border">
                <i class="bi bi-check2 me-1"></i>{{ f }}
              </span>
            </div>
            <span v-else class="text-muted">{{ $t('order.none') }}</span>
          </li>
          <li class="list-group-item">
            <span class="text-muted d-block mb-1"><i class="bi bi-pencil-square me-1"></i>{{ $t('order.summaryExtra') }}</span>
            <span>{{ form.extraFeatures || $t('order.none') }}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between gap-3">
            <span class="text-muted"><i class="bi bi-person me-1"></i>{{ $t('order.summaryName') }}</span>
            <strong class="text-end">{{ form.name || $t('order.none') }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between gap-3">
            <span class="text-muted"><i class="bi bi-whatsapp me-1"></i>{{ $t('order.summaryPhone') }}</span>
            <strong>+62{{ form.phone }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between gap-3">
            <span class="text-muted"><i class="bi bi-building me-1"></i>{{ $t('order.summaryOrg') }}</span>
            <strong class="text-end">{{ form.org || $t('order.none') }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between gap-3">
            <span class="text-muted"><i class="bi bi-envelope me-1"></i>{{ $t('order.summaryEmail') }}</span>
            <strong class="text-end">{{ form.email || $t('order.none') }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between gap-3">
            <span class="text-muted"><i class="bi bi-geo-alt me-1"></i>{{ $t('order.summaryCity') }}</span>
            <strong>{{ form.city || $t('order.none') }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between gap-3">
            <span class="text-muted"><i class="bi bi-calendar3 me-1"></i>{{ $t('order.summaryTimeline') }}</span>
            <strong class="text-end">{{ form.timeline || $t('order.none') }}</strong>
          </li>
        </ul>

        <div class="alert alert-info small mb-0">
          <i class="bi bi-info-circle me-1"></i>
          {{ $t('order.priceNote', {}, priceNote) }} {{ $t('order.submitNote', {}, submitNote) }}
        </div>
      </div>

      <!-- Navigasi wizard -->
      <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
        <button v-if="currentStep > 0" type="button" class="btn btn-outline-secondary" @click="prev">
          <i class="bi bi-arrow-left me-1"></i> {{ $t('order.back') }}
        </button>
        <span v-else></span>
        <button v-if="!isLastStep" type="button" class="btn btn-primary px-4" @click="next">
          <i class="bi bi-arrow-right me-1"></i> {{ $t('order.next') }}
        </button>
        <button v-else type="button" class="btn btn-success px-4" @click="submit">
          <i class="bi bi-whatsapp me-1"></i> {{ $t('order.send') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { siteData } from "@/data/siteData"
import { buildWaUrl, getPrimaryWhatsApp } from "@/utils/whatsapp"
import { notifyWarning } from "@/utils/notify"

/**
 * OrderWizard — wizard pemesanan sistem/website.
 * Alur normal: Pilih Produk → Pilih Fitur (+ tambahan) → Biodata → Ringkasan.
 *
 * Bila dipanggil dari halaman detail produk (prop product-slug / initial-product),
 * langkah "Pilih Produk" dilewati dan produk langsung terkunci — pengguna mulai
 * dari centang fitur. Pesan dikirim ke WhatsApp 0858-1704-8266.
 *
 * Seluruh label UI memakai $t() dari src/i18n (ID/EN).
 */
export default {
  name: "OrderWizard",
  props: {
    /** Slug produk yang dipakai langsung (mode terkunci, dipakai di detail produk). */
    productSlug: { type: String, default: "" },
    /** Slug produk dari query URL /order?product=... (kompatibilitas link lama). */
    initialProduct: { type: String, default: "" },
  },
  data() {
    const config = siteData.orderWizard || {}
    return {
      steps: config.steps || [],
      customProduct: config.customProduct,
      priceNote: config.priceNote || "",
      submitNote: config.submitNote || "",
      timelineOptions: siteData.timelineOptions || [],
      activeCategory: "all",
      currentStep: 0,
      form: {
        productSlug: this.productSlug || this.initialProduct,
        features: [],
        extraFeatures: "",
        name: "",
        phone: "",
        org: "",
        email: "",
        city: "",
        timeline: "",
      },
    }
  },
  computed: {
    products() {
      return siteData.products || []
    },
    /** Produk sudah ditentukan dari prop → langkah pilih produk tidak perlu ditampilkan. */
    isProductLocked() {
      return Boolean(this.lockedSlug && this.products.some((p) => p.slug === this.lockedSlug))
    },
    lockedSlug() {
      return this.productSlug || this.initialProduct
    },
    /** Langkah yang benar-benar dirender (tanpa "Pilih Produk" saat produk terkunci). */
    activeSteps() {
      return this.isProductLocked ? this.steps.filter((s) => s.key !== "product") : this.steps
    },
    activeStepKey() {
      const step = this.activeSteps[this.currentStep]
      return step ? step.key : ""
    },
    isLastStep() {
      return this.currentStep >= this.activeSteps.length - 1
    },
    filterTabs() {
      const icons = { system: "bi-diagram-3", website: "bi-window" }
      return [
        { key: "all", label: "Semua", icon: "bi-grid" },
        ...(siteData.categories || []).map((c) => ({ ...c, icon: icons[c.key] || "bi-tag" })),
      ]
    },
    filteredProducts() {
      if (this.activeCategory === "all") return this.products
      return this.products.filter((p) => p.category === this.activeCategory)
    },
    selectedProduct() {
      if (this.customProduct && this.form.productSlug === this.customProduct.slug) return this.customProduct
      return this.products.find((p) => p.slug === this.form.productSlug) || null
    },
    selectedProductName() {
      return this.selectedProduct ? this.selectedProduct.name : "-"
    },
    isCustomRequest() {
      return Boolean(this.customProduct && this.form.productSlug === this.customProduct.slug)
    },
    availableFeatures() {
      const features = this.selectedProduct && this.selectedProduct.features
      return (features && features.items) || []
    },
    primaryWa() {
      return getPrimaryWhatsApp()
    },
  },
  watch: {
    lockedSlug: {
      immediate: true,
      handler(slug) {
        if (slug) this.form.productSlug = slug
      },
    },
    // Data produk di-fetch runtime — sesuaikan lagi setelah katalog tersedia.
    products: {
      handler(items) {
        if (this.lockedSlug && items.some((p) => p.slug === this.lockedSlug)) {
          this.form.productSlug = this.lockedSlug
        }
      },
    },
  },
  methods: {
    stepIcon(key) {
      const icons = {
        product: "bi-box-seam",
        features: "bi-ui-checks",
        profile: "bi-person-vcard",
        review: "bi-send-check",
      }
      return icons[key] || "bi-1-circle"
    },
    stepLabel(key) {
      const keys = {
        product: "order.stepProduct",
        features: "order.stepFeatures",
        profile: "order.stepProfile",
        review: "order.stepReview",
      }
      return this.$t(keys[key] || key)
    },
    selectProduct(slug) {
      if (this.form.productSlug === slug) return
      this.form.productSlug = slug
      // Fitur melekat pada produk — reset saat produk diganti.
      this.form.features = []
    },
    validateStep() {
      if (this.activeStepKey === "product" && !this.selectedProduct) {
        notifyWarning(this.$t("order.warnProduct"))
        return false
      }
      if (this.activeStepKey === "features") {
        if (!this.form.features.length && !this.form.extraFeatures) {
          notifyWarning(this.$t("order.warnFeature"))
          return false
        }
      }
      if (this.activeStepKey === "profile") {
        if (!this.form.name) {
          notifyWarning(this.$t("order.warnName"))
          return false
        }
        if (!/^[0-9]{8,13}$/.test(this.form.phone)) {
          notifyWarning(this.$t("order.warnPhone"))
          return false
        }
      }
      return true
    },
    next() {
      if (!this.validateStep()) return
      if (!this.isLastStep) {
        this.currentStep++
        this.scrollToWizard()
      }
    },
    prev() {
      if (this.currentStep > 0) {
        this.currentStep--
        this.scrollToWizard()
      }
    },
    scrollToWizard() {
      const el = this.$el
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    },
    buildOrderMessage() {
      const lines = [
        "Halo Kafeinarts 👋",
        "",
        "Saya ingin *ORDER SISTEM* melalui website kafeinarts.",
        "",
        "*Produk Dipilih*",
        `- Nama: ${this.selectedProductName}`,
        "",
        "*Fitur Dipilih*",
        ...(this.form.features.length ? this.form.features.map((f) => `- ${f}`) : ["-"]),
        "",
        "*Fitur Lainnya / Kebutuhan Tambahan*",
        this.form.extraFeatures || "-",
        "",
        "*Biodata*",
        `- Nama: ${this.form.name}`,
        `- No. WhatsApp: +62${this.form.phone}`,
        `- Bisnis/Instansi: ${this.form.org || "-"}`,
        `- Email: ${this.form.email || "-"}`,
        `- Kota: ${this.form.city || "-"}`,
        `- Target Waktu: ${this.form.timeline || "-"}`,
        "",
        "Saya memahami harga akan disepakati setelah scope project didiskusikan. Mohon dihubungi ya, terima kasih!",
        "",
        "— dikirim via kafeinarts.id",
      ]
      return lines.join("\n")
    },
    submit() {
      const message = this.buildOrderMessage()
      const url = buildWaUrl(this.primaryWa.wa, message)
      window.open(url, "_blank", "noopener")
      this.$emit("sent", { url, message, form: { ...this.form, features: [...this.form.features] } })
    },
  },
}
</script>

<style scoped>
.wizard-steps {
  --wizard-line: color-mix(in srgb, var(--default-color), transparent 80%);
}

.wizard-step {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.wizard-step:not(:last-child)::after {
  content: "";
  flex: 1;
  height: 2px;
  background: var(--wizard-line);
  margin: 0 10px;
}

.wizard-step.is-done:not(:last-child)::after,
.wizard-step.is-active:not(:last-child)::after {
  background: var(--accent-color);
}

.wizard-step-dot {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--default-color), transparent 88%);
  color: var(--default-color);
  font-size: 0.95rem;
  flex-shrink: 0;
}

.wizard-step.is-active .wizard-step-dot {
  background: var(--accent-color);
  color: #fff;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent-color), transparent 82%);
}

.wizard-step.is-done .wizard-step-dot {
  background: color-mix(in srgb, var(--accent-color), transparent 75%);
  color: var(--accent-color);
}

.wizard-step-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--default-color);
  white-space: nowrap;
}

.wizard-pane-title {
  display: flex;
  align-items: center;
  gap: 2px;
}

.wizard-pane-title i {
  color: var(--accent-color);
}

.order-filter-btn {
  border-radius: 50px;
  padding: 7px 16px;
  font-size: 0.85rem;
  font-weight: 600;
}

.wizard-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid color-mix(in srgb, var(--default-color), transparent 82%);
  border-radius: 12px;
  cursor: pointer;
  height: 100%;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.wizard-option:hover {
  border-color: color-mix(in srgb, var(--accent-color), transparent 55%);
}

.wizard-option.selected {
  border-color: var(--accent-color);
  background: color-mix(in srgb, var(--accent-color), transparent 94%);
}

.order-product-option {
  align-items: center;
}

.order-option-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease,
    box-shadow 0.25s ease, transform 0.18s ease;
}

.order-option-icon i {
  font-size: 20px;
}

.order-option-text {
  flex-grow: 1;
  min-width: 0;
}

.order-option-text strong {
  display: block;
  font-size: 0.95rem;
}

.order-option-text small {
  font-size: 0.8rem;
  line-height: 1.4;
  margin-top: 3px;
}

.order-option-check {
  color: var(--accent-color);
  opacity: 0;
  flex-shrink: 0;
}

.order-product-option.selected .order-option-check {
  opacity: 1;
}

.order-feature-option {
  align-items: flex-start;
}

.order-feature-option input {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--accent-color);
}

.order-feature-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.92rem;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease,
    box-shadow 0.25s ease, transform 0.18s ease;
}

.order-feature-option strong {
  font-size: 0.92rem;
  display: block;
}

.order-feature-option small {
  font-size: 0.8rem;
  line-height: 1.45;
  margin-top: 4px;
}

.input-group-text i {
  color: var(--accent-color);
  width: 16px;
}

.order-summary .list-group-item {
  padding-left: 0;
  padding-right: 0;
  font-size: 0.9rem;
}

.order-summary i {
  color: var(--accent-color);
}
</style>
