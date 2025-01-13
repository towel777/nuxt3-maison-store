export interface UserAddress {
  city: string
  address: string
  zip: string
}

export interface User {
  name: string
  email: string
  phone: string
  birthday: string
  addresses: UserAddress[]
}
