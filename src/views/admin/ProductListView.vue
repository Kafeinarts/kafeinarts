<template>
  <div>
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-primary">Produk & Layanan</div>
        <div class="text-grey-7">Kelola produk yang tampil di katalog dan halaman detail.</div>
      </div>
      <q-space />
      <q-btn color="primary" icon="add" label="Tambah Produk" :to="{ name: 'admin-product-new' }" />
    </div>

    <q-card flat bordered>
      <q-table :rows="items" :columns="columns" row-key="slug" :loading="loading" :filter="filter"
        :pagination="pagination" flat>
        <template v-slot:top>
          <q-input v-model="filter" outlined dense debounce="300" placeholder="Cari produk…" style="width: 280px">
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>
          <q-space />
          <q-chip dense color="primary" outline>{{ items.length }} produk</q-chip>
        </template>

        <template v-slot:body-cell-color="props">
          <q-td :props="props">
            <q-avatar size="26px" :style="{ background: props.row.meta?.color || '#00205D' }">
              <q-icon :name="props.row.meta?.icon || 'bi-box'" size="16px" color="white" />
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <span v-if="priceLabel(props.row.pricing)">{{ priceLabel(props.row.pricing) }}</span>
            <span v-else class="text-grey-5">—</span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat dense round size="sm" icon="visibility"
              :to="{ name: `product-${props.row.meta.slug}` }" target="_blank" title="Lihat" />
            <q-btn flat dense round size="sm" icon="edit" color="primary"
              :to="{ name: 'admin-product-edit', params: { slug: props.row.meta.slug } }" title="Edit" />
            <q-btn flat dense round size="sm" icon="delete" color="negative"
              @click="confirmDelete(props.row)" title="Hapus" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script>
import { putJson } from "@/services/githubService"
import { loadEditable } from "@/services/contentService"
import { CMS_PATHS } from "@/config/cms.config"
import { refreshCms } from "@/data/cmsStore"
import { priceLabel } from "@/data/products/index"

export default {
  name: "ProductListView",
  data() {
    return {
      items: [],
      sha: "",
      filter: "",
      loading: false,
      pagination: { rowsPerPage: 10 },
      priceLabel,
      columns: [
        { name: "color", label: "", field: "meta", style: "width: 50px" },
        { name: "name", label: "Produk", field: (row) => row.meta?.name, align: "left", sortable: true },
        { name: "slug", label: "Slug", field: (row) => row.meta?.slug, align: "left", sortable: true },
        { name: "category", label: "Kategori", field: (row) => row.meta?.category, align: "left", sortable: true },
        { name: "price", label: "Harga", field: "pricing", align: "left" },
        { name: "actions", label: "Aksi", field: "actions", align: "right" },
      ],
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      try {
        const file = await loadEditable(CMS_PATHS.products, [])
        this.items = JSON.parse(file.content)
        this.sha = file.sha
      } catch (error) {
        this.$q.notify({ type: "negative", message: error.message })
      } finally {
        this.loading = false
      }
    },
    confirmDelete(product) {
      this.$q.dialog({
        title: "Hapus produk?",
        message: `Produk "${product.meta?.name}" akan dihapus dari katalog.`,
        cancel: true,
        persistent: true,
        color: "negative",
      }).onOk(() => this.remove(product))
    },
    async remove(product) {
      try {
        const next = this.items.filter((item) => item.meta?.slug !== product.meta?.slug)
        await putJson(CMS_PATHS.products, next, this.sha, `CMS: hapus produk ${product.meta?.name}`)
        await refreshCms("products")
        this.$q.notify({ type: "positive", message: "Produk dihapus." })
        this.load()
      } catch (error) {
        this.$q.notify({ type: "negative", message: error.message })
      }
    },
  },
}
</script>
