import { defineStore } from 'pinia'
import type { Product, ProductFilters } from './product.types'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const filters = ref<ProductFilters>({ sort: 'default' })

  const categories = computed(() =>
    [...new Set(products.value.map((p) => p.category))],
  )

  const filteredProducts = computed(() => {
    let result = [...products.value]

    if (filters.value.category) {
      result = result.filter((p) => p.category === filters.value.category)
    }

    if (filters.value.search) {
      const q = filters.value.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    switch (filters.value.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  })

  async function fetchProducts(): Promise<void> {
    isLoading.value = true
    try {
      const data = await $fetch<Product[]>('/api/products')
      products.value = data
    } finally {
      isLoading.value = false
    }
  }

  function getProductById(id: number): Product | undefined {
    return products.value.find((p) => p.id === id)
  }

  function setFilters(newFilters: Partial<ProductFilters>): void {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters(): void {
    filters.value = { sort: 'default' }
  }

  return {
    products,
    isLoading,
    filters,
    categories,
    filteredProducts,
    fetchProducts,
    getProductById,
    setFilters,
    resetFilters,
  }
})
