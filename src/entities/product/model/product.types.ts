export interface Product {
  id: number
  name: string
  category: string
  price: number
  oldPrice?: number
  emoji: string
  badge?: 'sale' | 'new'
  sku: string
  stock: number
  description: string
}

export type ProductCategory = string

export interface ProductFilters {
  category?: string
  search?: string
  sort?: 'default' | 'price-asc' | 'price-desc' | 'name'
}
