/**
 * SEO utils - Kafeinarts
 * ------------------------------------------------------------------
 * Bertanggung jawab atas:
 *   1. SITE_URL  -> sumber kebenaran URL produksi untuk JSON-LD.
 *   2. buildJsonLd() -> structured data (schema.org) dari siteData:
 *      Organization, WebSite + internal WebPage (About/Services/Products/
 *      Order/Contact), LocalBusiness + ContactAction WhatsApp, FAQPage,
 *      ItemList layanan, ItemList penawaran keyword (IT solution, jasa web,
 *      jasa pengembang app, dll.) dan ItemList produk.
 *   3. injectJsonLd() -> menyisipkan <script type="application/ld+json">.
 *   4. syncSeoForRoute() -> <title>, canonical, meta description, Open Graph,
 *      Twitter card, serta WebPage + BreadcrumbList per halaman.
 *
 * Meta deskripsi/keywords/Open Graph dasar TETAP ada di public/index.html
 * agar terbaca crawler tanpa JavaScript. File ini hanya menyempurnakannya
 * saat SPA berpindah rute.
 */
import { siteData } from "@/data/siteData"
import { getPrimaryWhatsApp, getWhatsAppTargets, buildWaUrl } from "@/utils/whatsapp"

/** URL produksi. Ganti di sini + public/index.html + sitemap.xml + robots.txt */
export const SITE_URL = "https://kafeinarts.vercel.app"
export const SITE_TITLE = siteData.seo.title

/** Buang semua tag HTML agar aman dipakai sebagai teks schema.org */
export const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

/** "assets/img/x.png" -> "https://kafeinarts.vercel.app/assets/img/x.png" */
export const absoluteUrl = (path = "") =>
  `${SITE_URL}/${String(path).replace(/^\/+/, "")}`

/** URL absolut dari path internal ("/about" -> "https://.../about"). */
const routeUrl = (path = "/") => `${SITE_URL}${String(path).startsWith("/") ? path : `/${path}`}`

/** Judul route ("ERP — Kafeinarts Interactive" -> "ERP"). */
const cleanTitle = (title = "") =>
  String(title)
    .replace(/\s+[—|]\s+.*$/, "")
    .trim()

/**
 * Susun seluruh objek structured data.
 * @returns {Array<Object>} daftar objek schema.org (siap di-JSON.stringify)
 */
