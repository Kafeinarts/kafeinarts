/** Definisi tab editor konten. Bentuk field dibaca otomatis dari JSON. */

export const HIDDEN_KEYS = ["products", "_catatan"]

/** Key yang sebaiknya memakai editor HTML (bukan input biasa). */
export const HTML_KEYS = [
  "title", "subtitle", "description", "desc", "intro", "text", "heading",
  "content", "answer", "a", "q", "tagline", "headline", "excerpt", "bio",
  "paragraph", "paragraphs", "note", "detail", "text1", "text2",
]

export const CONTENT_SECTIONS = [
  { key: "hero", label: "Hero (Beranda)" },
  { key: "about", label: "Tentang Kami" },
  { key: "whyUs", label: "Kelebihan Kami" },
  { key: "skills", label: "Keahlian" },
  { key: "services", label: "Layanan" },
  { key: "faq", label: "FAQ" },
  { key: "team", label: "Tim" },
  { key: "contact", label: "Kontak" },
  { key: "footer", label: "Footer" },
  { key: "brand", label: "Brand" },
  { key: "seo", label: "SEO" },
  { key: "nav", label: "Menu Navigasi" },
  { key: "navCta", label: "Tombol Navigasi" },
  { key: "catalogPage", label: "Halaman Katalog" },
  { key: "categories", label: "Kategori" },
  { key: "page", label: "Konsultasi" },
  { key: "meetingModes", label: "Mode Pertemuan" },
  { key: "serviceTypes", label: "Jenis Layanan" },
  { key: "budgetRanges", label: "Rentang Budget" },
  { key: "timelineOptions", label: "Opsi Timeline" },
  { key: "wizard", label: "Wizard" },
  { key: "orderWizard", label: "Wizard Order" },
]

export default CONTENT_SECTIONS
