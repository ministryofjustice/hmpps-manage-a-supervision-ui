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
    for (let index = 1; index < 4; index += 1) {
      timeOptions.push({ text: `${hour}:${index * 15}${suffix}` })
    }
  }
  res.locals.timeOptions = timeOptions
  return next()
}
