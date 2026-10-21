export const addReplaceBackParameter = (url: string, backParam: string) => {
  if (
    typeof url !== 'string' ||
    url.includes('..') ||
    url.includes('\\') ||
    url.split('').some(character => {
      const code = character.charCodeAt(0)
      return code <= 0x1f || code === 0x7f
    }) ||
    /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url.trim())
  ) {
    throw new Error('Invalid URL passed through')
  }

  if (url.includes('back=')) {
    return url.replace(/back=[^&]*/, backParam)
  }
  return `${url}${url.includes('?') ? '&' : '?'}${backParam}`
}
