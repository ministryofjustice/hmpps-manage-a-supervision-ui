import { Name } from './common'

export interface PreviousOrderHistory {
  name: Name
  previousOrders: PreviousOrder[]
}

export interface PreviousOrder {
  eventNumber: string
  title: string
  description: string
  terminationDate: string
}
