<template>
  <a
    class="floating-wa"
    :href="waUrl"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Hubungi Kafeinarts via WhatsApp untuk konsultasi gratis"
    title="Konsultasi gratis via WhatsApp"
  >
    <i class="bi bi-whatsapp" aria-hidden="true"></i>
    <span class="floating-wa-label">Konsultasi Gratis</span>
  </a>
</template>

<script>
import { siteData } from "@/data/siteData"

const MESSAGE =
  "Halo Kafeinarts, saya ingin konsultasi jasa pembuatan website/aplikasi. Bisa bantu singgung kebutuhan saya?"

export default {
  name: "FloatingWhatsApp",
  computed: {
    waUrl() {
      const targets = siteData.contact.whatsapp.targets
      const primary = targets.find((t) => t.key === siteData.contact.whatsapp.defaultTarget) || targets[0]
      return `https://wa.me/${primary.wa}?text=${encodeURIComponent(MESSAGE)}`
    },
  },
}
</script>

<style scoped>
.floating-wa {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 1050;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px 12px 14px;
  border-radius: 999px;
  background: #25d366;
  color: #06351a;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  box-shadow: 0 10px 28px rgba(6, 53, 26, 0.28);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.floating-wa:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 34px rgba(6, 53, 26, 0.38);
  color: #06351a;
}

.floating-wa i {
  font-size: 1.55rem;
  line-height: 1;
}

.floating-wa-label {
  white-space: nowrap;
}

@media (max-width: 640px) {
  .floating-wa {
    padding: 12px;
  }
  .floating-wa-label {
    display: none;
  }
}
</style>
