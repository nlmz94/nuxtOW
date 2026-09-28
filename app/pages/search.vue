<script setup lang="ts">
import type { PaginatedAnimes } from '~/utils/types'

useHead({ title: 'Search · OnlyWeebs' })

const LIMIT = 30

const route = useRoute()
const router = useRouter()

// The URL is the source of truth, so searches can be shared and survive reloads.
const term = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const input = ref(term.value)
watch(term, value => (input.value = value))

let debounce: ReturnType<typeof setTimeout> | undefined
function updateQuery(q: string, p = 1) {
  const query: Record<string, string> = {}
  if (q.trim()) query.q = q.trim()
  if (p > 1) query.page = String(p)
  router.replace({ query })
}

watch(input, (value) => {
  clearTimeout(debounce)
  if (value.trim() === term.value) return
  debounce = setTimeout(() => updateQuery(value), 350)
})

function submit() {
  clearTimeout(debounce)
  updateQuery(input.value)
}

function goTo(p: number) {
  updateQuery(term.value, p)
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

const { data, status, error } = await useApiData<PaginatedAnimes>('/animes', {
  query: computed(() => ({ page: page.value, limit: LIMIT, ...(term.value ? { searchTerm: term.value } : {}) })),
})

const animes = computed(() => data.value?.data ?? [])
const meta = computed(() => data.value?.meta)
</script>

<template>
  <div>
    <h1><i class="fa-solid fa-magnifying-glass" /> Search</h1>

    <form class="search" @submit.prevent="submit">
      <div class="search-input">
        <i class="fa-solid fa-magnifying-glass" />
        <input v-model="input" class="input" type="search" placeholder="Naruto, Frieren, One Piece…" aria-label="Search by title" autofocus>
      </div>
    </form>

    <p v-if="meta" class="muted summary">
      {{ meta.total.toLocaleString() }} result{{ meta.total === 1 ? '' : 's' }}
      <template v-if="term"> for “{{ term }}”</template>
      <i v-if="status === 'pending'" class="fa-solid fa-spinner fa-spin" />
    </p>

    <div v-if="error" class="state">
      <i class="fa-solid fa-triangle-exclamation" /> Could not load results.
    </div>

    <div v-else-if="status === 'pending' && !data" class="state">
      <i class="fa-solid fa-spinner fa-spin" /> Loading…
    </div>

    <div v-else-if="!animes.length" class="state">
      <i class="fa-regular fa-face-frown" /> No anime found.
    </div>

    <template v-else>
      <div class="grid" :class="{ loading: status === 'pending' }">
        <AnimeCard v-for="anime in animes" :key="anime.id" :anime="anime" />
      </div>

      <nav v-if="meta && meta.pages > 1" class="pagination">
        <button class="btn" :disabled="meta.page <= 1" @click="goTo(meta.page - 1)">
          <i class="fa-solid fa-chevron-left" /> Prev
        </button>
        <span class="muted">Page {{ meta.page }} / {{ meta.pages }}</span>
        <button class="btn" :disabled="meta.page >= meta.pages" @click="goTo(meta.page + 1)">
          Next <i class="fa-solid fa-chevron-right" />
        </button>
      </nav>
    </template>
  </div>
</template>

<style scoped>
.search-input {
  position: relative;
}

.search-input i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
}

.search-input .input {
  padding-left: 40px;
  font-size: 1.05rem;
}

.summary {
  margin: 12px 0 20px;
}

.grid.loading {
  opacity: 0.6;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
}
</style>
