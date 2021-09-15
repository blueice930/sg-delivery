export interface User {
  id: string,
  fname?: string,
  lname?: string,
  displayName: string,
  email: string,
  age?: number,
  phone?: string,
  wallet: Wallet,
  address: string[],
  itemUids?: string[],
  orderUids?: string[],
  admin?: boolean,
  storageAddress?: string,
}

export interface Wallet {
  balanceCent: number,
  coupons?: Coupon[],
}

export interface Coupon {
  uid: string,
  faceValueCent: number,
  isUsed: boolean,
  expireAt?: string,
  usedAt?: string,
  comments?: string,
}
