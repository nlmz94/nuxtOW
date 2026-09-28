<script setup lang="ts">
import type { AnimeDetail } from '~/utils/types'

const route = useRoute()
const id = computed(() => String(route.params.id))

const { data, status, error } = await useApiData<{ data: AnimeDetail }>(() => `/animes/${id.value}`)
const anime = computed(() => data.value?.data)

const title = computed(() => anime.value?.titleEnglish || anime.value?.title || 'Anime')
useHead({ title: () => `${title.value} · OnlyWeebs` })

const synopsis = computed(() => plainText(anime.value?.synopsis))

const facts = computed(() => {
  const a = anime.value
  if (!a) return []
  return [
    { label: 'Format', value: humanize(a.format) },
    { label: 'Status', value: humanize(a.status) },
    { label: 'Episodes', value: a.episodes },
    { label: 'Duration', value: a.duration ? `${a.duration} min` : null },
    { label: 'Season', value: a.season || a.seasonYear ? `${humanize(a.season)} ${a.seasonYear ?? ''}`.trim() : null },
    { label: 'Aired', value: a.startDate ? `${formatDate(a.startDate)} → ${a.endDate ? formatDate(a.endDate) : '?'}` : null },
    { label: 'Source', value: humanize(a.source) },
    { label: 'Country', value: a.countryOfOrigin },
    { label: 'Rating', value: a.pegi },
    { label: 'Studios', value: a.studios.map(s => s.name).join(', ') },
    { label: 'Producers', value: a.producers.map(p => p.name).join(', ') },
  ].filter(f => f.value !== null && f.value !== undefined && f.value !== '')
})

const showAllCharacters = ref(false)
const characters = computed(() => {
  const list = anime.value?.characters ?? []
  return showAllCharacters.value ? list : list.slice(0, 12)
})

const showAllStaff = ref(false)
const staff = computed(() => {
  const list = anime.value?.staff ?? []
  return showAllStaff.value ? list : list.slice(0, 8)
})
</script>

