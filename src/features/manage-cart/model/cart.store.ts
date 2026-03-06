import { defineStore } from 'pinia'
import type { Product } from '@/entities/product/model/product.types'

export interface CartItem {
  id: number
  name: string
  price: number
  emoji: string
  qty: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  const config = useRuntimeConfig()
  const FREE_SHIPPING = config.public.freeShippingThreshold as number
  const SHIPPING_COST = config.public.shippingCost as number

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0),
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0),
  )

  const shippingCost = computed(() =>
    subtotal.value >= FREE_SHIPPING ? 0 : SHIPPING_COST,
  )

  const total = computed(() => subtotal.value + shippingCost.value)

  const untilFreeShipping = computed(() =>
    Math.max(0, FREE_SHIPPING - subtotal.value),
  )

  const isEmpty = computed(() => items.value.length === 0)

  function addItem(product: Product, qty: number = 1): void {
    const existing = items.value.find((i) => i.id === product.id)

    if (existing) {
      existing.qty += qty
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        qty,
      })
    }
  }

  function updateQty(itemId: number, delta: number): void {
    const item = items.value.find((i) => i.id === itemId)
    if (!item) return

    item.qty += delta
    if (item.qty <= 0) {
      removeItem(itemId)
    }
  }

  function removeItem(itemId: number): void {
    items.value = items.value.filter((i) => i.id !== itemId)
  }

  function clear(): void {
    items.value = []
  }

  function open(): void {
    isOpen.value = true
  }

  function close(): void {
    isOpen.value = false
  }

  function toggle(): void {
    isOpen.value = !isOpen.value
  }

  return {
    items,
    isOpen,
    count,
    subtotal,
    shippingCost,
    total,
    untilFreeShipping,
    isEmpty,
    addItem,
    updateQty,
    removeItem,
    clear,
    open,
    close,
    toggle,
  }
})
