<template>
  <div>
    <div class="text-h5 text-weight-bold text-primary q-mb-xs">Media & Upload</div>
    <div class="text-grey-7 q-mb-lg">Unggah gambar ke repository untuk dipakai di konten website.</div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold q-mb-md">Unggah Gambar Baru</div>
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-file v-model="files" multiple accept="image/*" outlined label="Pilih satu atau beberapa gambar"
              :loading="uploading" @update:model-value="uploadFiles">
              <template v-slot:prepend><q-icon name="image" /></template>
            </q-file>
          </div>
          <div class="col-12 col-md-6 text-caption text-grey-6">
            Gambar disimpan di <code>public/uploads/</code> dan memakai URL raw GitHub sehingga langsung tampil di website.
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section class="row items-center">
        <div class="text-subtitle1 text-weight-bold">Gambar Tersedia</div>
        <q-space />
        <q-btn dense flat icon="refresh" color="primary" :loading="loading" @click="load" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div v-if="!images.length && !loading" class="text-grey-6">Belum ada gambar yang diunggah.</div>
        <div class="row q-col-gutter-md">
          <div v-for="image in images" :key="image.sha" class="col-6 col-sm-4 col-md-3">
            <q-card flat bordered class="media-card">
              <q-img :src="image.url" class="media-img" spinner-color="primary" />
              <q-card-section class="q-pa-sm">
                <div class="text-caption ellipsis">{{ image.name }}</div>
                <div class="row q-gutter-xs q-mt-xs">
                  <q-btn size="xs" outline color="primary" icon="content_copy" label="URL" @click="copyUrl(image.url)" />
                  <q-btn size="xs" outline color="negative" icon="delete" @click="confirmDelete(image)" />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { useQuasar } from "quasar"
import { CMS_PATHS } from "@/config/cms.config"
import { uploadImage, listFolder, deleteFile } from "@/services/githubService"

export default {
  name: "MediaView",
  setup() {
    return { $q: useQuasar() }
  },
  data() {
    return {
      files: null,
      images: [],
      loading: false,
      uploading: false,
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    async load() {
      this.loading = true
      try {
        this.images = (await listFolder(CMS_PATHS.uploads)).filter((item) => /\.(png|jpe?g|gif|webp|svg)$/i.test(item.name))
      } catch (error) {
        this.$q.notify({ type: "negative", message: error.message })
      } finally {
        this.loading = false
      }
    },
    async uploadFiles(files) {
      if (!files || !files.length) return
      this.uploading = true
      let success = 0
      for (const file of Array.from(files)) {
        try {
          await uploadImage(file)
          success++
        } catch (error) {
          this.$q.notify({ type: "negative", message: `${file.name}: ${error.message}` })
        }
      }
      this.uploading = false
      this.files = null
      if (success) {
        this.$q.notify({ type: "positive", message: `${success} gambar berhasil diunggah.` })
        this.load()
      }
    },
    copyUrl(url) {
      navigator.clipboard?.writeText(url)
      this.$q.notify({ type: "info", message: "URL gambar disalin." })
    },
    confirmDelete(image) {
      this.$q.dialog({
        title: "Hapus gambar?",
        message: image.name,
        cancel: true,
        persistent: true,
        color: "negative",
      }).onOk(async () => {
        try {
          await deleteFile(image.path, image.sha)
          this.$q.notify({ type: "positive", message: "Gambar dihapus." })
          this.load()
        } catch (error) {
          this.$q.notify({ type: "negative", message: error.message })
        }
      })
    },
  },
}
</script>

<style scoped>
.media-img {
  height: 130px;
}
.media-card {
  border-radius: 10px;
  overflow: hidden;
}
</style>
