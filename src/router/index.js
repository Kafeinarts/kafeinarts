import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProductsView from "../views/ProductsView.vue";
import AboutView from "../views/AboutView.vue";
import WhyUsView from "../views/WhyUsView.vue";
import SkillsView from "../views/SkillsView.vue";
import ServicesView from "../views/ServicesView.vue";
import FaqView from "../views/FaqView.vue";
import TeamView from "../views/TeamView.vue";
import ContactView from "../views/ContactView.vue";
import OrderView from "../views/OrderView.vue";
import WebsiteServiceView from "../views/WebsiteServiceView.vue";
import { siteData } from "@/data/siteData";
import { getProductSlugs, getProductBySlug } from "@/data/products/index.js";
import { syncSeoForRoute } from "@/utils/seo";

const seo = siteData.seo;

/**
 * Landing page SEO massal: satu halaman per kota untuk menangkap pencarian
 * "jasa pembuatan website <kota>", "jasa bikin web <kota>", dll.
 */
const landingCities = [
  { slug: "depok", city: "Depok" },
  { slug: "bekasi", city: "Bekasi" },
  { slug: "bogor", city: "Bogor" },
  { slug: "jakarta", city: "Jakarta" },
  { slug: "karawang", city: "Karawang" },
  { slug: "surabaya", city: "Surabaya" },
  { slug: "malang", city: "Malang" },
  { slug: "bandung", city: "Bandung" },
  { slug: "semarang", city: "Semarang" },
  { slug: "tangerang", city: "Tangerang" },
];

const makeLandingSeo = ({ slug, city }) => ({
  city,
  title: `Jasa Pembuatan Website ${city} — Kafeinarts`,
  description: `Butuh jasa pembuatan website di ${city}? Kafeinarts membuat website company profile, landing page, toko online, dan sistem web custom dengan Laravel, Vue.js, React & Next.js. Konsultasi gratis, onsite & remote.`,
  keywords: `jasa pembuatan website ${slug}, jasa pembuatan website ${city}, jasa bikin web ${slug}, jasa web ${city}, pembuatan website ${city}, web developer ${city}, jasa website ${city}, company profile ${city}, landing page ${city}`,
  path: `/jasa-pembuatan-website-${slug}`,
  image: "assets/img/og-image-v2.png",
  imageAlt: `Jasa Pembuatan Website di ${city} — Kafeinarts`,
});

const landingRoutes = landingCities.map((item) => ({
  path: `/jasa-pembuatan-website-${item.slug}`,
  name: `website-service-${item.slug}`,
  component: WebsiteServiceView,
  meta: makeLandingSeo(item),
}));

