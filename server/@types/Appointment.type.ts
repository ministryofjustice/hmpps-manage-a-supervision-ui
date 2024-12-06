export interface Appointment {
  type: string
  location: string
  date: string
  'start-time': string
  'end-time': string
  repeating: 'Yes' | 'No'
  'repeating-frequency': string
  'repeating-count': string
  id?: string
}
