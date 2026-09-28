<script setup lang="ts">
useHead({ title: 'Log in · OnlyWeebs' })

const { user, login } = useAuth()
const route = useRoute()

const redirect = computed(() => {
  const target = route.query.redirect
  // Only follow in-app paths.
  return typeof target === 'string' && target.startsWith('/') && !target.startsWith('//') ? target : '/'
})

onMounted(() => {
  if (user.value) navigateTo(redirect.value)
})

const form = reactive({ email: '', password: '', rememberMe: false })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await login(form.email, form.password, form.rememberMe)
    await navigateTo(redirect.value)
  }
  catch (e) {
    error.value = apiErrorMessage(e, 'Could not log in.')
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth card">
    <h1><i class="fa-solid fa-right-to-bracket" /> Log in</h1>

    <div v-if="error" class="alert" role="alert">{{ error }}</div>

    <form @submit.prevent="submit">
      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" class="input" type="email" autocomplete="email" required>
      </div>

      <div class="field">
        <label for="password">Password</label>
        <div class="password">
          <input
            id="password"
            v-model="form.password"
            class="input"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            required
          >
          <button type="button" class="btn btn-icon" :title="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
          </button>
        </div>
      </div>

      <label class="remember">
        <input v-model="form.rememberMe" type="checkbox"> Remember me
      </label>

      <button class="btn btn-primary submit" type="submit" :disabled="loading">
        <i :class="loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-right-to-bracket'" /> Log in
      </button>
    </form>

    <p class="muted switch">
      No account yet? <NuxtLink :to="{ path: '/register', query: route.query }">Sign up</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.auth {
  max-width: 420px;
  margin: 32px auto;
  padding: 28px;
}

.auth h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.password {
  display: flex;
  gap: 8px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.submit {
  width: 100%;
}

.switch {
  text-align: center;
  margin-bottom: 0;
}
</style>
