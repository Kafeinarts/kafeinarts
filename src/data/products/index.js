/**
 * Kafeinarts - Runtime Product Store
 * ------------------------------------------------------------------
 * Sumber produk: public/data/products.json (array, hasil edit admin CMS).
 * File lama public/data/products/<slug>.json tetap dipertahankan sebagai
 * arsip/fallback, tetapi tidak lagi di-fetch satu per satu.
 *
 * Semua konsumen membaca lewat store reaktif di sini, bukan import langsung.
 */
import { reactive } from "vue"
import { fetchProducts } from "@/services/contentService"

/** Daftar slug bawaan (urutan katalog lama). Produk baru otomatis ditambahkan dari JSON. */
export const PRODUCT_SLUGS = [
  "erp",
  "simrs",
  "lms",
  "cms",
  "event-management",
  "point-of-sale",
  "company-profile",
  "landing-page",
  "web-profile",
  "e-commerce",
  "undangan-digital",
]

/** State internal (reaktif). Array `items` diisi IN-PLACE agar referensi lama tetap valid. */
const state = reactive({
  items: [],
  loaded: false,
  loading: false,
  error: null,
})

export const productsState = state

/** URL lama masih dipakai sebagian komponen/konfigurasi. */
export function productJsonUrl(slug) {
  return `${process.env.BASE_URL}data/products/${slug}.json`
}

export function formatPrice(value, currency = "IDR") {
  if (typeof value !== "number" || Number.isNaN(value)) return ""
  return currency === "IDR"
    ? `Rp ${new Intl.NumberFormat("id-ID").format(value)}`
    : `${currency} ${new Intl.NumberFormat("id-ID").format(value)}`
}

export function priceLabel(plan) {
  if (!plan) return ""
  if (plan.priceLabel) return plan.priceLabel
  if (plan.price != null) return formatPrice(plan.price, plan.currency)
  return "Konsultasikan Sekarang"
}

export function priceFrom(pricing) {
  const plans = (pricing && pricing.plans) || []
  const numeric = plans.filter((p) => typeof p.price === "number")
  if (numeric.length === 0) return null
  const cheapest = numeric.reduce((a, b) => (a.price <= b.price ? a : b))
  return {
    label: formatPrice(cheapest.price, cheapest.currency),
    period: cheapest.period || "",
    name: cheapest.name,
  }
}

/** Petakan JSON mentah menjadi objek produk siap pakai. */
export function mapProduct(json) {
  const meta = json.meta || {}
  const slug = meta.slug || ""
  return {
    slug,
    name: meta.name || slug,
    shortName: meta.shortName || slug,
    category: meta.category || "system",
    icon: meta.icon || "bi-box",
    color: meta.color || "#00205D",
    tagline: (json.hero && json.hero.tagline) || "",
    desc: (json.hero && json.hero.description) || "",
    priceFrom: priceFrom(json.pricing),
    ...json,
  }
}

/** Isi store dari array JSON mentah (dipakai CMS saat refresh). */
export function applyProducts(rawItems) {
  const items = (Array.isArray(rawItems) ? rawItems : []).map(mapProduct)
  state.items.splice(0, state.items.length, ...items)
  state.loaded = true
  state.loading = false
  state.error = null
  return items
}

let loadPromise = null

/** Fetch products.json sekali, simpan di store reaktif. */
export function loadProducts() {
  if (state.loaded && loadPromise) return loadPromise
  state.loading = true

  loadPromise = fetchProducts([])
    .then((raw) => applyProducts(raw))
    .catch((err) => {
      state.loading = false
      state.error = (err && err.message) || "Gagal memuat data produk"
      loadPromise = null
      console.error("[products] gagal memuat data produk:", err)
      throw err
    })

  return loadPromise
}

/** Semua produk (array reaktif). */
export function getProducts() {
  return state.items
}

/** Slug produk aktif — dipakai router untuk mendaftarkan route secara dinamis. */
export function getProductSlugs() {
  return state.items.map((p) => p.slug).filter(Boolean)
}

export function getProductBySlug(slug) {
  return state.items.find((p) => p.slug === slug) || null
}

export function getOtherProducts(slug, limit = 3) {
  return state.items.filter((p) => p.slug !== slug).slice(0, limit)
}

export default {
  productsState,
  PRODUCT_SLUGS,
  loadProducts,
  applyProducts,
  getProducts,
  getProductSlugs,
  getProductBySlug,
  getOtherProducts,
  mapProduct,
  formatPrice,
  priceLabel,
  priceFrom,
  productJsonUrl,
}
