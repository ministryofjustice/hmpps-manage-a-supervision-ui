// eslint-disable-next-line import/no-cycle

import { Name } from './common'

export interface previousOrderHistory {
  name: Name
  previousOrders: previousOrder[]
}

export interface previousOrder {
  title: string
  description: string
  terminationDate: string
}
