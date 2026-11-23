/**
 * contentService — pembaca JSON publik.
 *
 * Sumber utama: raw.githubusercontent.com (single source of truth = GitHub).
 * Fallback      : /data/*.json di folder public (berguna saat offline / local).
 *
 * Setiap admin menyimpan perubahan, panggil markContentChanged() agar
 * cache-buster berubah dan pengunjung langsung mendapat versi terbaru.
 */
import { CMS_SOURCE, RAW_BASE, CMS_PATHS } from "@/config/cms.config"
import { getFile } from "@/services/githubService"

let bust = Date.now()

export function markContentChanged() {
  bust = Date.now()
}

/** URL lokal: "public/data/content.json" → "/data/content.json". */
export function publicUrl(path) {
  const clean = String(path).replace(/^public\//, "")
  const base = process.env.BASE_URL || "/"
  return `${base}${clean}`
}

export function sourceUrl(path) {
  const base = CMS_SOURCE === "local" ? publicUrl(path) : `${RAW_BASE}/${String(path).replace(/^\/+/, "")}`
  return `${base}${base.includes("?") ? "&" : "?"}t=${bust}`
}

/** Ambil satu JSON dengan fallback ke file lokal. */
export async function fetchCmsJson(path, fallback = null) {
  const tryFetch = async (url) => {
    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) throw new Error(`HTTP ${response.status} saat memuat ${path}`)
    return response.json()
  }

  try {
    return await tryFetch(sourceUrl(path))
  } catch (primaryError) {
    if (CMS_SOURCE !== "local") {
      try {
        return await tryFetch(publicUrl(path))
      } catch (fallbackError) {
        // lanjut ke fallback yang diberikan caller
      }
    }
    if (fallback !== null) return fallback
    throw primaryError
  }
}

/**
 * Versi editor dari getFile(): bila file belum ada di GitHub (404),
 * pakai data lokal sebagai draf awal. Saat disimpan, putFile akan
 * membuat file baru karena sha kosong.
 */
export async function loadEditable(path, fallback) {
  try {
    return await getFile(path)
  } catch (error) {
    if (error.status !== 404) throw error
    const data = await fetchCmsJson(path, fallback)
    return { path, sha: "", content: JSON.stringify(data, null, 2) }
  }
}

export const fetchContent = (fallback = null) => fetchCmsJson(CMS_PATHS.content, fallback)
export const fetchProducts = (fallback = []) => fetchCmsJson(CMS_PATHS.products, fallback)

export default { fetchCmsJson, fetchContent, fetchProducts, loadEditable, publicUrl, sourceUrl, markContentChanged }
