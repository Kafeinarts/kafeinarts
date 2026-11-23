/**
 * Kafeinarts - Central Data Index (Vue)
 * ------------------------------------------------------------------
 * Seluruh konten situs dipisah per-modul JSON di folder src/data/:
 *   - brand.json         : identitas brand & SEO
 *   - nav.json           : struktur menu navbar
 *   - pages.json         : konten halaman (hero, about, whyUs, skills, services, faq, team)
 *   - catalog.json       : halaman katalog produk (title, kategori, urutan)
 *   - products/index.js  : runtime store produk (fetch JSON saat app jalan)
 *   - public/data/products/<slug>.json : KONTEN LENGKAP tiap produk (detail,
 *     harga, FAQ) — di-fetch runtime, terlihat di DevTools → tab Network.
 *   - consultation.json  : wizard konsultasi/penawaran
 *   - order.json         : wizard order sistem (produk → fitur → biodata → WA)
 *   - contact.json       : kontak & tujuan WhatsApp
 *   - footer.json        : newsletter, link, sosial media
 *
 * Cara menambah/mengubah data: edit file JSON terkait — tidak perlu
 * menyentuh komponen. Import dari file ini (index) agar konsisten.
 * Untuk produk: edit public/data/products/<slug>.json (satu file per produk).
 */
import brandJson from "./brand.json";
import navJson from "./nav.json";
import pagesJson from "./pages.json";
import catalogJson from "./catalog.json";
import { productsState as productStore } from "./products/index.js";
import consultationJson from "./consultation.json";
import orderJson from "./order.json";
import contactJson from "./contact.json";
import footerJson from "./footer.json";
import { reactive } from "vue";

/** Objek gabungan dengan shape mirip siteData lama (kompatibilitas). */
export const siteData = reactive({
  ...brandJson,
  nav: navJson.items,
  navCta: navJson.cta,
  ...pagesJson,
  ...catalogJson,
  // products = array reaktif dari runtime store (public/data/products/*.json).
  // Referensinya stabil: array diisi in-place setelah fetch selesai, sehingga
  // semua komponen yang membaca siteData.products otomatis ter-update.
  products: productStore.items,
  ...consultationJson,
  // orderWizard = konfigurasi wizard order sistem (src/data/order.json).
  orderWizard: orderJson,
  // contact dibungkus agar aksesnya siteData.contact.info / .whatsapp
  contact: contactJson,
  footer: footerJson,
});

/**
 * Timpa konten dari public/data/content.json (hasil edit admin).
 * Melakukan deep-merge IN-PLACE agar identitas objek (mis. siteData.hero)
 * tetap sama — komponen lama yang mengimpor `{ hero }` ikut ter-update.
 * Key "products" dilewati karena products memakai store runtime sendiri.
 */
function mergeInto(target, source) {
  Object.keys(source || {}).forEach((key) => {
    if (key === "products") return
    const next = source[key]
    const current = target[key]
    if (Array.isArray(next)) {
      if (Array.isArray(current)) current.splice(0, current.length, ...next)
      else target[key] = next.slice()
    } else if (next && typeof next === "object" && current && typeof current === "object") {
      mergeInto(current, next)
    } else {
      target[key] = next
    }
  })
}

export function applyRemoteContent(content) {
  if (!content || typeof content !== "object") return
  mergeInto(siteData, content)
}

export const {
  brand,
  seo,
  nav,
  navCta,
  hero,
  about,
  whyUs,
  skills,
  services,
  faq,
  team,
  catalogPage,
  categories,
  products,
  page: consultationPage,
  meetingModes,
  serviceTypes,
  budgetRanges,
  timelineOptions,
  wizard,
  orderWizard,
  contact,
} = siteData;

export default siteData;
