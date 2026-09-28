<script setup lang="ts">
import type { Anime } from '~/utils/types'

defineProps<{ anime: Anime }>()
</script>

<template>
  <NuxtLink :to="`/anime/${anime.id}`" class="anime-card">
    <AnimePoster :image="anime.images.poster" :alt="anime.title" :color="anime.coverColor" />
    <div class="info">
      <h3 class="title" :title="anime.titleEnglish || anime.title">{{ anime.titleEnglish || anime.title }}</h3>
      <p class="meta muted">
        <span v-if="anime.format">{{ humanize(anime.format) }}</span>
        <span v-if="anime.seasonYear"> · {{ anime.seasonYear }}</span>
        <span v-if="anime.averageScore" class="score">
          · <i class="fa-solid fa-star" /> {{ anime.averageScore }}%
        </span>
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.anime-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text);
}

.anime-card:hover {
  text-decoration: none;
}

.anime-card:hover .title {
  color: var(--primary);
}

.title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  margin: 2px 0 0;
  font-size: 0.8rem;
}

.score i {
  color: #f5b301;
}
</style>
