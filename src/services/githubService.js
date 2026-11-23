/**
 * githubService — jembatan CMS ke GitHub REST API (Contents API).
 *
 * - getFile()     : baca JSON + sha (dibutuhkan untuk commit berikutnya)
 * - putFile()     : update / buat file + auto-commit ke branch
 * - uploadImage() : upload gambar (Base64) ke public/uploads/
 * - deleteFile()  : hapus file (opsional)
 *
 * Semua encoding UTF-8 aman untuk karakter Indonesia (é, —, “ ”, dll).
 */
import { githubConfig, API_BASE, RAW_BASE } from "@/config/cms.config"

function requestHeaders(withJson = false) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  if (githubConfig.token) headers.Authorization = `Bearer ${githubConfig.token}`
  if (withJson) headers["Content-Type"] = "application/json"
  return headers
}

/** Teks UTF-8 → Base64 (bukan btoa langsung, agar tidak error karakter non-Latin). */
export function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(String(text))
  let binary = ""
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

/** Base64 dari GitHub → teks UTF-8 (GitHub menyisipkan newline di content). */
export function base64ToUtf8(base64) {
  const clean = String(base64 || "").replace(/\s/g, "")
  const binary = atob(clean)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** URL publik mentah (dipakai untuk thumbnail & gambar hasil upload). */
export function rawUrl(path) {
  return `${RAW_BASE}/${String(path).replace(/^\/+/, "")}`
}

async function readError(response) {
  let detail = ""
  try {
    const body = await response.json()
    detail = body && body.message ? ` — ${body.message}` : ""
  } catch (e) {
    // abaikan
  }
  const error = new Error(`GitHub API ${response.status}${detail}`)
  error.status = response.status
  return error
}

/**
 * GET satu file. Mengembalikan { path, sha, content }.
 * Melempar error dengan .status = 404 bila file belum ada.
 */
export async function getFile(path) {
  const url = `${API_BASE}/${path}?ref=${encodeURIComponent(githubConfig.branch)}&t=${Date.now()}`
  const response = await fetch(url, { headers: requestHeaders(), cache: "no-store" })
  if (!response.ok) throw await readError(response)

  const data = await response.json()
  let content = ""
  if (data.encoding === "base64") {
    content = base64ToUtf8(data.content)
  } else if (data.download_url) {
    const raw = await fetch(`${data.download_url}&t=${Date.now()}`, { cache: "no-store" })
    if (!raw.ok) throw new Error(`Gagal mengunduh ${path}`)
    content = await raw.text()
  }
  return { path, sha: data.sha, content }
}

/** PUT dengan Base64 yang sudah jadi (dipakai juga oleh uploadImage). */
async function putBase64(path, base64, sha, message) {
  const payload = {
    message: message || `CMS: perbarui ${path}`,
    branch: githubConfig.branch,
    content: base64,
  }
  if (sha) payload.sha = sha

  const response = await fetch(`${API_BASE}/${path}`, {
    method: "PUT",
    headers: requestHeaders(true),
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw await readError(response)

  const data = await response.json()
  return {
    path,
    sha: data.content && data.content.sha,
    commit: data.commit,
  }
}

/** Simpan teks/JSON ke GitHub dan langsung membuat commit. */
export function putFile(path, content, sha, message) {
  return putBase64(path, utf8ToBase64(content), sha, message)
}

/** Simpan objek JSON (diformat rapi) ke GitHub. */
export function putJson(path, value, sha, message) {
  return putFile(path, `${JSON.stringify(value, null, 2)}\n`, sha, message)
}

/** Upload gambar: File → Base64 → PUT ke folder uploads. */
export async function uploadImage(file, folder = "public/uploads") {
  if (!file) throw new Error("Berkas gambar belum dipilih.")

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Gagal membaca berkas gambar."))
    reader.readAsDataURL(file)
  })

  const base64 = dataUrl.includes(",") ? dataUrl.slice(dataUrl.indexOf(",") + 1) : ""
  const safeName = String(file.name || "gambar")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
  const name = `${Date.now()}-${safeName}`
  const path = `${folder.replace(/\/$/, "")}/${name}`

  const result = await putBase64(path, base64, null, `CMS: unggah gambar ${name}`)
  return { path, url: rawUrl(path), sha: result.sha }
}

/** Hapus file dari repository (membutuhkan sha terbaru). */
export async function deleteFile(path, sha, message) {
  const payload = {
    message: message || `CMS: hapus ${path}`,
    branch: githubConfig.branch,
    sha,
  }
  const response = await fetch(`${API_BASE}/${path}`, {
    method: "DELETE",
    headers: requestHeaders(true),
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw await readError(response)
  return true
}

/** Daftar isi sebuah folder di repository (dipakai halaman Media). */
export async function listFolder(path) {
  const url = `${API_BASE}/${path}?ref=${encodeURIComponent(githubConfig.branch)}&t=${Date.now()}`
  const response = await fetch(url, { headers: requestHeaders(), cache: "no-store" })
  if (response.status === 404) return []
  if (!response.ok) throw await readError(response)
  const data = await response.json()
  return (Array.isArray(data) ? data : []).map((item) => ({
    name: item.name,
    path: item.path,
    sha: item.sha,
    size: item.size,
    url: rawUrl(item.path),
  }))
}

/** Tes koneksi & kredensial: coba baca file content.json. */
export async function checkConnection(path = "public/data/content.json") {
  try {
    const file = await getFile(path)
    return { ok: true, sha: file.sha }
  } catch (error) {
    return { ok: false, message: error.message }
  }
}

export default {
  getFile,
  putFile,
  putJson,
  uploadImage,
  deleteFile,
  listFolder,
  checkConnection,
  rawUrl,
  utf8ToBase64,
  base64ToUtf8,
}
