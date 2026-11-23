/**
 * cmsStore — state reaktif terpusat untuk seluruh konten CMS.
 * Dipanggil sekali di main.js sebelum app di-mount, dan dipanggil ulang
 * oleh admin setelah setiap commit ke GitHub.
 */
import { reactive } from "vue"
import { fetchContent, fetchProducts, markContentChanged } from "@/services/contentService"
import { applyRemoteContent } from "@/data/siteData"
import { productsState, applyProducts } from "@/data/products/index"

export const cmsState = reactive({
  content: null,
  products: productsState.items,
  loading: false,
  loaded: false,
  error: null,
  lastSynced: null,
})

function applyAll(content, products) {
  applyRemoteContent(content)
  applyProducts(products)
  cmsState.content = content
  cmsState.products = productsState.items
  cmsState.loaded = true
  cmsState.error = null
  cmsState.lastSynced = Date.now()
}

let loadPromise = null

/** Muat seluruh konten (content + products). */
export function loadCms() {
  if (loadPromise) return loadPromise
  cmsState.loading = true
  loadPromise = Promise.all([fetchContent(null), fetchProducts([])])
    .then(([content, products]) => {
      applyAll(content, products)
      cmsState.loading = false
      return cmsState
    })
    .catch((error) => {
      cmsState.loading = false
      cmsState.error = (error && error.message) || "Gagal memuat konten CMS"
      loadPromise = null
      console.error("[cms] gagal memuat konten:", error)
      throw error
    })
  return loadPromise
}

/**
 * Ambil ulang data setelah admin menyimpan ke GitHub.
 * @param {"content"|"products"|"all"} key
 */
export async function refreshCms(key = "all") {
  markContentChanged()
  cmsState.loading = true
  try {
    const [content, products] = await Promise.all([
      key === "products" ? Promise.resolve(cmsState.content) : fetchContent(null),
      key === "content" ? Promise.resolve(cmsState.products.slice()) : fetchProducts([]),
    ])
    applyAll(content, products)
    return cmsState
  } finally {
    cmsState.loading = false
  }
}

export default { cmsState, loadCms, refreshCms }
