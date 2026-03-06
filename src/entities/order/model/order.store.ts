import { defineStore } from 'pinia'
import type { Order, OrderStatus } from './order.types'
import type { CartItem } from '@/features/manage-cart/model/cart.store'

interface CheckoutData {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  zip: string
  address: string
  comment: string
  payment: string
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const lastOrderId = ref('')

  function placeOrder(items: CartItem[], total: number, data: CheckoutData): string {
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`

    const order: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: 'pending',
      items: items.map((i) => ({ ...i })),
      total,
      address: `${data.city}, ${data.address}`,
    }

    orders.value.unshift(order)
    lastOrderId.value = orderId

    simulateStatusChanges(orderId)

    return orderId
  }

  function getOrderById(id: string): Order | undefined {
    return orders.value.find((o) => o.id === id)
  }

  function simulateStatusChanges(orderId: string): void {
    const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered']
    let idx = 0

    const interval = setInterval(() => {
      idx++
      const order = orders.value.find((o) => o.id === orderId)
      if (idx < statuses.length && order) {
        order.status = statuses[idx]
      } else {
        clearInterval(interval)
      }
    }, 8000)
  }

  return {
    orders,
    lastOrderId,
    placeOrder,
    getOrderById,
  }
})
