<template>
  <ProductDetailView v-if="product" :product="product" />
  <main v-else id="main-content" class="main" tabindex="-1">
    <section class="section">
      <div class="container text-center py-5">
        <h1>Produk tidak ditemukan</h1>
        <p class="mt-3">Produk yang Anda cari mungkin sudah dihapus atau diganti namanya.</p>
        <router-link :to="{ name: 'products' }" class="btn-hero-primary text-decoration-none mt-2">
          <i class="bi bi-grid me-2"></i>Lihat Semua Produk
        </router-link>
      </div>
    </section>
  </main>
</template>

<script>
/**
 * Renderer generik untuk semua produk (termasuk produk baru dari admin CMS).
 * Route /products/<slug> didaftarkan dengan path statis, jadi slug dikirim
 * lewat props oleh registerProductRoutes() — bukan dari $route.params.
 */
import ProductDetailView from "@/views/products/components/ProductDetailView.vue"
import { getProductBySlug } from "@/data/products/index"

export default {
  name: "ProductDetailRoute",
  components: { ProductDetailView },
  props: {
    slug: {
      type: String,
      default: "",
    },
  },
  computed: {
    product() {
      return getProductBySlug(this.slug) || null
    },
  },
}
</script>
