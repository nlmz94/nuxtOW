<script setup lang="ts">
const { user, ready, logout } = useAuth()
const { theme, sync, toggle } = useTheme()

onMounted(sync)

async function onLogout() {
  await logout()
  await navigateTo('/')
}
</script>

<template>
  <header class="nav">
    <div class="container nav-inner">
      <NuxtLink to="/" class="brand" aria-label="OnlyWeebs home">
        <img src="/images/ow-smol-text-light.webp" alt="OnlyWeebs" class="light-only">
        <img src="/images/ow-smol-text-dark.webp" alt="OnlyWeebs" class="dark-only">
      </NuxtLink>

      <nav class="links">
        <NuxtLink to="/"><i class="fa-solid fa-house" /> <span class="label">Home</span></NuxtLink>
        <NuxtLink to="/search"><i class="fa-solid fa-magnifying-glass" /> <span class="label">Search</span></NuxtLink>
      </nav>

      <div class="actions">
        <ClientOnly>
          <template v-if="ready">
            <template v-if="user">
              <NuxtLink to="/profile" class="user" :title="user.email">
                <UserAvatar :image="user.profilePic" :size="28" />
                <span class="label">{{ user.username || user.email }}</span>
              </NuxtLink>
              <button class="btn btn-icon" title="Log out" @click="onLogout">
                <i class="fa-solid fa-right-from-bracket" />
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn"><i class="fa-solid fa-right-to-bracket" /> <span class="label">Log in</span></NuxtLink>
              <NuxtLink to="/register" class="btn btn-primary"><i class="fa-solid fa-user-plus" /> <span class="label">Sign up</span></NuxtLink>
            </template>
          </template>
        </ClientOnly>

        <button
          class="btn btn-icon"
          :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggle"
        >
          <i :class="theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 60px;
}

.brand {
  flex-shrink: 0;
}

.brand img {
  height: 30px;
  width: auto;
}

.links {
  display: flex;
  gap: 16px;
}

.links a {
  color: var(--muted);
}

.links a.router-link-exact-active {
  color: var(--text);
  font-weight: 600;
}

.actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  max-width: 220px;
  margin-right: 4px;
}

.user .label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user:hover .label {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .nav-inner {
    gap: 12px;
  }

  .label {
    display: none;
  }
}
</style>
