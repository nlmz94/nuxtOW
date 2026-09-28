<script setup lang="ts">
import type { ImageVariant } from '~/utils/types'

withDefaults(defineProps<{
  image: ImageVariant | null
  size?: number
}>(), { size: 32 })
</script>

<template>
  <span class="avatar" :style="{ width: `${size}px`, height: `${size}px` }">
    <picture v-if="image">
      <source :srcset="image.webp" type="image/webp">
      <img :src="image.default" alt="">
    </picture>
    <i v-else class="fa-solid fa-user" />
  </span>
</template>

<style scoped>
.avatar {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: var(--surface-2);
  color: var(--muted);
}

.avatar picture,
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
