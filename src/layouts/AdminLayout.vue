<template>
  <q-layout view="hHh LpR fFf" class="admin-shell">
    <q-header elevated class="admin-header">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawerOpen = !drawerOpen" />
        <q-avatar color="primary" text-color="white" size="34px" class="q-mr-sm">K</q-avatar>
        <q-toolbar-title class="text-weight-bold">
          Kafeinarts <span class="text-weight-light">CMS</span>
        </q-toolbar-title>

        <q-chip dense outline color="white" text-color="grey-4" class="gt-sm" :title="repoLabel">
          <q-avatar icon="hub" color="primary" text-color="white" size="22px" />
          GitHub: {{ githubConfig.branch }}
        </q-chip>

        <q-space />

        <q-btn flat dense round icon="open_in_new" :to="{ name: 'home' }" target="_blank" title="Lihat website" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" show-if-above :width="252" side="left" class="admin-drawer">
      <div class="q-pa-md">
        <div class="text-h6 text-primary text-weight-bold">Panel Admin</div>
        <div class="text-caption text-grey-6">Kelola konten via GitHub API</div>
      </div>
      <q-separator />

      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header>UTAMA</q-item-label>
          <q-item v-for="item in mainMenu" :key="item.name" clickable v-ripple
            :to="{ name: item.name }" active-class="admin-active">
            <q-item-section avatar><q-icon :name="item.icon" /></q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>

          <q-separator spaced />
          <q-item-label header>KONTEN</q-item-label>
          <q-item v-for="item in contentMenu" :key="item.name" clickable v-ripple
            :to="{ name: item.name }" active-class="admin-active">
            <q-item-section avatar><q-icon :name="item.icon" /></q-item-section>
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>

          <q-separator spaced />
          <q-item-label header>PENGATURAN</q-item-label>
          <q-item clickable v-ripple :to="{ name: 'admin-media' }" active-class="admin-active">
            <q-item-section avatar><q-icon name="photo_library" /></q-item-section>
            <q-item-section>Media & Upload</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <div class="admin-page-inner">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { githubConfig } from "@/config/cms.config"

export default {
  name: "AdminLayout",
  data() {
    return {
      drawerOpen: false,
      repoLabel: `${githubConfig.owner}/${githubConfig.repo}@${githubConfig.branch}`,
      githubConfig,
      mainMenu: [
        { name: "admin-dashboard", label: "Dashboard", icon: "space_dashboard" },
        { name: "admin-content", label: "Editor Konten", icon: "article" },
      ],
      contentMenu: [
        { name: "admin-products", label: "Produk & Layanan", icon: "inventory_2" },
      ],
    }
  },
}
</script>

<style scoped>
.admin-shell {
  background: #f4f6fb;
  font-family: "Roboto", sans-serif;
}
.admin-header {
  background: #00205d;
}
.admin-drawer {
  background: #ffffff;
  border-right: 1px solid #e6e9f0;
}
.admin-active {
  color: #00205d !important;
  background: rgba(0, 32, 93, 0.08) !important;
  font-weight: 600;
}
.admin-page-inner {
  max-width: 1180px;
  margin: 0 auto;
}
</style>
