export const addReplaceBackParameter = (url: string, backParam: string) => {
  if (typeof url !== 'string' || url.includes('..')) {
    throw new Error('Invalid URL passed through')
  }

  if (url.includes('back=')) {
    return url.replace(/back=[^&]*/, backParam)
  }
  return `${url}${url.includes('?') ? '&' : '?'}${backParam}`
}
