<template>
  <div>
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-primary">{{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}</div>
        <div class="text-grey-7">Detail produk, fitur, harga, dan FAQ diedit di bawah ini.</div>
      </div>
      <q-space />
      <q-btn outline color="grey-8" icon="arrow_back" label="Kembali" :to="{ name: 'admin-products' }" />
    </div>

    <q-banner v-if="error" rounded class="bg-negative text-white q-mb-md">
      <template v-slot:avatar><q-icon name="error" /></template>
      {{ error }}
    </q-banner>

    <q-card flat bordered v-if="ready">
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="draft.meta.name" label="Nama produk" outlined dense />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="draft.meta.slug" label="Slug (URL)" outlined dense
            hint="contoh: company-profile" />
        </div>
        <div class="col-12 col-md-4">
          <q-input v-model="draft.meta.shortName" label="Nama singkat" outlined dense />
        </div>
        <div class="col-12 col-md-4">
          <q-input v-model="draft.meta.category" label="Kategori" outlined dense />
        </div>
        <div class="col-12 col-md-4">
          <q-input v-model="draft.meta.route" label="Route" outlined dense />
        </div>
        <div class="col-12">
          <div class="text-caption text-grey-7 q-mb-xs">Detail lengkap (hero, fitur, harga, FAQ, dll.)</div>
          <JsonForm :model="draft" />
        </div>
      </q-card-section>

      <q-separator />
      <q-card-section class="row items-center">
        <q-space />
        <q-btn outline color="grey-8" label="Batal" :to="{ name: 'admin-products' }" class="q-mr-sm" />
        <q-btn color="primary" icon="save" label="Simpan Produk" :loading="saving" @click="save" />
      </q-card-section>
    </q-card>

    <div v-else-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="42px" />
    </div>
  </div>
</template>

<script>
import JsonForm from "@/admin/components/JsonForm.vue"
import { useQuasar } from "quasar"
import { putJson } from "@/services/githubService"
import { loadEditable } from "@/services/contentService"
import { CMS_PATHS } from "@/config/cms.config"
import { refreshCms } from "@/data/cmsStore"
import { slugify } from "@/utils/format"

export default {
  name: "ProductEditorView",
  components: { JsonForm },
  setup() {
    return { $q: useQuasar() }
  },
  data() {
    return {
      ready: false,
      loading: false,
      saving: false,
      error: "",
      items: [],
      sha: "",
      draft: this.emptyDraft(),
    }
  },
  computed: {
    isEdit() {
      return Boolean(this.$route.params.slug)
    },
  },
  watch: {
    "draft.meta.name"(value) {
      if (!this.isEdit) this.draft.meta.slug = slugify(value)
    },
    "draft.meta.slug"(value) {
      this.draft.meta.route = `/products/${value}`
    },
  },
  mounted() {
    this.load()
  },
  methods: {
    emptyDraft() {
      return {
        is_demo: false,
        url_demo: "",
        meta: { slug: "", name: "", shortName: "", category: "system", icon: "bi-box", color: "#00205D", route: "" },
        hero: { name: "", tagline: "", headline: "", description: "", highlights: [] },
        overview: { heading: "", paragraphs: [], points: [] },
        features: { heading: "", subheading: "", items: [] },
        pricing: { plans: [] },
        faq: { items: [] },
      }
    },
    async load() {
      this.loading = true
      try {
        const file = await loadEditable(CMS_PATHS.products, [])
        this.items = JSON.parse(file.content)
        this.sha = file.sha
        if (this.isEdit) {
          const found = this.items.find((item) => item.meta?.slug === this.$route.params.slug)
          if (!found) {
            this.error = "Produk tidak ditemukan."
            return
          }
          this.draft = JSON.parse(JSON.stringify(found))
        }
        this.ready = true
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async save() {
      if (!this.draft.meta?.name || !this.draft.meta?.slug) {
        this.$q.notify({ type: "warning", message: "Nama dan slug produk wajib diisi." })
        return
      }
      this.saving = true
      try {
        const next = this.items.slice()
        const index = next.findIndex((item) => item.meta?.slug === this.draft.meta.slug)
        const payload = JSON.parse(JSON.stringify(this.draft))
        if (index >= 0) next[index] = payload
        else next.push(payload)

        await putJson(CMS_PATHS.products, next, this.sha, `CMS: simpan produk ${payload.meta.name}`)
        await refreshCms("products")
        this.$q.notify({ type: "positive", message: "Produk berhasil disimpan." })
        this.$router.push({ name: "admin-products" })
      } catch (error) {
        this.$q.notify({ type: "negative", message: error.message })
      } finally {
        this.saving = false
      }
    },
  },
}
</script>
