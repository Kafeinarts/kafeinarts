<template>
  <a
    href="#"
    class="scroll-top d-flex align-items-center justify-content-center"
    :class="{ active: active }"
    aria-label="Kembali ke atas"
    @click.prevent="scrollUp"
  >
    <i class="bi bi-arrow-up-short"></i>
  </a>
</template>

<script>
export default {
  name: "ScrollTop",
  data() {
    return {
      active: false,
    }
  },
  mounted() {
    this.toggle()
    window.addEventListener("scroll", this.toggle, { passive: true })
    window.addEventListener("load", this.toggle)
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.toggle)
    window.removeEventListener("load", this.toggle)
  },
  methods: {
    toggle() {
      this.active = window.scrollY > 100
    },
    scrollUp() {
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
  },
}
</script>

<style scoped>
/* Tombol WA mengambang ada di kanan-bawah (22px + tinggi ±50px).
   ScrollTop diposisikan di atasnya agar keduanya tidak bertumpuk. */
.scroll-top.active {
  right: 22px;
  bottom: 84px;
}

@media (max-width: 640px) {
  .scroll-top.active {
    right: 18px;
    bottom: 78px;
  }
}
</style>
