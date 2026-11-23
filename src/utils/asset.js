/**
 * Helper untuk membangun URL aset statis di public/assets.
 * Path disimpan relatif (mis. "assets/img/logo.png") agar tetap
 * valid saat aplikasi di-deploy di sub-folder (BASE_URL != "/").
 */
export function asset(path) {
  if (!path) return ""
  const base = (process.env.BASE_URL || "/").replace(/\/+$/, "")
  const file = String(path).replace(/^\/+/, "")
  return `${base}/${file}`
}

/**
 * Path gambar bisa berupa URL absolut (hasil upload GitHub) atau path
 * relatif di public/assets. Fungsi ini menangani keduanya.
 */
export function assetOrUrl(path) {
  if (!path) return ""
  if (/^(https?:)?\/\//i.test(path) || /^data:/i.test(path)) return path
  return asset(path)
}