export function buildJsonLd() {
  const { contact, seo, seoConfig = {} } = siteData
  // JSON baru: faq & services berbentuk objek dengan key "items"
  const faq = siteData.faq.items
  const services = siteData.services.items
  const products = siteData.products || []
  const keywords = seoConfig.keywords || []
  const offerings = seoConfig.offerings || []
  const internalPages = seoConfig.internalPages || []
  const areaServed = seoConfig.areaServed || seo.areaServed

  const organizationId = `${SITE_URL}/#organization`
  const websiteId = `${SITE_URL}/#website`
  const imageUrl = absoluteUrl(seo.image)
  const logoUrl = absoluteUrl(seo.logo)
  const waTargets = getWhatsAppTargets()
  const waPrimary = getPrimaryWhatsApp()
  const waIT = (waTargets.find((t) => t.key === "staffIT") || waPrimary).wa
  const waCS = (waTargets.find((t) => t.key === "staffCS") || waPrimary).wa
  const waText =
    "Halo Kafeinarts, saya ingin konsultasi IT solution, jasa web, atau pengembangan aplikasi."
  const waUrl = buildWaUrl(waPrimary.wa, waText)

  const address = {
    "@type": "PostalAddress",
    addressLocality: "Depok",
    addressRegion: "Jawa Barat",
    addressCountry: "ID",
  }

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: seo.name,
    legalName: seo.name,
    url: `${SITE_URL}/`,
    logo: logoUrl,
    image: imageUrl,
    description: seo.description,
    inLanguage: seo.inLanguage,
    email: contact.info.email,
    telephone: contact.info.phone,
    address,
    areaServed,
    knowsAbout: keywords,
    sameAs: seo.sameAs.filter(Boolean),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: `+${waCS}`,
        url: waUrl,
        areaServed,
        availableLanguage: ["id", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "technical support",
        telephone: `+${waIT}`,
        url: waUrl,
        areaServed,
        availableLanguage: ["id", "en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: `+${waPrimary.wa}`,
        email: contact.info.email,
        url: waUrl,
        areaServed,
        availableLanguage: ["id", "en"],
      },
    ],
  }

  // Internal link structured data: Google bisa menelusuri Tentang → Layanan
  // → Produk → Order → Kontak langsung dari graph, bukan hanya dari menu.
  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${SITE_URL}/`,
    name: seo.name,
    description: seo.description,
    inLanguage: seo.inLanguage,
    publisher: { "@id": organizationId },
    hasPart: internalPages.map((page) => ({
      "@type": "WebPage",
      "@id": `${routeUrl(page.path)}#webpage`,
      url: routeUrl(page.path),
      name: page.name,
      description: page.description,
      inLanguage: seo.inLanguage,
      isPartOf: { "@id": websiteId },
    })),
  }

  const localBusiness = {
    // LocalBusiness (dipahami Google) + subtype ProfessionalService
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: seo.name,
    url: `${SITE_URL}/`,
    image: imageUrl,
    logo: logoUrl,
    description: seo.description,
    telephone: contact.info.phone,
    email: contact.info.email,
    address,
    geo: {
      "@type": "GeoCoordinates",
      latitude: seo.geo.latitude,
      longitude: seo.geo.longitude,
    },
    areaServed,
    knowsLanguage: ["id", "en"],
    sameAs: seo.sameAs.filter(Boolean),
    parentOrganization: { "@id": organizationId },
    potentialAction: {
      "@type": "ContactAction",
      name: "Hubungi Kafeinarts via WhatsApp",
      target: {
        "@type": "EntryPoint",
        urlTemplate: waUrl,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  }

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(item.a),
      },
    })),
  }

  const serviceList = {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#services`,
    name: "Layanan Kafeinarts",
    description: "Daftar layanan digital yang ditawarkan Kafeinarts Interactive",
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        serviceType: service.title,
        description: stripHtml(service.desc),
        url: `${SITE_URL}/services`,
        areaServed,
        provider: { "@id": organizationId },
      },
    })),
  }

  // Penawaran dengan keyword pencarian (IT solution, jasa web, app developer,
  // ERP, SaaS, cloud). Tiap Service punya tautan internal + kanal WhatsApp.
  const offeringList = {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#offerings`,
    name: "Jasa IT Solution, Web & Pengembangan Aplikasi Kafeinarts",
    description:
      "Layanan yang bisa dipesan: IT solution, jasa pembuatan website, jasa pengembang app, sistem manajemen, SaaS, dan cloud.",
    numberOfItems: offerings.length,
    itemListElement: offerings.map((offering, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: routeUrl(offering.url),
      item: {
        "@type": "Service",
        "@id": `${routeUrl(offering.url)}#service-${index + 1}`,
        name: offering.name,
        serviceType: offering.serviceType,
        description: offering.description,
        keywords: (offering.keywords || []).join(", "),
        url: routeUrl(offering.url),
        areaServed,
        provider: { "@id": organizationId },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: waUrl,
          servicePhone: contact.info.phone,
          availableLanguage: ["id", "en"],
        },
      },
    })),
  }

  // Internal link ke tiap halaman produk (dari store runtime).
  const productList = {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#products`,
    name: "Produk Digital Kafeinarts",
    description:
      "Sistem manajemen dan aplikasi siap pakai yang dapat dikustomisasi: ERP, SIMRS, LMS, CMS, POS, website, dan e-commerce.",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/products/${product.slug}`,
      item: {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/products/${product.slug}#software`,
        name: product.name,
        description: stripHtml(product.desc || product.description || ""),
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        url: `${SITE_URL}/products/${product.slug}`,
        provider: { "@id": organizationId },
        areaServed,
      },
    })),
  }

  return [
    organization,
    website,
    localBusiness,
    faqPage,
    serviceList,
    offeringList,
    productList,
  ]
}

