import { syncSeoForRoute } from "@/utils/seo"

/**
 * Composable SEO per-halaman (dipanggil di setup() Options API).
 * @param {{ title: string, description?: string, keywords?: string, path?: string, image?: string, imageAlt?: string }} seo
 */
export function usePageSeo(seo) {
  syncSeoForRoute(seo)
}

export default usePageSeo
