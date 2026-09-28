<script setup lang="ts">
useHead({ title: 'Sign up · OnlyWeebs' })

const { user, register, login } = useAuth()
const route = useRoute()

onMounted(() => {
  if (user.value) navigateTo('/')
})

const form = reactive({ email: '', password: '', confirm: '' })
const loading = ref(false)
const error = ref('')
const fieldErrors = ref<Record<string, string>>({})
const showPassword = ref(false)

// Mirrors the API's StrongPassword constraint so users get feedback while typing.
const rules = computed(() => [
  { label: 'At least 12 characters', ok: form.password.length >= 12 },
  { label: 'An uppercase letter', ok: /[A-Z]/.test(form.password) },
  { label: 'A lowercase letter', ok: /[a-z]/.test(form.password) },
  { label: 'A number', ok: /\d/.test(form.password) },
  { label: 'A special character', ok: /[^A-Za-z0-9]/.test(form.password) },
])
const passwordValid = computed(() => rules.value.every(r => r.ok))
const confirmMismatch = computed(() => form.confirm !== '' && form.confirm !== form.password)

async function submit() {
  error.value = ''
  fieldErrors.value = {}

  if (!passwordValid.value) {
    fieldErrors.value = { password: 'Your password does not meet the requirements.' }
    return
  }
  if (form.password !== form.confirm) {
    fieldErrors.value = { confirm: 'Passwords do not match.' }
    return
  }

  loading.value = true
  try {
    await register(form.email, form.password)
    // Sign the new user straight in.
    await login(form.email, form.password)
    await navigateTo('/')
  }
  catch (e) {
    fieldErrors.value = apiFieldErrors(e)
    if (!Object.keys(fieldErrors.value).length) {
      error.value = apiErrorMessage(e, 'Could not create your account.')
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth card">
    <h1><i class="fa-solid fa-user-plus" /> Sign up</h1>

    <div v-if="error" class="alert" role="alert">{{ error }}</div>

    <form novalidate @submit.prevent="submit">
      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" class="input" type="email" autocomplete="email" required>
        <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
      </div>

      <div class="field">
        <label for="password">Password</label>
        <div class="password">
          <input
            id="password"
            v-model="form.password"
            class="input"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            required
          >
          <button type="button" class="btn btn-icon" :title="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" />
          </button>
        </div>
        <ul class="rules">
          <li v-for="rule in rules" :key="rule.label" :class="{ ok: rule.ok }">
            <i :class="rule.ok ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'" /> {{ rule.label }}
          </li>
        </ul>
        <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
      </div>

      <div class="field">
        <label for="confirm">Confirm password</label>
        <input
          id="confirm"
          v-model="form.confirm"
          class="input"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          required
        >
        <span v-if="fieldErrors.confirm || confirmMismatch" class="field-error">
          {{ fieldErrors.confirm || 'Passwords do not match.' }}
        </span>
      </div>

      <button class="btn btn-primary submit" type="submit" :disabled="loading">
        <i :class="loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-user-plus'" /> Create account
      </button>
    </form>

    <p class="muted switch">
      Already have an account? <NuxtLink :to="{ path: '/login', query: route.query }">Log in</NuxtLink>
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

.rules {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--muted);
}

.rules li.ok {
  color: var(--success);
}

.submit {
  width: 100%;
}

.switch {
  text-align: center;
  margin-bottom: 0;
}
</style>
