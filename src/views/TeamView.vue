<template>
  <main id="main-content" class="main" tabindex="-1">
    <PageHero
      title="Tim Kami"
      tagline="Talenta kreatif & teknis di balik Kafeinarts"
      desc="Orang-orang yang bekerja setiap hari untuk mengubah ide kompleks menjadi produk digital yang berkinerja tinggi."
      icon="bi-people-fill"
      icon-color="#be185d"
      cover="people"
    />

    <section class="section team-section">
      <div class="container">
        <SectionHeading :title="team.title" :subtitle="team.subtitle" />

        <p class="team-hint" data-aos="fade-up">
          <i class="bi bi-hand-index-thumb"></i>Klik kartu untuk melihat profil lengkap
        </p>

        <div class="row gy-4 justify-content-center">
          <div
            v-for="(member, i) in team.members"
            :key="member.name"
            class="col-xl-3 col-md-6 d-flex align-items-stretch"
            data-aos="fade-up"
            :data-aos-delay="member.delay"
          >
            <!-- Kartu berfungsi sebagai tombol: klik/Enter/Spasi = buka lightbox -->
            <div
              class="team-member-card w-100"
              :style="{ '--member-accent': memberAccent(i) }"
              role="button"
              tabindex="0"
              :aria-label="'Lihat detail ' + member.name"
              @click="openLightbox(i)"
              @keydown.enter.prevent="openLightbox(i)"
              @keydown.space.prevent="openLightbox(i)"
            >
              <div class="member-img">
                <img
                  :src="asset(member.img)"
                  :alt="member.alt"
                  width="324"
                  height="504"
                  loading="lazy"
                />

                <span class="member-index" aria-hidden="true">{{ memberNumber(i) }}</span>
                <span class="member-badge">
                  <i class="bi" :class="roleIcon(member.role)"></i>{{ roleTrack(member.role) }}
                </span>
                <span class="member-zoom" aria-hidden="true">
                  <i class="bi bi-arrows-fullscreen"></i>
                </span>

                <div class="social">
                  <a
                    v-for="s in socials"
                    :key="s.icon"
                    :href="s.href"
                    :aria-label="s.label"
                    @click.stop
                  >
                    <i class="bi" :class="s.icon"></i>
                  </a>
                </div>
              </div>

              <div class="member-info">
                <span class="member-role">{{ member.role }}</span>
                <h4>{{ member.name }}</h4>
                <p>{{ member.bio }}</p>
                <span class="member-cta">
                  Lihat profil <i class="bi bi-arrow-up-right"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================
         Lightbox detail anggota tim
         - Terbuka saat kartu diklik (openLightbox) lewat Modal Bootstrap.
         - Navigasi: panah kiri/kanan (tap zone), swipe touch, keyboard ←/→.
         - Foto memakai rasio asli 324x504 (contain) — tidak ter-crop.
         ============================================================ -->
    <div
      id="teamLightbox"
      ref="lightbox"
      class="modal fade team-lightbox"
      tabindex="-1"
      aria-labelledby="teamLightboxLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content team-lightbox-content">
          <button
            type="button"
            class="btn-close team-lightbox-close"
            data-bs-dismiss="modal"
            aria-label="Tutup"
          ></button>

          <div
            class="lightbox-stage"
            @touchstart.passive="onTouchStart"
            @touchend="onTouchEnd"
          >
            <!-- Tap zone setengah kiri = sebelumnya -->
            <button
              type="button"
              class="lightbox-zone lightbox-zone-prev"
              aria-label="Anggota sebelumnya"
              @click="zoneNav('prev')"
            >
              <span class="lightbox-arrow"><i class="bi bi-chevron-left" aria-hidden="true"></i></span>
            </button>
            <!-- Tap zone setengah kanan = berikutnya -->
            <button
              type="button"
              class="lightbox-zone lightbox-zone-next"
              aria-label="Anggota berikutnya"
              @click="zoneNav('next')"
            >
              <span class="lightbox-arrow"><i class="bi bi-chevron-right" aria-hidden="true"></i></span>
            </button>

            <figure
              :key="activeIndex"
              class="lightbox-figure"
              :class="slideDir === 'prev' ? 'anim-prev' : 'anim-next'"
            >
              <img :src="asset(activeMember.img)" :alt="activeMember.alt" />
            </figure>

            <span class="lightbox-counter">
              {{ activeIndex + 1 }} / {{ team.members.length }}
            </span>
          </div>

          <div class="lightbox-info text-center">
            <h4 id="teamLightboxLabel">{{ activeMember.name }}</h4>
            <span class="lightbox-role">{{ activeMember.role }}</span>
            <p>{{ activeMember.bio }}</p>
          </div>
        </div>
      </div>
    </div>

    <section class="section pt-0">
      <div class="container">
        <CtaBanner title="Ingin bekerja dengan tim ini?" desc="Mulai kolaborasi dengan sesi konsultasi gratis bersama kami.">
          <router-link :to="{ name: 'consultation' }" class="btn-hero-primary text-decoration-none">
            <i class="bi bi-chat-dots me-2"></i>Mulai Konsultasi
          </router-link>
        </CtaBanner>
      </div>
    </section>
  </main>
