// eslint-disable-next-line import/no-cycle

export interface previousOrderHistory {
  previousOrders: previousOrder[]
}

export interface previousOrder {
  title: string
  description: string
  terminationDate: string
}
