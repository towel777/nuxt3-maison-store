<script setup lang="ts">
import { useCartStore } from '@/features/manage-cart/model/cart.store'
import { useAuthStore } from '@/features/auth/model/auth.store'
import { useOrderStore } from '@/entities/order/model/order.store'
import { useToastStore } from '@/features/toast/model/toast.store'
import { formatCurrency } from '@/shared/lib/helpers/currency'

const cartStore = useCartStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const toast = useToastStore()

// Redirect if not authenticated or cart is empty
if (!authStore.isAuthenticated) {
  navigateTo('/')
}

useHead({ title: 'Оформление заказа — MAISON' })

const form = reactive({
  firstName: authStore.user?.name.split(' ')[0] || '',
  lastName: authStore.user?.name.split(' ')[1] || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  city: '',
  zip: '',
  address: '',
  comment: '',
  payment: 'card',
})

const paymentMethods = [
  { id: 'card', label: 'Карта', icon: '💳' },
  { id: 'sbp', label: 'СБП', icon: '📱' },
  { id: 'cash', label: 'Наложенный', icon: '💵' },
]

const canSubmit = computed(() =>
  form.firstName && form.email && form.phone && form.city && form.address,
)

function placeOrder() {
  if (!canSubmit.value) {
    toast.error('Заполните все обязательные поля')
    return
  }

  orderStore.placeOrder(cartStore.items, cartStore.total, form)
  cartStore.clear()
  navigateTo('/order-success')
}
</script>

<template>
  <div class="container">
    <div class="page-header">
      <div class="breadcrumbs">
        <NuxtLink to="/">Каталог</NuxtLink>
        <span>›</span>
        Оформление заказа
      </div>
      <h1 class="page-header__title">Оформление заказа</h1>
    </div>

    <div class="checkout-layout">
      <div>
        <!-- Contact -->
        <div class="form-section">
          <div class="form-section__title">Контактные данные</div>
          <div class="form-grid">
            <div class="form-group"><label class="form-label">Имя</label><input class="form-input" v-model="form.firstName" placeholder="Иван"></div>
            <div class="form-group"><label class="form-label">Фамилия</label><input class="form-input" v-model="form.lastName" placeholder="Иванов"></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" v-model="form.email" type="email" placeholder="ivan@example.com"></div>
            <div class="form-group"><label class="form-label">Телефон</label><input class="form-input" v-model="form.phone" placeholder="+7 (999) 123-45-67"></div>
          </div>
        </div>

        <!-- Address -->
        <div class="form-section">
          <div class="form-section__title">Адрес доставки</div>
          <div class="form-grid">
            <div class="form-group"><label class="form-label">Город</label><input class="form-input" v-model="form.city" placeholder="Москва"></div>
            <div class="form-group"><label class="form-label">Индекс</label><input class="form-input" v-model="form.zip" placeholder="123456"></div>
            <div class="form-group form-group--full"><label class="form-label">Улица, дом, квартира</label><input class="form-input" v-model="form.address" placeholder="ул. Тверская, д. 1, кв. 10"></div>
            <div class="form-group form-group--full"><label class="form-label">Комментарий</label><input class="form-input" v-model="form.comment" placeholder="Домофон, подъезд..."></div>
          </div>
        </div>

        <!-- Payment -->
        <div class="form-section">
          <div class="form-section__title">Способ оплаты</div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap">
            <button
              v-for="m in paymentMethods"
              :key="m.id"
              class="btn btn--sm"
              :class="form.payment === m.id ? 'btn--accent' : 'btn--outline'"
              @click="form.payment = m.id"
            >
              {{ m.icon }} {{ m.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <div class="order-summary__title">Ваш заказ</div>

        <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
          <span>{{ item.name }} × {{ item.qty }}</span>
          <span style="font-weight: 600">{{ formatCurrency(item.price * item.qty) }}</span>
        </div>

        <div class="summary-divider" />
        <div class="summary-item"><span>Товары</span><span>{{ formatCurrency(cartStore.subtotal) }}</span></div>
        <div class="summary-item"><span>Доставка</span><span>{{ cartStore.shippingCost === 0 ? 'Бесплатно' : formatCurrency(cartStore.shippingCost) }}</span></div>
        <div class="summary-item summary-item--total"><span>Итого</span><span>{{ formatCurrency(cartStore.total) }}</span></div>

        <button
          class="btn btn--primary btn--full"
          style="margin-top: 20px"
          :disabled="!canSubmit"
          @click="placeOrder"
        >
          Оформить заказ
        </button>

        <p v-if="cartStore.untilFreeShipping > 0" class="free-shipping-hint">
          До бесплатной доставки: {{ formatCurrency(cartStore.untilFreeShipping) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checkout-layout {
  display: grid; grid-template-columns: 1fr 360px; gap: 48px; padding: 40px 0 80px;
  @include tablet { grid-template-columns: 1fr; }
}

.order-summary {
  position: sticky; top: 88px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 24px; align-self: start;
  &__title { font-family: var(--serif); font-size: 1.1rem; font-weight: 500; margin-bottom: 16px; }

  @include tablet { position: static; }
}

.summary-item {
  display: flex; justify-content: space-between;
  font-size: 0.88rem; padding: 6px 0; color: var(--text-s);
  &--total {
    border-top: 1px solid var(--border); margin-top: 10px;
    padding-top: 14px; font-size: 1rem; font-weight: 600; color: var(--text);
  }
}

.summary-divider { height: 1px; background: var(--border); margin: 12px 0; }

.free-shipping-hint {
  font-size: 0.75rem; color: var(--text-m); text-align: center; margin-top: 10px;
}
</style>