</template>

<script>
import PageHero from "@/components/ui/PageHero.vue"
import SectionHeading from "@/components/ui/SectionHeading.vue"
import CtaBanner from "@/components/ui/CtaBanner.vue"
import { usePageSeo } from "@/composables/usePageSeo"
import { siteData } from "@/data/siteData"
import { asset } from "@/utils/asset"

export default {
  name: "TeamView",
  components: { PageHero, SectionHeading, CtaBanner },
  setup() {
    usePageSeo({
      title: `Tim Kami — ${siteData.seo.name}`,
      description: "Kenali tim Kafeinarts: developer, designer, dan digital marketer yang siap mewujudkan produk digital Anda.",
      path: "/team",
    })
  },
  data() {
    return {
      team: siteData.team,
      socials: siteData.footer.social.slice(0, 4),
      // ── State lightbox ──
      activeIndex: 0, // indeks anggota yang sedang ditampilkan
      slideDir: "next", // arah animasi slide (next | prev)
      touchX: 0, // titik awal touch (deteksi swipe kiri/kanan)
      touchY: 0,
      swiped: false, // swipe baru terjadi → tolak click zone berikutnya
      lightboxOpen: false, // status modal, untuk filter event keyboard
    }
  },
  computed: {
    activeMember() {
      return this.team.members[this.activeIndex] || this.team.members[0]
    },
  },
  methods: {
    asset,

    /** Aksen warna bergilir agar tiap kartu punya karakter, tetap dalam palet brand. */
    memberAccent(i) {
      const palette = ["#00205d", "#0e7490", "#6d28d9", "#be185d"]
      return palette[i % palette.length]
    },

    memberNumber(i) {
      return String(i + 1).padStart(2, "0")
    },

    /** Ikon kecil sesuai bidang kerja anggota. */
    roleIcon(role) {
      const r = String(role || "").toLowerCase()
      if (r.includes("chief") || r.includes("supervisor")) return "bi-briefcase"
      if (r.includes("market")) return "bi-megaphone"
      if (r.includes("design")) return "bi-palette"
      if (r.includes("programmer") || r.includes("developer") || r.includes("dev")) return "bi-code-slash"
      return "bi-person-badge"
    },

    /** Label singkat bidang kerja untuk badge di atas foto. */
    roleTrack(role) {
      const r = String(role || "").toLowerCase()
      if (r.includes("chief") || r.includes("supervisor")) return "Leadership"
      if (r.includes("market")) return "Marketing"
      if (r.includes("design")) return "Design"
      if (r.includes("programmer") || r.includes("developer") || r.includes("dev")) return "Engineering"
      return "Team"
    },

    /**
     * Buka lightbox pada anggota ke-i (dipanggil dari kartu: klik/Enter/Spasi).
     * Memakai Modal Bootstrap global — sama seperti modal demo produk.
     */
    openLightbox(i) {
      this.goTo(i, "next")
      const el = this.$refs.lightbox
      if (!el || !window.bootstrap || !window.bootstrap.Modal) return
      window.bootstrap.Modal.getOrCreateInstance(el).show()
    },

    /** Pindah ke indeks ke-i (wrap-around 0..n-1) dengan arah animasi. */
    goTo(i, dir) {
      const n = this.team.members.length
      this.activeIndex = ((i % n) + n) % n
      this.slideDir = dir
    },

    next() {
      this.goTo(this.activeIndex + 1, "next")
    },

    prev() {
      this.goTo(this.activeIndex - 1, "prev")
    },

    /** Handler tap zone / tombol panah — diabaikan bila itu sisa swipe. */
    zoneNav(dir) {
      if (this.swiped) return
      if (dir === "next") {
        this.next()
      } else {
        this.prev()
      }
    },

    onTouchStart(e) {
      const t = e.touches[0]
      this.touchX = t.clientX
      this.touchY = t.clientY
      this.swiped = false
    },

    /** Swipe horizontal > 45px → next (kiri) / prev (kanan). */
    onTouchEnd(e) {
      const t = e.changedTouches[0]
      const dx = t.clientX - this.touchX
      const dy = t.clientY - this.touchY
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        this.swiped = true
        if (dx < 0) {
          this.next()
        } else {
          this.prev()
        }
        window.setTimeout(() => {
          this.swiped = false
        }, 400)
      }
    },

    /** Keyboard ←/→ hanya saat lightbox terbuka (Esc ditangani Bootstrap). */
    onLightboxKey(e) {
      if (!this.lightboxOpen) return
      if (e.key === "ArrowRight") {
        e.preventDefault()
        this.next()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        this.prev()
      }
    },

    onModalShown() {
      this.lightboxOpen = true
    },

    onModalHidden() {
      this.lightboxOpen = false
    },
  },
  mounted() {
    window.addEventListener("keydown", this.onLightboxKey)
    const el = this.$refs.lightbox
    if (el) {
      el.addEventListener("shown.bs.modal", this.onModalShown)
      el.addEventListener("hidden.bs.modal", this.onModalHidden)
    }
  },
  beforeUnmount() {
    // Tutup modal & lepas listener saat pindah route
    // (mencegah backdrop/body-lock Bootstrap tertinggal).
    window.removeEventListener("keydown", this.onLightboxKey)
    const el = this.$refs.lightbox
    if (el) {
      el.removeEventListener("shown.bs.modal", this.onModalShown)
      el.removeEventListener("hidden.bs.modal", this.onModalHidden)
      if (window.bootstrap && window.bootstrap.Modal) {
        const instance = window.bootstrap.Modal.getInstance(el)
        if (instance) instance.hide()
      }
    }
  },
}
</script>

