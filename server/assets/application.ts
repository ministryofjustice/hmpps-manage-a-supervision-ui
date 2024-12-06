/* eslint-disable no-restricted-globals */
const lastAppointment = () => {
  const repeatingFrequency = document.querySelector('div[data-repeating-frequency]') as HTMLDivElement
  if (repeatingFrequency) {
    const repeatingFrequencyRadios = repeatingFrequency.querySelectorAll(
      'input[type="radio"]',
    ) as NodeListOf<HTMLInputElement>
    const repeatingCount = document.querySelector('div[data-repeating-count] input') as HTMLInputElement
    const lastAppointmentElm = document.querySelector('div[data-last-appointment') as HTMLDivElement
    const lastAppointmentHandler = async () => {
      const repeatingFrequencyRadioSelected = repeatingFrequency.querySelector('input:checked') as HTMLInputElement
      if (parseInt(repeatingCount.value, 10) > 0 && repeatingFrequencyRadioSelected) {
        const divider = location.href.includes('?') ? '&' : '?'
        const url = `${location.href}${divider}repeating-frequency=${encodeURI(repeatingFrequencyRadioSelected.value)}&repeating-count=${repeatingCount.value}`
        const headers = {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
        }
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers,
        })
        const html = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const element = doc.querySelector('div[data-last-appointment]').innerHTML
        document.querySelector('div[data-last-appointment]').innerHTML = element
      } else {
        lastAppointmentElm.innerHTML = ''
      }
    }
    repeatingFrequencyRadios.forEach(input => input.addEventListener('click', lastAppointmentHandler))
    repeatingCount.addEventListener('change', lastAppointmentHandler)
  }
}

lastAppointment()
