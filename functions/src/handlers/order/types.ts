export interface Order {
  uid: string,
  userId: string,
  itemUids: string[],
  status: OrderStatus,
  createdAt: number,
  updatedAt: number,
}

export enum OrderStatus {
  UNPAID='UNPAID',
  PAID='PAID',
  EXPIRED='EXPIRED',
  SHIPPING='SHIPPING',
  RECEIVED='RECEIVED',
  UNKNOWN='UNKNOWN',
  CANCELED='CANCELED',
}
