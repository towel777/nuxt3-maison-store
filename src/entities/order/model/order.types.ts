export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered'

export interface OrderItem {
  id: number
  name: string
  price: number
  emoji: string
  qty: number
}

export interface Order {
  id: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  address: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Ожидает',
  processing: 'В сборке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
}

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  pending: 'status--pending',
  processing: 'status--processing',
  shipped: 'status--shipped',
  delivered: 'status--delivered',
}
