<script setup lang="ts">
  const message = ref('Nuxt')
  const hello = () => sayHello(message.value)
  const { data } = await useFetch('/api/hello')
  const apiHello = () => sayHello(data.message)
</script>

<template>
  <h1>Search page</h1>
  <NuxtLink to="/">Home</NuxtLink>
  <p>{{ data.message }}</p>

  <h2>Demo with auto imports</h2>
  <form @submit.prevent="hello">
    <MyInput v-model="message" />
    <button type="submit">Say Hello</button>
  </form>
  <form @submit.prevent="apiHello">
    <button type="submit">Say Hello</button>
  </form>
</template>

<style scoped>

</style>
