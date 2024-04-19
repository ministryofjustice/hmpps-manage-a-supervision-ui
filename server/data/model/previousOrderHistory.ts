// eslint-disable-next-line import/no-cycle

import { Name } from './common'

export interface PreviousOrderHistory {
  name: Name
  previousOrders: PreviousOrder[]
}

export interface PreviousOrder {
  title: string
  description: string
  terminationDate: string
}
