import { createApp } from "vue"
import { Quasar, Dialog, Notify } from "quasar"
import quasarLang from "quasar/lang/id"
import "@quasar/extras/material-icons/material-icons.css"
import "@quasar/extras/roboto-font/roboto-font.css"
import "quasar/dist/quasar.css"
import "./styles/overrides.css"

import App from "./App.vue"
import "./registerServiceWorker"
import router, { registerProductRoutes } from "./router"
import store from "./store"
import i18n from "./i18n"
import { loadCms } from "./data/cmsStore"
import { quasarComponents, quasarDirectives } from "./plugins/quasar"

/**
 * Konten (content.json, products.json) di-fetch dulu dari GitHub,
 * lalu route produk didaftarkan, baru app di-mount. Pola ini mengikuti
 * loadProducts() lama agar navbar & router sudah punya data sejak awal.
 */
function mountApp() {
  registerProductRoutes()
  const app = createApp(App)

  app.use(Quasar, {
    components: quasarComponents,
    directives: quasarDirectives,
    plugins: { Dialog, Notify },
    lang: quasarLang,
    config: {
      brand: {
        primary: "#00205D",
        secondary: "#37517e",
        accent: "#0d47a1",
        dark: "#1e2229",
        positive: "#2e7d32",
        negative: "#c62828",
        warning: "#ed6c02",
        info: "#0288d1",
      },
    },
  })
  app.use(store)
  app.use(router)
  app.use(i18n)
  app.mount("#app")
}

loadCms()
  .then(mountApp)
  .catch(() => {
    // Tetap mount agar halaman tidak kosong; error tercatat di cmsState.
    mountApp()
  })
