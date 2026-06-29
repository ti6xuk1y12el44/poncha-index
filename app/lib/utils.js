export function isStale(dateStr, days = 90) {
  if (!dateStr) return false
  const diff = Date.now() - new Date(dateStr).getTime()
  return diff > days * 24 * 60 * 60 * 1000
}

export function daysAgo(dateStr) {
  if (!dateStr) return null
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}