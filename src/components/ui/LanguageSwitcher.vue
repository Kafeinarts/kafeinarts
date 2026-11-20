<template>
  <!-- Pemilih bahasa ID/EN — dipakai di header & footer -->
  <div class="lang-switcher" role="group" :aria-label="$t('common.language')">
    <button
      v-for="lang in availableLocales"
      :key="lang.code"
      type="button"
      class="lang-btn"
      :class="{ active: locale === lang.code }"
      :aria-pressed="locale === lang.code ? 'true' : 'false'"
      :title="lang.name"
      @click="setLocale(lang.code)"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script>
import { useI18n } from "@/i18n"

export default {
  name: "LanguageSwitcher",
  setup() {
    const { locale, availableLocales, setLocale } = useI18n()
    return { locale, availableLocales, setLocale }
  },
}
</script>

<style scoped>
.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
}

.lang-btn {
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 4px 9px;
  border-radius: 50px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.lang-btn:hover {
  color: #fff;
}

.lang-btn.active {
  background: #fff;
  color: #00205d;
}
</style>
