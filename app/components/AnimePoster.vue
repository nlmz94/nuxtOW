<script setup lang="ts">
import type { ImageVariant } from '~/utils/types'

defineProps<{
  image: ImageVariant | null
  alt: string
  color?: string | null
}>()
</script>

<template>
  <div class="poster" :style="{ background: color || 'var(--surface-2)' }">
    <picture v-if="image">
      <source :srcset="image.webp" type="image/webp">
      <img :src="image.default" :alt="alt" loading="lazy">
    </picture>
    <i v-else class="fa-regular fa-image placeholder" />
  </div>
</template>

<style scoped>
.poster {
  aspect-ratio: 414 / 616;
  border-radius: var(--radius);
  overflow: hidden;
  display: grid;
  place-items: center;
}

.poster picture,
.poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 2rem;
  color: var(--muted);
}
</style>
