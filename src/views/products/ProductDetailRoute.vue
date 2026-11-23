<template>
  <ProductDetailView :product="product" />
</template>

<script>
/**
 * Renderer generik untuk semua produk (termasuk produk baru dari admin CMS).
 * Route /products/:slug mendaftarkan komponen ini, jadi menambah produk
 * tidak lagi memerlukan folder Vue baru.
 */
import ProductDetailView from "@/views/products/components/ProductDetailView.vue"
import { getProductBySlug, mapProduct } from "@/data/products/index"

export default {
  name: "ProductDetailRoute",
  components: { ProductDetailView },
  computed: {
    product() {
      const slug = this.$route.params.slug
      return (
        getProductBySlug(slug) ||
        mapProduct({ meta: { slug, name: slug, route: `/products/${slug}` } })
      )
    },
  },
}
</script>
