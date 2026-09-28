<script setup lang="ts">
import type { ImageVariant } from '~/utils/types'

const props = withDefaults(defineProps<{
  image: ImageVariant | null
  size?: number
}>(), { size: 32 })

const isDefault = computed(() => !props.image || props.image.default.endsWith('/images/defaultProfileImage.png'))

</script>

<template>
  <span class="avatar" :style="{ width: `${size}px`, height: `${size}px` }">
    <template v-if="isDefault">
      <img src="/images/defaultProfileImage-light.png" alt="" class="light-only">
      <img src="/images/defaultProfileImage-dark.png" alt="" class="dark-only">
    </template>
    <picture v-else-if="image">
      <source :srcset="image.webp" type="image/webp">
      <img :src="image.default" alt="">
    </picture>
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
