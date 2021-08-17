export interface Item {
  uid: string,
  packageId: string,
  deliveryCompany?: string,
  userId: string,
  status: ItemStatus,
  itemName: string,
  itemQuantity: number,
  createdAt: number,
  arrivedAt?: number,
  combinedAt?: number,
  orderId?: string,
  weight?: number,
  size?: number,
  comments?: string,
}

export enum ItemStatus {
  CREATED = 'CREATED',
  ARRIVED_WAREHOUSE = 'ARRIVED_WAREHOUSE',
  COMBINED = 'COMBINED',
  SHIPPING = 'SHIPPING',
  RECEIVED = 'RECEIVED',
  EXPIRED = 'EXPIRED',
  UNKNOWN = 'UNKNOWN',
}
