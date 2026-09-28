import type { ApiProblem } from './types'

const ACRONYMS = new Set(['TV', 'OVA', 'ONA'])

/** "TV_SHORT" -> "TV Short", "FINISHED" -> "Finished" */
export function humanize(value: string | null | undefined): string {
  if (!value) return ''
  return value
    .split('_')
    .map(word => ACRONYMS.has(word) ? word : word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '?'
  return new Date(value).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** AniList synopses contain a little HTML (<br>, <i>); render them as plain text. */
export function plainText(html: string | null | undefined): string {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Pulls a readable message out of a failed $fetch call. */
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const data = (error as { data?: ApiProblem })?.data
  return data?.detail || data?.title || fallback
}

/** Maps API validation violations to { field: message }. */
export function apiFieldErrors(error: unknown): Record<string, string> {
  const violations = (error as { data?: ApiProblem })?.data?.violations ?? []
  return Object.fromEntries(violations.map(v => [v.propertyPath, v.title]))
}
