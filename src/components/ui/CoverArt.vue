<template>
  <!--
    CoverArt — ilustrasi SVG cover, dibuat sendiri (self-authored).
    Tidak mengunduh aset pihak ketiga, jadi aman untuk penggunaan komersial
    tanpa atribusi. Warna mengikuti prop `color` agar menyatu dengan brand.
  -->
  <svg
    class="cover-art"
    :viewBox="`0 0 ${width} ${height}`"
    role="img"
    :aria-label="ariaLabel"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.95" />
        <stop offset="100%" stop-color="#00205d" stop-opacity="0.9" />
      </linearGradient>
    </defs>

    <rect :width="width" :height="height" rx="18" :fill="`url(#${gradId})`" />
    <circle :cx="width - 26" :cy="24" r="62" fill="#fff" opacity="0.06" />
    <circle :cx="34" :cy="height - 16" r="48" fill="#fff" opacity="0.05" />

    <!-- Sistem & aplikasi: dashboard + grafik -->
    <g v-if="variant === 'system'" transform="translate(46 34)">
      <rect width="248" height="132" rx="12" fill="#fff" opacity="0.14" />
      <rect x="14" y="14" width="220" height="20" rx="6" fill="#fff" opacity="0.85" />
      <circle cx="26" cy="24" r="4" fill="#0d9488" />
      <circle cx="40" cy="24" r="4" fill="#fbbf24" />
      <circle cx="54" cy="24" r="4" fill="#f87171" />
      <rect x="14" y="48" width="96" height="68" rx="8" fill="#fff" opacity="0.9" />
      <rect x="122" y="48" width="112" height="32" rx="8" fill="#fff" opacity="0.7" />
      <rect x="122" y="84" width="112" height="32" rx="8" fill="#fff" opacity="0.7" />
      <rect x="26" y="98" width="14" height="18" rx="3" :fill="color" opacity="0.75" />
      <rect x="46" y="86" width="14" height="30" rx="3" :fill="color" opacity="0.75" />
      <rect x="66" y="76" width="14" height="40" rx="3" :fill="color" opacity="0.75" />
      <rect x="86" y="66" width="14" height="50" rx="3" :fill="color" opacity="0.75" />
      <path d="M26 104 L48 92 L68 82 L88 72" stroke="#0d9488" stroke-width="3" fill="none" stroke-linecap="round" />
      <rect x="134" y="60" width="60" height="8" rx="4" fill="#00205d" opacity="0.25" />
      <rect x="134" y="96" width="80" height="8" rx="4" fill="#00205d" opacity="0.25" />
      <circle cx="330" cy="86" r="26" fill="#fff" opacity="0.18" />
      <path d="M320 86 l8 8 l16 -18" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- Website: browser window + layout -->
    <g v-else-if="variant === 'website'" transform="translate(46 34)">
      <rect width="300" height="132" rx="12" fill="#fff" opacity="0.16" />
      <rect x="14" y="14" width="272" height="20" rx="6" fill="#fff" opacity="0.85" />
      <circle cx="28" cy="24" r="4" fill="#0d9488" />
      <circle cx="42" cy="24" r="4" fill="#fbbf24" />
      <circle cx="56" cy="24" r="4" fill="#f87171" />
      <rect x="14" y="48" width="130" height="68" rx="8" fill="#fff" opacity="0.9" />
      <rect x="26" y="60" width="72" height="9" rx="4.5" :fill="color" opacity="0.7" />
      <rect x="26" y="78" width="100" height="7" rx="3.5" fill="#00205d" opacity="0.2" />
      <rect x="26" y="92" width="80" height="7" rx="3.5" fill="#00205d" opacity="0.2" />
      <rect x="26" y="106" width="56" height="7" rx="3.5" fill="#0d9488" opacity="0.6" />
      <rect x="156" y="48" width="130" height="30" rx="8" fill="#fff" opacity="0.75" />
      <rect x="156" y="86" width="130" height="30" rx="8" fill="#fff" opacity="0.75" />
      <circle cx="176" cy="63" r="8" :fill="color" opacity="0.6" />
      <circle cx="176" cy="101" r="8" fill="#0d9488" opacity="0.6" />
      <rect x="194" y="59" width="64" height="8" rx="4" fill="#00205d" opacity="0.2" />
      <rect x="194" y="97" width="76" height="8" rx="4" fill="#00205d" opacity="0.2" />
    </g>

    <!-- Order: checklist + chat -->
    <g v-else-if="variant === 'order'" transform="translate(56 30)">
      <rect width="196" height="140" rx="14" fill="#fff" opacity="0.95" />
      <rect x="20" y="20" width="100" height="12" rx="6" :fill="color" opacity="0.7" />
      <g v-for="i in 3" :key="i">
        <rect x="20" :y="48 + i * 28" width="22" height="22" rx="6" :fill="color" opacity="0.18" />
        <path :d="`M26 ${59 + i * 28} l4 4 l8 -9`" stroke="#0d9488" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="52" :y="54 + i * 28" width="112" height="10" rx="5" fill="#00205d" opacity="0.2" />
      </g>
      <g transform="translate(210 62)">
        <path d="M0 0 h108 a18 18 0 0 1 18 18 v52 a18 18 0 0 1 -18 18 h-58 l-22 18 v-18 h-28 a18 18 0 0 1 -18 -18 v-52 a18 18 0 0 1 18 -18 z" fill="#fff" opacity="0.9" />
        <circle cx="28" cy="44" r="6" fill="#25d366" />
        <circle cx="52" cy="44" r="6" fill="#25d366" />
        <circle cx="76" cy="44" r="6" fill="#25d366" />
        <rect x="24" y="64" width="80" height="8" rx="4" fill="#00205d" opacity="0.2" />
      </g>
    </g>

    <!-- Skills: jendela kode -->
    <g v-else-if="variant === 'code'" transform="translate(84 32)">
      <rect width="312" height="136" rx="14" fill="#fff" opacity="0.95" />
      <circle cx="26" cy="26" r="5" fill="#f87171" />
      <circle cx="44" cy="26" r="5" fill="#fbbf24" />
      <circle cx="62" cy="26" r="5" fill="#0d9488" />
      <rect x="22" y="54" width="118" height="10" rx="5" :fill="color" opacity="0.75" />
      <rect x="36" y="76" width="86" height="8" rx="4" fill="#00205d" opacity="0.22" />
      <rect x="50" y="94" width="70" height="8" rx="4" fill="#0d9488" opacity="0.5" />
      <path d="M206 60 l-26 30 26 30" stroke="#00205d" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.4" />
      <path d="M246 60 l26 30 -26 30" stroke="#00205d" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.4" />
      <path d="M232 54 l-18 74" stroke="#0d9488" stroke-width="7" fill="none" stroke-linecap="round" />
    </g>

    <!-- Tim / Tentang: orang-orang -->
    <g v-else-if="variant === 'people'" transform="translate(90 34)">
      <circle cx="66" cy="40" r="26" fill="#fff" opacity="0.9" />
      <circle cx="160" cy="32" r="32" fill="#fff" />
      <circle cx="254" cy="40" r="26" fill="#fff" opacity="0.9" />
      <path d="M20 138 a46 46 0 0 1 92 0 z" fill="#fff" opacity="0.85" />
      <path d="M104 148 a56 56 0 0 1 112 0 z" fill="#fff" />
      <path d="M214 138 a46 46 0 0 1 92 0 z" fill="#fff" opacity="0.85" />
      <circle cx="160" cy="32" r="10" :fill="color" opacity="0.35" />
    </g>

    <!-- Kontak: headset -->
    <g v-else-if="variant === 'support'" transform="translate(150 20)">
      <path d="M40 92 v-16 a80 80 0 0 1 160 0 v16" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.95" />
      <rect x="24" y="84" width="34" height="52" rx="14" :fill="color" />
      <rect x="182" y="84" width="34" height="52" rx="14" :fill="color" />
      <path d="M206 134 q0 32 -46 32 h-20" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.9" />
      <circle cx="134" cy="166" r="12" fill="#fff" />
    </g>

    <!-- Kelebihan: perisai centang -->
    <g v-else-if="variant === 'award'" transform="translate(160 22)">
      <path d="M80 0 L160 26 v54 c0 50 -34 82 -80 102 C34 162 0 130 0 80 V26 z" fill="#fff" opacity="0.95" />
      <path d="M48 82 l22 22 l44 -48" stroke="#0d9488" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- Layanan: empat kartu -->
    <g v-else-if="variant === 'grid'" transform="translate(84 34)">
      <rect x="0" y="0" width="144" height="64" rx="12" fill="#fff" opacity="0.95" />
      <rect x="168" y="0" width="144" height="64" rx="12" fill="#fff" opacity="0.75" />
      <rect x="0" y="80" width="144" height="64" rx="12" fill="#fff" opacity="0.75" />
      <rect x="168" y="80" width="144" height="64" rx="12" fill="#fff" opacity="0.95" />
      <rect x="20" y="20" width="52" height="8" rx="4" :fill="color" opacity="0.75" />
      <rect x="20" y="38" width="86" height="7" rx="3.5" fill="#00205d" opacity="0.2" />
      <rect x="188" y="20" width="52" height="8" rx="4" :fill="color" opacity="0.6" />
      <rect x="188" y="38" width="86" height="7" rx="3.5" fill="#00205d" opacity="0.16" />
      <rect x="20" y="100" width="52" height="8" rx="4" :fill="color" opacity="0.6" />
      <rect x="20" y="118" width="86" height="7" rx="3.5" fill="#00205d" opacity="0.16" />
      <rect x="188" y="100" width="52" height="8" rx="4" :fill="color" opacity="0.75" />
      <rect x="188" y="118" width="86" height="7" rx="3.5" fill="#00205d" opacity="0.2" />
    </g>

    <!-- FAQ (default): gelembung tanya -->
    <g v-else transform="translate(140 34)">
      <path d="M0 0 h200 a24 24 0 0 1 24 24 v84 a24 24 0 0 1 -24 24 h-104 l-38 26 v-26 h-58 a24 24 0 0 1 -24 -24 v-84 a24 24 0 0 1 24 -24 z" fill="#fff" opacity="0.92" />
      <text x="112" y="96" text-anchor="middle" font-family="Arial, sans-serif" font-size="86" font-weight="700" :fill="color" opacity="0.85">?</text>
    </g>
  </svg>
</template>

<script>
let coverSeq = 0

export default {
  name: "CoverArt",
  props: {
    variant: { type: String, default: "system" },
    color: { type: String, default: "#1d4ed8" },
    width: { type: Number, default: 480 },
    height: { type: Number, default: 200 },
    ariaLabel: { type: String, default: "Ilustrasi cover" },
  },
  data() {
    coverSeq += 1
    return { gradId: `cover-art-grad-${coverSeq}` }
  },
}
</script>

<style scoped>
.cover-art {
  display: block;
  width: 100%;
  height: auto;
}
</style>
