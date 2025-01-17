<script setup lang="ts">
import { useOrderStore } from '@/entities/order/model/order.store'
import { useAuthStore } from '@/features/auth/model/auth.store'
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES } from '@/entities/order/model/order.types'
import { formatCurrency } from '@/shared/lib/helpers/currency'

const orderStore = useOrderStore()
const authStore = useAuthStore()

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Мои заказы — MAISON' })
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-header__title">Мои заказы</h1>
      <p class="page-header__sub">{{ orderStore.orders.length }} заказов</p>
    </div>

    <div v-if="orderStore.orders.length" class="orders-list">
      <div v-for="o in orderStore.orders" :key="o.id" class="order-card">
        <div class="order-card__header">
          <span class="order-card__id">{{ o.id }}</span>
          <span class="order-card__date">{{ o.date }}</span>
          <span class="order-status" :class="ORDER_STATUS_CLASSES[o.status]">
            {{ ORDER_STATUS_LABELS[o.status] }}
          </span>
        </div>
        <div class="order-card__items">
          <div v-for="it in o.items" :key="it.id" class="order-card__item">
            <div class="order-card__item-icon">{{ it.emoji }}</div>
            <span class="order-card__item-name">{{ it.name }}</span>
            <span class="order-card__item-qty">× {{ it.qty }}</span>
            <span class="order-card__item-price">{{ formatCurrency(it.price * it.qty) }}</span>
          </div>
        </div>
        <div class="order-card__footer">
          <span class="order-card__total-label">Итого</span>
          <span class="order-card__total">{{ formatCurrency(o.total) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-state__icon">📦</div>
      <div class="empty-state__title">У вас пока нет заказов</div>
      <div class="empty-state__text">Перейдите в каталог, чтобы выбрать товары</div>
      <NuxtLink to="/" class="btn btn--primary btn--sm">Перейти в каталог</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.orders-list { display: flex; flex-direction: column; gap: 16px; padding: 40px 0 80px; }

.order-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius); overflow: hidden; transition: all 0.25s;
  &:hover { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); }

  &__header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px; background: var(--surface); flex-wrap: wrap; gap: 12px;
  }
  &__id { font-family: var(--mono); font-size: 0.82rem; font-weight: 500; }
  &__date { font-size: 0.82rem; color: var(--text-m); }

  &__items { padding: 16px 24px; }
  &__item {
    display: flex; align-items: center; gap: 12px; padding: 8px 0;
  }
  &__item-icon {
    width: 40px; height: 40px; border-radius: 6px; background: var(--surface);
    display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
  }
  &__item-name { font-size: 0.88rem; font-weight: 500; flex: 1; }
  &__item-qty { font-size: 0.82rem; color: var(--text-m); }
  &__item-price { font-size: 0.88rem; font-weight: 600; }

  &__footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 24px; border-top: 1px solid var(--border);
  }
  &__total-label { font-size: 0.82rem; color: var(--text-m); }
  &__total { font-family: var(--serif); font-size: 1.15rem; font-weight: 600; }
}

.order-status {
  padding: 4px 12px; border-radius: 20px;
  font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.04em; text-transform: uppercase;
}
.status--pending { background: #fef3c7; color: #92400e; }
.status--processing { background: #dbeafe; color: #1e40af; }
.status--shipped { background: #e0e7ff; color: #4338ca; }
.status--delivered { background: #d1fae5; color: #065f46; }
</style>
