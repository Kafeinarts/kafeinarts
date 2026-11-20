import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import AboutView from '../views/AboutView.vue'
import WhyUsView from '../views/WhyUsView.vue'
import SkillsView from '../views/SkillsView.vue'
import ServicesView from '../views/ServicesView.vue'
import FaqView from '../views/FaqView.vue'
import TeamView from '../views/TeamView.vue'
import ContactView from '../views/ContactView.vue'
import OrderView from '../views/OrderView.vue'
import WebsiteServiceView from '../views/WebsiteServiceView.vue'
import { siteData } from '@/data/siteData'
import { productsState } from '@/data/products/index.js'
import { syncSeoForRoute } from '@/utils/seo'

const seo = siteData.seo

/** Meta untuk landing page SEO "jasa pembuatan website depok". */
const websiteSeo = {
  title: 'Jasa Pembuatan Website Depok — Kafeinarts',
  description:
    'Butuh jasa pembuatan website di Depok? Kafeinarts membuat website company profile, landing page, toko online, dan sistem web custom dengan Laravel, Vue.js, React & Next.js. Konsultasi gratis.',
  keywords:
    'jasa pembuatan website depok, jasa pembuatan website, jasa bikin web, jasa web depok, pembuatan website depok, web developer depok, jasa website depok, company profile depok, landing page depok',
  path: '/jasa-pembuatan-website-depok',
  image: 'assets/img/og-image.png',
  imageAlt: 'Jasa Pembuatan Website di Depok — Kafeinarts',
}

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: seo.title, path: '/' } },
  { path: '/products', name: 'products', component: ProductsView, meta: { title: `Produk Kami — ${seo.name}`, description: siteData.catalogPage.subtitle, path: '/products' } },
  { path: '/about', name: 'about', component: AboutView, meta: { title: `Tentang Kami — ${seo.name}`, path: '/about' } },
  { path: '/why-us', name: 'why-us', component: WhyUsView, meta: { title: `Kelebihan Kami — ${seo.name}`, path: '/why-us' } },
  { path: '/skills', name: 'skills', component: SkillsView, meta: { title: `Keahlian — ${seo.name}`, path: '/skills' } },
  { path: '/services', name: 'services', component: ServicesView, meta: { title: `Layanan — ${seo.name}`, path: '/services' } },
  { path: '/faq', name: 'faq', component: FaqView, meta: { title: `FAQ — ${seo.name}`, path: '/faq' } },
  { path: '/team', name: 'team', component: TeamView, meta: { title: `Tim Kami — ${seo.name}`, path: '/team' } },
  { path: '/contact', name: 'contact', component: ContactView, meta: { title: `Kontak — ${seo.name}`, path: '/contact' } },
  { path: '/order', name: 'order', component: OrderView, meta: { title: `Order Sistem — ${seo.name}`, description: siteData.orderWizard.page.subtitle, path: '/order' } },
  // Landing page SEO untuk pencarian "jasa pembuatan website depok" & variasi.
  { path: '/jasa-pembuatan-website-depok', name: 'website-service-depok', component: WebsiteServiceView, meta: websiteSeo },
  { path: '/jasa-pembuatan-website', redirect: { name: 'website-service-depok' } },
  { path: '/jasa-bikin-web', redirect: { name: 'website-service-depok' } },
  { path: '/pembuatan-website-depok', redirect: { name: 'website-service-depok' } },
  // Rute lama tetap aktif — sekarang memakai wizard order yang baru.
  { path: '/consultation', name: 'consultation', component: OrderView, meta: { title: `Order Sistem — ${seo.name}`, description: siteData.orderWizard.page.subtitle, path: '/order' } },
  { path: '/about-company', redirect: { name: 'about' } },
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Kembali ke posisi atas saat pindah halaman (anchor hash tetap dihormati)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

/**
 * Daftarkan route tiap produk — dipanggil dari main.js SETELAH data produk
 * selesai di-fetch dari /data/products/<slug>.json.
 *
 * Sumber kebenaran: public/data/products/<slug>.json + folder
 * src/views/products/<slug>/index.vue. Route bernama `product-<slug>`
 * dipakai ProductCard, navbar, dan section produk terkait.
 */
export function registerProductRoutes() {
  productsState.items.forEach((product) => {
    router.addRoute({
      path: `/products/${product.slug}`,
      name: `product-${product.slug}`,
      component: () => import(`../views/products/${product.slug}/index.vue`),
      meta: {
        title: `${product.name} — ${seo.name}`,
        description: product.desc,
        path: `/products/${product.slug}`,
      },
    })
  })
}

// SEO: selaraskan <title> & <link rel="canonical"> setiap kali route berubah.
router.afterEach((to) => {
  syncSeoForRoute({
    title: to.meta.title,
    description: to.meta.description,
    keywords: to.meta.keywords,
    path: to.meta.path,
    image: to.meta.image,
    imageAlt: to.meta.imageAlt,
  })
})

export default router
