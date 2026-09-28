// The session cookie lives on the API origin, so the user is loaded in the browser.
export default defineNuxtPlugin(async () => {
  const { ready, fetchUser } = useAuth()
  if (!ready.value) {
    await fetchUser()
  }
})