<style scoped>
.team-section {
  position: relative;
  background:
    radial-gradient(ellipse at 12% 0%, rgba(0, 32, 93, 0.06), transparent 40%),
    radial-gradient(ellipse at 88% 10%, rgba(190, 24, 93, 0.05), transparent 36%),
    linear-gradient(180deg, #f8fafd 0%, #ffffff 70%);
}

.team-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: fit-content;
  margin: -6px auto 26px;
  padding: 7px 14px;
  border: 1px dashed rgba(0, 32, 93, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
}

.team-hint i {
  color: #1d4ed8;
}

/* ---------- Kartu anggota ---------- */
.team-member-card {
  --member-accent: #00205d;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--surface-color);
  border: 1px solid color-mix(in srgb, var(--default-color), transparent 91%);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 32, 93, 0.04);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
  cursor: pointer;
}

/* Garis aksen tipis di atas kartu */
.team-member-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  z-index: 3;
  background: linear-gradient(
    90deg,
    var(--member-accent),
    color-mix(in srgb, var(--member-accent), #e8dcc6 62%)
  );
}

.team-member-card:hover {
  transform: translateY(-7px);
  border-color: color-mix(in srgb, var(--member-accent), transparent 68%);
  box-shadow: 0 22px 46px rgba(0, 32, 93, 0.16);
}

.team-member-card:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--member-accent), transparent 30%);
  outline-offset: 3px;
}

/* Foto dibingkai di dalam kartu */
.member-img {
  position: relative;
  overflow: hidden;
  margin: 12px 12px 0;
  border-radius: 16px;
  /* Rasio ASLI foto tim (324x504) — seluruh desain foto tampil, tanpa crop */
  aspect-ratio: 324 / 504;
  background: color-mix(in srgb, var(--member-accent), transparent 92%);
}

.member-img::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(0, 15, 45, 0.18) 0%,
    transparent 28%,
    transparent 58%,
    rgba(0, 15, 45, 0.62) 100%
  );
  pointer-events: none;
}

.member-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.55s ease;
}

.team-member-card:hover .member-img img {
  transform: scale(1.045);
}

/* Nomor urut & badge bidang */
.member-index {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  min-width: 32px;
  padding: 4px 7px;
  border-radius: 9px;
  background: rgba(0, 15, 45, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  font-family: "Jost", sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-align: center;
  backdrop-filter: blur(6px);
}

.member-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: calc(100% - 62px);
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--member-accent);
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.045em;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 15, 45, 0.12);
}

.member-badge i {
  font-size: 0.78rem;
}

/* Petunjuk visual bahwa kartu bisa diklik (buka lightbox) */
.member-zoom {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 3;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: var(--member-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  opacity: 0;
  transform: scale(0.82);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.team-member-card:hover .member-zoom,
.team-member-card:focus-visible .member-zoom {
  opacity: 1;
  transform: scale(1);
}

.member-img .social {
  position: absolute;
  inset: auto 0 0 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  gap: 7px;
  padding: 16px 56px 14px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.team-member-card:hover .member-img .social,
.team-member-card:focus-visible .member-img .social {
  opacity: 1;
  transform: none;
}

.member-img .social a {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.34);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  backdrop-filter: blur(4px);
  transition: background 0.3s ease, transform 0.3s ease;
}

.member-img .social a:hover {
  background: var(--member-accent);
  transform: translateY(-2px);
}

/* ---------- Info anggota ---------- */
.member-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 17px 19px 19px;
  text-align: left;
}

.member-role {
  display: block;
  margin-bottom: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--member-accent);
}

