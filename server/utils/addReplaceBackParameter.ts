export const addReplaceBackParameter = (url: unknown, backParam: string): string => {
  if (typeof url !== 'string') return ''
  if (url.includes('back=')) {
    return url.replace(/back=[^&]*/, backParam)
  }
  return `${url}${url.includes('?') ? '&' : '?'}${backParam}`
}
