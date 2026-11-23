<template>
  <div>
    <div class="text-h5 text-weight-bold text-primary q-mb-xs">Dashboard</div>
    <div class="text-grey-7 q-mb-lg">Ringkasan konten dan status koneksi ke GitHub.</div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="card in stats" :key="card.label" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar :color="card.color" text-color="white" :icon="card.icon" size="48px" />
            <div class="q-ml-md">
              <div class="text-h4 text-weight-bold text-primary">{{ card.value }}</div>
              <div class="text-caption text-grey-7">{{ card.label }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-7">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Status Koneksi GitHub</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-banner rounded :class="connection.ok ? 'bg-positive text-white' : 'bg-negative text-white'">
              <template v-slot:avatar>
                <q-icon :name="connection.ok ? 'check_circle' : 'error'" size="28px" />
              </template>
              {{ connection.ok ? 'Terhubung. Token & repository valid.' : connection.message || 'Memeriksa…' }}
            </q-banner>
            <div class="q-mt-md text-caption text-grey-7">
              Repository: <b>{{ repoLabel }}</b><br />
              Setiap perubahan yang disimpan langsung membuat commit baru di branch <b>main</b>.
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Aksi Cepat</div>
          </q-card-section>
          <q-separator />
          <q-list padding>
            <q-item clickable v-ripple :to="{ name: 'admin-content' }">
              <q-item-section avatar><q-icon name="edit_note" color="primary" /></q-item-section>
              <q-item-section>Edit teks landing page</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'admin-product-new' }">
              <q-item-section avatar><q-icon name="add_business" color="primary" /></q-item-section>
              <q-item-section>Tambah produk</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to="{ name: 'admin-media' }">
              <q-item-section avatar><q-icon name="upload" color="primary" /></q-item-section>
              <q-item-section>Upload gambar</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { cmsState } from "@/data/cmsStore"
import { productsState } from "@/data/products/index"
import { checkConnection } from "@/services/githubService"
import { githubConfig } from "@/config/cms.config"

export default {
  name: "DashboardView",
  data() {
    return {
      cmsState,
      productsState,
      connection: { ok: false, message: "Memeriksa…" },
      repoLabel: `${githubConfig.owner}/${githubConfig.repo}@${githubConfig.branch}`,
    }
  },
  computed: {
    stats() {
      return [
        { label: "Produk", value: this.productsState.items.length, icon: "inventory_2", color: "teal" },
        { label: "Sinkron terakhir", value: this.cmsState.lastSynced ? new Date(this.cmsState.lastSynced).toLocaleTimeString("id-ID") : "—", icon: "sync", color: "orange" },
      ]
    },
  },
  mounted() {
    checkConnection().then((result) => {
      this.connection = result
    })
  },
}
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
}
</style>
