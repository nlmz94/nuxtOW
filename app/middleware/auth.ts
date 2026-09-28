export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { user } = useAuth()
  if (!user.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
