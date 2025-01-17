<script setup lang="ts">
import { useOrderStore } from '@/entities/order/model/order.store'

const orderStore = useOrderStore()

useHead({ title: 'Заказ оформлен — MAISON' })
</script>

<template>
  <div class="container">
    <div class="empty-state" style="padding: 120px 20px">
      <div class="empty-state__icon">🎉</div>
      <div class="empty-state__title" style="font-size: 1.8rem">Заказ оформлен!</div>
      <div class="empty-state__text" style="max-width: 400px">
        Ваш заказ <strong>{{ orderStore.lastOrderId }}</strong> успешно создан.<br>
        Мы отправим уведомление на вашу почту.
      </div>
      <div style="display: flex; gap: 12px">
        <NuxtLink to="/orders" class="btn btn--primary btn--sm">Мои заказы</NuxtLink>
        <NuxtLink to="/" class="btn btn--outline btn--sm">Продолжить покупки</NuxtLink>
      </div>
    </div>
  </div>
</template>
