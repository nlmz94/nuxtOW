<script setup lang="ts">
const version = 4
</script>

<template>
  <h1>
    Hello Nuxt {{ version }}!
  </h1>
  <NuxtLink to="/search">Search</NuxtLink>
  <NuxtPage />
</template>

<style scoped>
h1 {
  font-size: 3rem;
}
</style>