.member-info h4 {
  font-weight: 700;
  font-size: 1.02rem;
  line-height: 1.3;
  margin-bottom: 7px;
}

.member-info p {
  font-size: 0.81rem;
  line-height: 1.58;
  margin: 0;
  color: color-mix(in srgb, var(--default-color), transparent 10%);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.member-cta {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 13px;
  border-top: 1px dashed color-mix(in srgb, var(--default-color), transparent 86%);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--member-accent);
}

.member-cta i {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.team-member-card:hover .member-cta i {
  transform: translate(2px, -2px);
}

@media (min-width: 768px) {
  .member-info h4 {
    min-height: 2.6em;
  }
}

/* Di perangkat sentuh, kontrol sosial selalu terlihat karena hover tidak ada */
@media (hover: none) {
  .member-img .social,
  .member-zoom {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 575.98px) {
  .team-member-card {
    border-radius: 18px;
  }

  .member-img {
    margin: 10px 10px 0;
    border-radius: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .team-member-card,
  .member-img img,
  .member-zoom,
  .member-img .social,
  .member-img .social a,
  .member-cta i {
    transition: none;
  }

  .team-member-card:hover {
    transform: none;
  }

  .team-member-card:hover .member-img img {
    transform: none;
  }
}

/* ============================================================
   Lightbox detail anggota tim
   ============================================================ */
.team-lightbox-content {
  position: relative;
  background: linear-gradient(160deg, #00205d, #04307f);
  border: none;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 32, 93, 0.4);
}

.team-lightbox-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 6;
  filter: invert(1) grayscale(1) brightness(2);
  opacity: 0.85;
}

.lightbox-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  background: rgba(0, 10, 35, 0.45);
}

.lightbox-figure {
  margin: 0;
  padding: 20px 58px 44px;
  display: flex;
  justify-content: center;
  max-width: 100%;
}

.lightbox-figure img {
  width: auto;
  height: auto;
  max-width: 100%;
  /* Batas tinggi viewport agar foto selalu muat — rasio asli dipertahankan */
  max-height: min(62vh, 540px);
  border-radius: 12px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

/* Tap zone setengah area foto: kiri = previous, kanan = next */
.lightbox-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
  z-index: 3;
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  padding: 0;
  transition: background 0.25s ease;
}

.lightbox-zone-prev {
  left: 0;
  justify-content: flex-start;
  padding-left: 14px;
}

.lightbox-zone-next {
  right: 0;
  justify-content: flex-end;
  padding-right: 14px;
}

.lightbox-zone:hover {
  background: rgba(255, 255, 255, 0.07);
}

.lightbox-zone:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.7);
  outline-offset: -4px;
}

.lightbox-arrow {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.35);
  transition: background 0.25s ease, transform 0.25s ease;
}

.lightbox-zone:hover .lightbox-arrow {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.08);
}

.lightbox-counter {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  padding: 4px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  pointer-events: none;
}

.lightbox-info {
  padding: 14px 26px 26px;
  color: #fff;
}

.lightbox-info h4 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}

.lightbox-role {
  display: inline-block;
  margin-top: 2px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #9ec1ff;
}

.lightbox-info p {
  margin: 10px auto 0;
  max-width: 560px;
  font-size: 0.92rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.78);
}

/* Animasi slide mengikuti arah navigasi (next → dari kanan, prev → dari kiri) */
@keyframes teamLightboxInNext {
  from {
    opacity: 0;
    transform: translateX(38px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes teamLightboxInPrev {
  from {
    opacity: 0;
    transform: translateX(-38px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.lightbox-figure.anim-next {
  animation: teamLightboxInNext 0.28s ease both;
}

.lightbox-figure.anim-prev {
  animation: teamLightboxInPrev 0.28s ease both;
}

@media (prefers-reduced-motion: reduce) {
  .lightbox-figure.anim-next,
  .lightbox-figure.anim-prev {
    animation: none;
  }
}

@media (max-width: 575.98px) {
  .lightbox-figure {
    padding: 16px 48px 40px;
  }

  .lightbox-zone-prev {
    padding-left: 8px;
  }

  .lightbox-zone-next {
    padding-right: 8px;
  }

  .lightbox-arrow {
    width: 38px;
    height: 38px;
    font-size: 1.1rem;
  }

  .lightbox-info {
    padding: 12px 18px 20px;
  }
}
</style>
