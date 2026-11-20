/**
 * i18n ringan untuk Kafeinarts (Vue 3).
 * ------------------------------------------------------------------
 * Tidak memakai dependency tambahan: cukup `ref` + kamus JSON.
 *
 * Pemakaian:
 *   - Di template : $t('nav.home')
 *   - Di script   : this.$t('faq.title')  (Options API)
 *                   const { t, locale, setLocale } = useI18n()  (setup())
 *   - Ganti bahasa: setLocale('en') | $i18n.setLocale('en')
 *
 * Menambah bahasa:
 *   1. buat src/i18n/locales/<kode>.json
 *   2. import & daftarkan di `messages` + `availableLocales` di bawah.
 *
 * Kunci yang belum diterjemahkan otomatis jatuh ke Bahasa Indonesia,
 * lalu ke teks aslinya — jadi halaman tidak pernah kosong.
 */
import { ref } from "vue"
import idMessages from "./locales/id.json"
import enMessages from "./locales/en.json"

export const messages = {
  id: idMessages,
  en: enMessages,
}

export const availableLocales = [
  { code: "id", label: "ID", name: "Bahasa Indonesia" },
  { code: "en", label: "EN", name: "English" },
]

const STORAGE_KEY = "kafeinarts.locale"

function storedLocale() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && messages[saved]) return saved
  } catch (e) {
    // localStorage bisa diblokir — abaikan.
  }
  return "id"
}

/** Bahasa aktif. Reactive: perubahan langsung merender ulang UI. */
export const locale = ref(storedLocale())

function lookup(dict, key) {
  if (!dict || !key) return undefined
  return String(key)
    .split(".")
    .reduce((value, part) => (value && value[part] !== undefined ? value[part] : undefined), dict)
}

function interpolate(text, params) {
  return String(text).replace(/\{(\w+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  )
}

/**
 * Terjemahkan `key`.params → string.
 * Fallback: pesan Bahasa Indonesia → `fallback` (teks asli) → key itu sendiri.
 */
export function t(key, params = {}, fallback) {
  const current = lookup(messages[locale.value], key)
  const idMessage = lookup(messages.id, key)
  const message = current !== undefined ? current : idMessage
  if (message === undefined) return fallback !== undefined ? fallback : key
  if (typeof message === "string") return interpolate(message, params)
  return message
}

/** Ganti bahasa aktif + simpan preferensi & atribut <html lang>. */
export function setLocale(code) {
  if (!messages[code]) return
  locale.value = code
  try {
    window.localStorage.setItem(STORAGE_KEY, code)
  } catch (e) {
    // abaikan
  }
  if (typeof document !== "undefined") document.documentElement.lang = code
}

export function useI18n() {
  return { locale, t, setLocale, availableLocales, messages }
}

export const i18n = {
  install(app) {
    app.config.globalProperties.$t = t
    app.config.globalProperties.$i18n = { locale, t, setLocale, availableLocales }
    app.provide("i18n", { locale, t, setLocale, availableLocales })
    if (typeof document !== "undefined") document.documentElement.lang = locale.value
  },
}

export default i18n
