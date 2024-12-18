import { Route } from '../@types'

interface Item {
  text: string
  value?: string
}

export const getTimeOptions: Route<void> = (_req, res, next) => {
  const startHour = 9
  const endHour = 16
  const timeOptions: Item[] = [{ text: 'Choose time', value: '' }]
  for (let i = startHour; i <= endHour; i += 1) {
    const hour = i > 12 ? i - 12 : i
    const suffix = i >= 12 ? 'pm' : 'am'
    timeOptions.push({ text: `${hour}:00${suffix}` })
    for (let j = 1; j < 4; j += 1) {
      timeOptions.push({ text: `${hour}:${j * 15}${suffix}` })
    }
  }
  res.locals.timeOptions = timeOptions
  return next()
}
