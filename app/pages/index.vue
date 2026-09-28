<script setup lang="ts">
import type { HomeData } from '~/utils/types'

useHead({ title: 'OnlyWeebs' })

const { data, status, error, refresh } = await useApiData<{ data: HomeData }>('/home')
const home = computed(() => data.value?.data)

const sections = computed(() => [
  { key: 'trending', title: 'Trending', icon: 'fa-solid fa-fire', items: home.value?.trending ?? [] },
  { key: 'topRated', title: 'Top rated', icon: 'fa-solid fa-trophy', items: home.value?.topRated ?? [] },
  { key: 'recent', title: 'Recently aired', icon: 'fa-solid fa-clock', items: home.value?.recent ?? [] },
])

const search = ref('')
function onSearch() {
  navigateTo({ path: '/search', query: search.value.trim() ? { q: search.value.trim() } : {} })
}
</script>

<template>
  <div>
    <section class="hero">
      <h1>Find your next anime</h1>
      <form class="hero-search" @submit.prevent="onSearch">
        <input v-model="search" class="input" type="search" placeholder="Search by title…" aria-label="Search">
        <button class="btn btn-primary" type="submit"><i class="fa-solid fa-magnifying-glass" /> Search</button>
      </form>
      <p v-if="home" class="stats muted">
        <span><i class="fa-solid fa-film" /> {{ home.stats.animes.toLocaleString() }} anime</span>
        <span><i class="fa-solid fa-tags" /> {{ home.stats.genres.toLocaleString() }} genres</span>
        <span><i class="fa-solid fa-building" /> {{ home.stats.studios.toLocaleString() }} studios</span>
      </p>
    </section>

    <div v-if="status === 'pending' && !home" class="state">
      <i class="fa-solid fa-spinner fa-spin" /> Loading…
    </div>

    <div v-else-if="error" class="state">
      <p><i class="fa-solid fa-triangle-exclamation" /> Could not load the home page.</p>
      <button class="btn" @click="() => refresh()"><i class="fa-solid fa-rotate-right" /> Retry</button>
    </div>

    <template v-else>
      <section v-for="section in sections" :key="section.key" class="section">
        <h2><i :class="section.icon" /> {{ section.title }}</h2>
        <div v-if="section.items.length" class="grid">
          <AnimeCard v-for="anime in section.items" :key="anime.id" :anime="anime" />
        </div>
        <p v-else class="muted">Nothing here yet.</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 32px 0 16px;
}

.hero h1 {
  margin: 0 0 16px;
  font-size: 2rem;
}

.hero-search {
  display: flex;
  gap: 8px;
  max-width: 560px;
  margin: 0 auto;
}

.stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 16px;
}

.section {
  margin-top: 32px;
}

.section h2 {
  font-size: 1.3rem;
}

.section h2 i {
  color: var(--primary);
}
</style>
