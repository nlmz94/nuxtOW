type Theme = 'light' | 'dark'

/**
 * The initial theme is applied by an inline script in nuxt.config (before
 * paint); this composable reads it back and toggles it.
 */
export function useTheme() {
  const theme = useState<Theme>('theme', () => 'light')

  function sync() {
    theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  }

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = theme.value
    try {
      localStorage.setItem('theme', theme.value)
    }
    catch {
      // Storage unavailable (private mode): the choice just won't persist.
    }
  }

  return { theme, sync, toggle }
}