/** Alias populer diarahkan ke halaman Depok (canonical tetap satu). */
const landingAliases = [
  "/jasa-pembuatan-website",
  "/jasa-bikin-web",
  "/pembuatan-website-depok",
  "/jasa-web-depok",
].map((path) => ({ path, redirect: { name: "website-service-depok" } }));

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { title: seo.title, path: "/" },
  },
  {
    path: "/products",
    name: "products",
    component: ProductsView,
    meta: {
      title: `Produk Kami — ${seo.name}`,
      description: siteData.catalogPage.subtitle,
      path: "/products",
    },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: { title: `Tentang Kami — ${seo.name}`, path: "/about" },
  },
  {
    path: "/why-us",
    name: "why-us",
    component: WhyUsView,
    meta: { title: `Kelebihan Kami — ${seo.name}`, path: "/why-us" },
  },
  {
    path: "/skills",
    name: "skills",
    component: SkillsView,
    meta: { title: `Keahlian — ${seo.name}`, path: "/skills" },
  },
  {
    path: "/services",
    name: "services",
    component: ServicesView,
    meta: { title: `Layanan — ${seo.name}`, path: "/services" },
  },
  {
    path: "/faq",
    name: "faq",
    component: FaqView,
    meta: { title: `FAQ — ${seo.name}`, path: "/faq" },
  },
  {
    path: "/team",
    name: "team",
    component: TeamView,
    meta: { title: `Tim Kami — ${seo.name}`, path: "/team" },
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
    meta: { title: `Kontak — ${seo.name}`, path: "/contact" },
  },
  {
    path: "/order",
    name: "order",
    component: OrderView,
    meta: {
      title: `Order Sistem — ${seo.name}`,
      description: siteData.orderWizard.page.subtitle,
      path: "/order",
    },
  },
  // Landing page SEO per kota + alias kata kunci populer.
  ...landingRoutes,
  ...landingAliases,
  // Rute lama tetap aktif — sekarang memakai wizard order yang baru.
  {
    path: "/consultation",
    name: "consultation",
    component: OrderView,
    meta: {
      title: `Order Sistem — ${seo.name}`,
      description: siteData.orderWizard.page.subtitle,
      path: "/order",
    },
  },
  // ================= CMS / ADMIN (layout Quasar murni) =================
  {
    path: "/admin",
    component: () => import("../layouts/AdminLayout.vue"),
    meta: { layout: "admin" },
    children: [
      { path: "", name: "admin-dashboard", component: () => import("../views/admin/DashboardView.vue"), meta: { title: "Dashboard — Kafeinarts CMS" } },
      { path: "content", name: "admin-content", component: () => import("../views/admin/ContentEditorView.vue"), meta: { title: "Editor Konten — Kafeinarts CMS" } },
      { path: "products", name: "admin-products", component: () => import("../views/admin/ProductListView.vue"), meta: { title: "Produk — Kafeinarts CMS" } },
      { path: "products/new", name: "admin-product-new", component: () => import("../views/admin/ProductEditorView.vue"), meta: { title: "Tambah Produk — Kafeinarts CMS" } },
      { path: "products/:slug/edit", name: "admin-product-edit", component: () => import("../views/admin/ProductEditorView.vue"), meta: { title: "Edit Produk — Kafeinarts CMS" } },
      { path: "media", name: "admin-media", component: () => import("../views/admin/MediaView.vue"), meta: { title: "Media — Kafeinarts CMS" } },
    ],
  },
  { path: "/about-company", redirect: { name: "about" } },
  { path: "/:pathMatch(.*)*", redirect: { name: "home" } },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Kembali ke posisi atas saat pindah halaman (anchor hash tetap dihormati)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
});

/**
 * Daftarkan route tiap produk — dipanggil dari main.js SETELAH data produk
 * selesai di-fetch dari /data/products/<slug>.json.
 *
 * Sumber kebenaran: public/data/products/<slug>.json + folder
 * src/views/products/<slug>/index.vue. Route bernama `product-<slug>`
 * dipakai ProductCard, navbar, dan section produk terkait.
 */
export function registerProductRoutes() {
  // Satu komponen generik untuk semua produk → produk baru dari admin
  // langsung punya halaman tanpa perlu membuat folder Vue baru.
  const detailComponent = () => import("../views/products/ProductDetailRoute.vue")
  getProductSlugs().forEach((slug) => {
    const product = getProductBySlug(slug)
    router.addRoute({
      path: `/products/${slug}`,
      name: `product-${slug}`,
      component: detailComponent,
      meta: {
        title: `${product ? product.name : slug} — ${seo.name}`,
        description: product ? product.desc : "",
        path: `/products/${slug}`,
      },
    });
  });
}

// SEO: selaraskan <title> & <link rel="canonical"> setiap kali route berubah.
router.afterEach((to) => {
  if (to.meta.layout === "admin") return
  syncSeoForRoute({
    title: to.meta.title,
    description: to.meta.description,
    keywords: to.meta.keywords,
    path: to.meta.path,
    image: to.meta.image,
    imageAlt: to.meta.imageAlt,
  });
});

export default router;
