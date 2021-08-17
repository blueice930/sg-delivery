export interface User {
  id: string,
  fname?: string,
  lname?: string,
  displayName: string,
  email: string,
  age?: number,
  phone?: string,
  wallet: Wallet,
  itemUids?: string[],
  orderUids?: string[],
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