<template>
  <div>
    <div v-if="status === 'pending' && !anime" class="state">
      <i class="fa-solid fa-spinner fa-spin" /> Loading…
    </div>

    <div v-else-if="error || !anime" class="state">
      <p>
        <i class="fa-solid fa-triangle-exclamation" />
        {{ error?.statusCode === 404 ? 'This anime does not exist.' : 'Could not load this anime.' }}
      </p>
      <NuxtLink to="/search" class="btn"><i class="fa-solid fa-arrow-left" /> Back to search</NuxtLink>
    </div>

    <article v-else>
      <div
        class="banner"
        :style="anime.bannerUrl
          ? { backgroundImage: `url(${anime.bannerUrl})` }
          : { background: anime.coverColor || 'var(--surface-2)' }"
      />

      <header class="head">
        <AnimePoster class="head-poster" :image="anime.images.poster" :alt="title" :color="anime.coverColor" />
        <div class="head-info">
          <h1>{{ title }}</h1>
          <p v-if="anime.titleEnglish && anime.title !== anime.titleEnglish" class="muted alt">{{ anime.title }}</p>
          <p v-if="anime.titleNative" class="muted alt">{{ anime.titleNative }}</p>

          <div class="scores">
            <span v-if="anime.averageScore"><i class="fa-solid fa-star" /> {{ anime.averageScore }}%</span>
            <span v-if="anime.popularity"><i class="fa-solid fa-users" /> {{ anime.popularity.toLocaleString() }}</span>
            <span v-if="anime.favourites"><i class="fa-solid fa-heart" /> {{ anime.favourites.toLocaleString() }}</span>
          </div>

          <div v-if="anime.genres.length" class="genres">
            <span v-for="genre in anime.genres" :key="genre" class="tag">{{ genre }}</span>
          </div>

          <div class="links">
            <a v-if="anime.anilistId" :href="`https://anilist.co/anime/${anime.anilistId}`" target="_blank" rel="noopener" class="btn">
              <i class="fa-solid fa-arrow-up-right-from-square" /> AniList
            </a>
            <a v-if="anime.malId" :href="`https://myanimelist.net/anime/${anime.malId}`" target="_blank" rel="noopener" class="btn">
              <i class="fa-solid fa-arrow-up-right-from-square" /> MyAnimeList
            </a>
          </div>
        </div>
      </header>

      <div class="layout">
        <aside class="card facts">
          <dl>
            <template v-for="fact in facts" :key="fact.label">
              <dt>{{ fact.label }}</dt>
              <dd>{{ fact.value }}</dd>
            </template>
          </dl>
        </aside>

        <div class="content">
          <section v-if="synopsis">
            <h2>Synopsis</h2>
            <p class="synopsis">{{ synopsis }}</p>
          </section>

          <section v-if="anime.trailerYoutubeId">
            <h2><i class="fa-brands fa-youtube" /> Trailer</h2>
            <div class="trailer">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${anime.trailerYoutubeId}`"
                title="Trailer"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
              />
            </div>
          </section>

          <section v-if="anime.characters.length">
            <h2><i class="fa-solid fa-masks-theater" /> Characters</h2>
            <div class="people">
              <div v-for="character in characters" :key="character.id" class="card person">
                <img v-if="character.image" :src="character.image" :alt="character.name" loading="lazy">
                <div v-else class="avatar"><i class="fa-solid fa-user" /></div>
                <div class="person-info">
                  <strong>{{ character.name }}</strong>
                  <span class="muted">{{ humanize(character.role) }}</span>
                  <span v-if="character.voiceActor" class="muted va">
                    <i class="fa-solid fa-microphone" /> {{ character.voiceActor.name }}
                  </span>
                </div>
              </div>
            </div>
            <button v-if="anime.characters.length > 12" class="btn more" @click="showAllCharacters = !showAllCharacters">
              {{ showAllCharacters ? 'Show less' : `Show all ${anime.characters.length}` }}
            </button>
          </section>

          <section v-if="anime.staff.length">
            <h2><i class="fa-solid fa-clapperboard" /> Staff</h2>
            <div class="people">
              <div v-for="(member, i) in staff" :key="`${member.id}-${i}`" class="card person">
                <img v-if="member.image" :src="member.image" :alt="member.name" loading="lazy">
                <div v-else class="avatar"><i class="fa-solid fa-user" /></div>
                <div class="person-info">
                  <strong>{{ member.name }}</strong>
                  <span class="muted">{{ member.role }}</span>
                </div>
              </div>
            </div>
            <button v-if="anime.staff.length > 8" class="btn more" @click="showAllStaff = !showAllStaff">
              {{ showAllStaff ? 'Show less' : `Show all ${anime.staff.length}` }}
            </button>
          </section>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.banner {
  height: 220px;
  margin: -24px -16px 0;
  background-size: cover;
  background-position: center;
}

.head {
  display: flex;
  gap: 24px;
  align-items: flex-end;
  margin-top: -110px;
  padding: 0 8px;
}

.head-poster {
  width: 200px;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.3);
}

.head-info {
  padding-bottom: 8px;
  min-width: 0;
}

.head-info h1 {
  margin: 0 0 4px;
  font-size: 1.8rem;
}

.alt {
  margin: 0;
}

.scores {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 12px 0;
}

.scores .fa-star { color: #f5b301; }
.scores .fa-heart { color: var(--danger); }
.scores .fa-users { color: var(--primary); }

.genres,
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  margin-top: 32px;
}

.facts {
  padding: 16px;
  align-self: start;
}

.facts dl {
  margin: 0;
}

.facts dt {
  font-size: 0.8rem;
  color: var(--muted);
  font-weight: 600;
}

.facts dd {
  margin: 0 0 12px;
}

.content {
  min-width: 0;
}

.content section + section {
  margin-top: 32px;
}

.content h2 {
  font-size: 1.2rem;
  margin-top: 0;
}

.synopsis {
  white-space: pre-line;
}

.trailer {
  aspect-ratio: 16 / 9;
  max-width: 720px;
}

.trailer iframe {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: var(--radius);
}

.people {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.person {
  display: flex;
  gap: 12px;
  overflow: hidden;
}

.person img,
.person .avatar {
  width: 64px;
  height: 88px;
  object-fit: cover;
  flex-shrink: 0;
}

.avatar {
  display: grid;
  place-items: center;
  background: var(--surface-2);
  color: var(--muted);
}

.person-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 8px 8px 0;
  font-size: 0.9rem;
  min-width: 0;
}

.va {
  font-size: 0.8rem;
}

.more {
  margin-top: 12px;
}

@media (max-width: 768px) {
  .head {
    flex-direction: column;
    align-items: flex-start;
    margin-top: -80px;
  }

  .head-poster {
    width: 140px;
  }

  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