/** Sisipkan (atau timpa) tag JSON-LD di <head>. */
export function injectJsonLd() {
  if (typeof document === "undefined") return false
  const existing = document.getElementById("seo-jsonld")
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing)

  const script = document.createElement("script")
  script.id = "seo-jsonld"
  script.type = "application/ld+json"
  script.text = JSON.stringify(buildJsonLd(), null, 2)
  document.head.appendChild(script)
  return true
}

/** Set atribut content pada <meta> (dibuat bila belum ada). */
function setMetaContent(attribute, key, value) {
  if (!value || typeof document === "undefined") return
  const selector = `meta[${attribute}="${key}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attribute, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", value)
}

/** Susun BreadcrumbList berdasarkan path SPA. */
function buildBreadcrumb(path, title) {
  const trail = [{ name: "Beranda", url: `${SITE_URL}/` }]
  const segments = String(path || "")
    .split("/")
    .filter(Boolean)

  if (segments[0] === "products") {
    if (segments[1]) {
      trail.push({ name: "Produk", url: `${SITE_URL}/products` })
      const product = (siteData.products || []).find((p) => p.slug === segments[1])
      trail.push({
        name: product ? product.name : cleanTitle(title) || segments[1],
        url: `${SITE_URL}/products/${segments[1]}`,
      })
    } else {
      trail.push({ name: "Produk", url: `${SITE_URL}/products` })
    }
  } else if (segments[0]) {
    const labels = {
      about: "Tentang Kami",
      services: "Layanan",
      faq: "FAQ",
      contact: "Kontak",
      order: "Order Sistem",
      "why-us": "Kelebihan Kami",
      skills: "Keahlian",
      team: "Tim Kami",
    }
    trail.push({
      name: labels[segments[0]] || cleanTitle(title) || segments[0],
      url: `${SITE_URL}/${segments[0]}`,
    })
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${routeUrl(path)}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** WebPage + BreadcrumbList khusus halaman yang sedang dibuka. */
function injectRouteJsonLd({ path, title, description }) {
  if (typeof document === "undefined") return false
  const existing = document.getElementById("seo-jsonld-route")
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing)

  const breadcrumb = buildBreadcrumb(path, title)
  const webPage = {
    "@type": "WebPage",
    "@id": `${routeUrl(path)}#webpage`,
    url: routeUrl(path),
    name: title,
    description,
    inLanguage: siteData.seo.inLanguage,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    breadcrumb: { "@id": `${routeUrl(path)}#breadcrumb` },
  }

  const script = document.createElement("script")
  script.id = "seo-jsonld-route"
  script.type = "application/ld+json"
  script.text = JSON.stringify({ "@context": "https://schema.org", "@graph": [webPage, breadcrumb] }, null, 2)
  document.head.appendChild(script)
  return true
}

/**
 * Setel title, canonical, meta description, OG/Twitter, dan structured data
 * sesuai route yang dibuka.
 * @param {Object} [overrides] opsional: { title, description, path }
 *        dipakai halaman produk/katalog untuk SEO per-halaman.
 */
export function syncSeoForRoute(overrides = {}) {
  if (typeof document === "undefined") return
  const path = overrides.path || "/"
  const canonicalUrl = routeUrl(path)
  const title = overrides.title || SITE_TITLE
  const description = overrides.description || siteData.seo.description

  document.title = title

  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement("link")
    link.setAttribute("rel", "canonical")
    document.head.appendChild(link)
  }
  link.setAttribute("href", canonicalUrl)

  setMetaContent("name", "description", description)
  setMetaContent("property", "og:title", title)
  setMetaContent("property", "og:description", description)
  setMetaContent("property", "og:url", canonicalUrl)
  setMetaContent("name", "twitter:title", title)
  setMetaContent("name", "twitter:description", description)

  injectRouteJsonLd({ path, title, description })
}

/** Jalankan semuanya (dipanggil dari App.vue). */
export function initSeo() {
  injectJsonLd()
  syncSeoForRoute()
}

export default {
  SITE_URL,
  SITE_TITLE,
  buildJsonLd,
  injectJsonLd,
  syncSeoForRoute,
  initSeo,
}
