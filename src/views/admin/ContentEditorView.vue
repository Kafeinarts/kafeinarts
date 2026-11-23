<template>
  <div>
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-primary">Editor Konten</div>
        <div class="text-grey-7">Ubah teks website per halaman. Perubahan disimpan sebagai commit GitHub.</div>
      </div>
      <q-space />
      <q-btn outline color="primary" icon="refresh" label="Tarik dari GitHub" :loading="loading" @click="loadFromGithub" class="q-mr-sm" />
      <q-btn color="primary" icon="save" label="Simpan Perubahan" :loading="saving" @click="save" />
    </div>

    <q-banner v-if="!hasToken" rounded class="bg-warning text-dark q-mb-md">
      <template v-slot:avatar><q-icon name="warning" /></template>
      Token GitHub belum diisi di <code>.env.local</code>. Editor tetap bisa dibuka, tetapi menyimpan akan gagal.
    </q-banner>

    <q-banner v-if="error" rounded class="bg-negative text-white q-mb-md">
      <template v-slot:avatar><q-icon name="error" /></template>
      {{ error }}
    </q-banner>

    <q-card flat bordered v-if="ready">
      <q-tabs v-model="tab" narrow-indicator dense align="left" class="text-primary section-tabs">
        <q-tab v-for="section in sections" :key="section.key" :name="section.key" :label="section.label" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel v-for="section in sections" :key="section.key" :name="section.key" class="q-pa-lg">
          <div v-if="draft[section.key] === undefined" class="text-grey-7">
            Bagian ini belum ada di content.json.
          </div>
          <JsonForm v-else :model="draft[section.key]" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <div v-else-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="42px" />
      <div class="text-caption text-grey-6 q-mt-sm">Memuat konten dari GitHub…</div>
    </div>
  </div>
</template>

<script>
import JsonForm from "@/admin/components/JsonForm.vue"
import CONTENT_SECTIONS, { HIDDEN_KEYS } from "@/admin/schemas/contentSchema"
import { CMS_PATHS } from "@/config/cms.config"
import { hasGithubToken } from "@/config/cms.config"
import { putJson } from "@/services/githubService"
import { loadEditable } from "@/services/contentService"
import { refreshCms } from "@/data/cmsStore"

export default {
  name: "ContentEditorView",
  components: { JsonForm },
  data() {
    return {
      sections: CONTENT_SECTIONS,
      hiddenKeys: HIDDEN_KEYS,
      hasToken: hasGithubToken(),
      tab: CONTENT_SECTIONS[0].key,
      draft: {},
      fullOriginal: {},
      sha: "",
      loading: false,
      saving: false,
      ready: false,
      error: "",
    }
  },
  mounted() {
    this.loadFromGithub()
  },
  methods: {
    async loadFromGithub() {
      this.loading = true
      this.error = ""
      try {
        const file = await loadEditable(CMS_PATHS.content, {})
        const parsed = JSON.parse(file.content)
        this.sha = file.sha
        this.fullOriginal = parsed
        const draft = {}
        this.sections.forEach((section) => {
          if (parsed[section.key] !== undefined) {
            draft[section.key] = JSON.parse(JSON.stringify(parsed[section.key]))
          }
        })
        this.draft = draft
        this.ready = true
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async save() {
      if (!this.hasToken) {
        this.$q.notify({ type: "negative", message: "Token GitHub belum dikonfigurasi." })
        return
      }
      this.saving = true
      this.error = ""
      try {
        const payload = JSON.parse(JSON.stringify(this.fullOriginal))
        this.sections.forEach((section) => {
          if (this.draft[section.key] !== undefined) {
            payload[section.key] = JSON.parse(JSON.stringify(this.draft[section.key]))
          }
        })
        const result = await putJson(
          CMS_PATHS.content,
          payload,
          this.sha,
          `CMS: perbarui konten (${this.tab})`
        )
        this.sha = result.sha
        this.fullOriginal = payload
        await refreshCms("content")
        this.$q.notify({ type: "positive", message: "Konten berhasil disimpan & website diperbarui." })
      } catch (error) {
        this.error = error.message
        this.$q.notify({ type: "negative", message: error.message })
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.section-tabs :deep(.q-tab) {
  min-height: 42px;
  padding: 0 14px;
  font-size: 12px;
}
</style>
