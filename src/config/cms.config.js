/**
 * Konfigurasi CMS berbasis GitHub REST API.
 * Semua nilai rahasia dibaca dari .env.local (diabaikan git).
 *
 * Vue CLI hanya menyuntikkan variabel VUE_APP_* ke bundle browser.
 * Akses HARUS statis (process.env.VUE_APP_X) agar webpack DefinePlugin
 * menggantinya saat build. Variabel VITE_* dibaca untuk kompatibilitas Vite.
 */
const first = (primary, secondary, fallback = "") => primary || secondary || fallback

const githubOwner = first(process.env.VUE_APP_GITHUB_OWNER, process.env.VITE_GITHUB_OWNER, "Kafeinarts")
const githubRepo = first(process.env.VUE_APP_GITHUB_REPO, process.env.VITE_GITHUB_REPO, "kafeinarts")
const githubBranch = first(process.env.VUE_APP_GITHUB_BRANCH, process.env.VITE_GITHUB_BRANCH, "main")
const cmsSource = first(process.env.VUE_APP_CMS_SOURCE, process.env.VITE_CMS_SOURCE, "github")

export const githubConfig = {
  owner: githubOwner,
  repo: githubRepo,
  branch: githubBranch,
  token: first(process.env.VUE_APP_GITHUB_TOKEN, process.env.VITE_GITHUB_TOKEN, ""),
}

export const API_BASE = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents`
export const RAW_BASE = `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/${githubBranch}`

/** Sumber data publik: "github" (raw URL) atau "local" (/data/*.json). */
export const CMS_SOURCE = cmsSource === "local" ? "local" : "github"

/** Path file di dalam repository. */
export const CMS_PATHS = {
  content: "public/data/content.json",
  products: "public/data/products.json",
  uploads: "public/uploads",
}

export const hasGithubToken = () => Boolean(githubConfig.token)
