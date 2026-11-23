<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="json-form">
    <!-- Tombol tambah di root array -->
    <div v-if="isRootArray" class="q-mb-md">
      <q-btn size="sm" color="primary" icon="add" label="Tambah item" @click="addRootItem" />
    </div>

    <template v-for="entry in entries" :key="entry.key">
      <!-- ===== NILAI PRIMITIF ===== -->
      <div v-if="isPrimitive(entry.value)" class="q-mb-md">
        <div class="field-label">{{ humanize(entry.key) }}</div>

        <q-toggle v-if="typeof entry.value === 'boolean'" v-model="model[entry.key]" />

        <q-input v-else-if="typeof entry.value === 'number'" v-model.number="model[entry.key]"
          type="number" outlined dense />

        <q-editor v-else-if="isHtml(entry.key, entry.value)" v-model="model[entry.key]"
          min-height="110px" :toolbar="htmlToolbar" />

        <q-input v-else-if="isLong(entry.value)" v-model="model[entry.key]"
          type="textarea" outlined autogrow />

        <q-input v-else v-model="model[entry.key]" outlined dense />

        <q-btn v-if="isRootArray && isObject(entry.value)" flat dense round size="sm"
          icon="delete" color="negative" class="q-mt-xs" @click="removeRootItem(entry.key)" />
      </div>

      <!-- ===== ARRAY ===== -->
      <div v-else-if="Array.isArray(entry.value)" class="q-mb-lg array-block">
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle2 text-primary">{{ humanize(entry.key) }}</div>
          <q-chip dense size="sm" color="grey-3" text-color="grey-8">{{ entry.value.length }}</q-chip>
          <q-space />
          <q-btn size="sm" color="primary" icon="add" label="Tambah" @click="addItem(entry.key)" />
        </div>

        <!-- array of primitive -->
        <template v-if="isPrimitiveArray(entry.value)">
          <div v-for="(item, i) in model[entry.key]" :key="i" class="row q-gutter-sm items-center q-mb-xs">
            <q-input v-model="model[entry.key][i]" outlined dense class="col" />
            <q-btn flat dense round icon="delete" color="negative" size="sm" @click="removeItem(entry.key, i)" />
          </div>
        </template>

        <!-- array of object -->
        <template v-else>
          <q-card v-for="(item, i) in model[entry.key]" :key="i" flat bordered class="q-mb-sm">
            <q-card-section class="row items-center q-py-sm">
              <div class="text-weight-medium text-primary">{{ humanize(entry.key) }} #{{ i + 1 }}</div>
              <q-space />
              <q-btn flat dense round size="sm" icon="arrow_upward" :disable="i === 0" @click="moveItem(entry.key, i, -1)" />
              <q-btn flat dense round size="sm" icon="arrow_downward" :disable="i === model[entry.key].length - 1" @click="moveItem(entry.key, i, 1)" />
              <q-btn flat dense round size="sm" icon="content_copy" @click="copyItem(entry.key, i)" />
              <q-btn flat dense round size="sm" icon="delete" color="negative" @click="removeItem(entry.key, i)" />
            </q-card-section>
            <q-separator />
            <q-card-section>
              <JsonForm :model="item" :html-keys="htmlKeys" />
            </q-card-section>
          </q-card>
        </template>
      </div>

      <!-- ===== OBJECT ===== -->
      <q-expansion-item v-else class="object-block q-mb-sm" :label="humanize(entry.key)" default-opened>
        <q-card-section>
          <JsonForm :model="model[entry.key]" :html-keys="htmlKeys" />
        </q-card-section>
      </q-expansion-item>
    </template>
  </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props -- form sengaja mengubah objek `model` yang dilewatkan dari parent secara reaktif */
import { HTML_KEYS } from "@/admin/schemas/contentSchema"

export default {
  name: "JsonForm",
  props: {
    model: { type: [Object, Array], required: true },
    htmlKeys: { type: Array, default: () => HTML_KEYS },
  },
  data() {
    return {
      htmlToolbar: [
        ["bold", "italic", "underline", "strike"],
        ["link"],
        [{ header: [1, 2, 3, false] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "hr"],
        ["clean"],
      ],
    }
  },
  computed: {
    isRootArray() {
      return Array.isArray(this.model)
    },
    entries() {
      const model = this.model
      if (Array.isArray(model)) return model.map((value, key) => ({ key, value }))
      return Object.keys(model || {}).map((key) => ({ key, value: model[key] }))
    },
  },
  methods: {
    humanize(key) {
      return String(key)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (c) => c.toUpperCase())
    },
    isPrimitive(value) {
      return value === null || typeof value !== "object"
    },
    isObject(value) {
      return value !== null && typeof value === "object" && !Array.isArray(value)
    },
    isPrimitiveArray(arr) {
      return arr.every((item) => item === null || typeof item !== "object")
    },
    isLong(value) {
      return typeof value === "string" && value.length > 80
    },
    isHtml(key, value) {
      if (this.htmlKeys.includes(key)) return true
      return typeof value === "string" && /<[a-z][\s\S]*>/i.test(value)
    },
    addItem(key) {
      const arr = this.model[key]
      if (!Array.isArray(arr)) return
      arr.push(this.isPrimitiveArray(arr) ? "" : {})
    },
    removeItem(key, index) {
      this.model[key].splice(index, 1)
    },
    moveItem(key, index, direction) {
      const arr = this.model[key]
      const target = index + direction
      if (target < 0 || target >= arr.length) return
      const copy = arr.slice()
      ;[copy[index], copy[target]] = [copy[target], copy[index]]
      arr.splice(0, arr.length, ...copy)
    },
    copyItem(key, index) {
      const item = this.model[key][index]
      this.model[key].splice(index + 1, 0, JSON.parse(JSON.stringify(item)))
    },
    addRootItem() {
      const first = this.model[0]
      this.model.push(this.isObject(first) ? {} : "")
    },
    removeRootItem(index) {
      this.model.splice(index, 1)
    },
  },
}
</script>

<style scoped>
.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #5f6776;
  margin-bottom: 4px;
  text-transform: capitalize;
}
.array-block,
.object-block {
  border-left: 3px solid #e3e9f5;
  padding-left: 14px;
}
</style>
