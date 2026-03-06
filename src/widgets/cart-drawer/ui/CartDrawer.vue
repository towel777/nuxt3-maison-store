<script setup lang="ts">
import { useCartStore } from '@/features/manage-cart/model/cart.store'
import { useAuthStore } from '@/features/auth/model/auth.store'
import { useToastStore } from '@/features/toast/model/toast.store'
import { formatCurrency } from '@/shared/lib/helpers/currency'

const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToastStore()

function goCheckout() {
  if (!authStore.requireAuth()) {
    toast.error('Войдите, чтобы оформить заказ')
    return
  }
  cartStore.close()
  navigateTo('/checkout')
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" :class="{ open: cartStore.isOpen }" @click="cartStore.close()" />

    <div class="cart-drawer" :class="{ open: cartStore.isOpen }">
      <div class="cart-header">
        <span class="cart-header__title">
          Корзина
          <span v-if="cartStore.count" class="cart-header__count">({{ cartStore.count }})</span>
        </span>
        <button class="cart-close" @click="cartStore.close()">✕</button>
      </div>

      <div class="cart-body">
        <div v-if="cartStore.isEmpty" class="cart-empty">
          <div class="cart-empty__icon">🛒</div>
          <div>Корзина пуста</div>
          <button class="btn btn--outline btn--sm" @click="cartStore.close(); navigateTo('/')">
            За покупками
          </button>
        </div>

        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="cart-item__img">{{ item.emoji }}</div>
          <div class="cart-item__info">
            <div class="cart-item__name">{{ item.name }}</div>
            <div class="cart-item__bottom">
              <span class="cart-item__price">{{ formatCurrency(item.price * item.qty) }}</span>
              <div class="cart-item__controls">
                <button class="cart-item__qty-btn" @click="cartStore.updateQty(item.id, -1)">−</button>
                <span class="cart-item__qty">{{ item.qty }}</span>
                <button class="cart-item__qty-btn" @click="cartStore.updateQty(item.id, 1)">+</button>
                <button class="cart-item__remove" @click="cartStore.removeItem(item.id)">🗑</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!cartStore.isEmpty" class="cart-footer">
        <div class="cart-total">
          <span class="cart-total__label">Итого</span>
          <span class="cart-total__value">{{ formatCurrency(cartStore.subtotal) }}</span>
        </div>
        <button class="btn btn--primary btn--full" @click="goCheckout">
          Оформить заказ
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 200;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease;
  &.open { opacity: 1; pointer-events: auto; }
}

.cart-drawer {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: min(440px, 100%);
  background: var(--bg);
  z-index: 210;
  transform: translateX(100%);
  transition: transform 0.4s var(--ease);
  display: flex; flex-direction: column;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.1);
  &.open { transform: translateX(0); }
}

.cart-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  &__title { font-family: var(--serif); font-size: 1.2rem; font-weight: 500; }
  &__count { color: var(--text-m); font-family: var(--sans); font-size: 0.85rem; }
}

.cart-close {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; color: var(--text-s); transition: all 0.15s;
  &:hover { background: var(--surface); color: var(--text); }
}

.cart-body { flex: 1; overflow-y: auto; padding: 16px 24px; }

.cart-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%; gap: 12px; color: var(--text-m);
  &__icon { font-size: 3rem; opacity: 0.4; }
}

.cart-item {
  display: grid; grid-template-columns: 72px 1fr; gap: 14px;
  padding: 16px 0; border-bottom: 1px solid var(--border);

  &__img {
    width: 72px; height: 72px; border-radius: 8px;
    background: var(--surface);
    display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
  }
  &__info { display: flex; flex-direction: column; justify-content: space-between; }
  &__name { font-size: 0.88rem; font-weight: 500; line-height: 1.3; }
  &__bottom { display: flex; align-items: center; justify-content: space-between; }
  &__price { font-size: 0.92rem; font-weight: 600; }
  &__controls { display: flex; align-items: center; gap: 4px; }

  &__qty-btn {
    width: 28px; height: 28px; border-radius: 6px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; color: var(--text-s); transition: all 0.15s;
    &:hover { background: var(--surface); border-color: var(--border-dark); }
  }

  &__qty { font-size: 0.82rem; font-weight: 600; width: 24px; text-align: center; }
  &__remove { font-size: 0.75rem; color: var(--text-m); transition: color 0.15s; margin-left: 8px; &:hover { color: var(--danger); } }
}

.cart-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}

.cart-total {
  display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;
  &__label { font-size: 0.9rem; color: var(--text-s); }
  &__value { font-family: var(--serif); font-size: 1.4rem; font-weight: 600; }
}
</style>
