<script setup lang="ts">
import { useAuthStore } from '@/features/auth/model/auth.store'
import { useOrderStore } from '@/entities/order/model/order.store'
import { useToastStore } from '@/features/toast/model/toast.store'
import { ORDER_STATUS_LABELS, ORDER_STATUS_CLASSES } from '@/entities/order/model/order.types'
import { formatCurrency } from '@/shared/lib/helpers/currency'

const authStore = useAuthStore()
const orderStore = useOrderStore()
const toast = useToastStore()

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Личный кабинет — MAISON' })

const tab = ref<'info' | 'orders' | 'addresses'>('info')

function logout() {
  authStore.logout()
  toast.success('Вы вышли из аккаунта')
  navigateTo('/')
}

function saveProfile() {
  toast.success('Данные сохранены')
}
</script>

<template>
  <div v-if="authStore.user" class="container">
    <div class="page-header">
      <h1 class="page-header__title">Личный кабинет</h1>
    </div>

    <div class="profile-layout">
      <!-- Sidebar Nav -->
      <nav class="profile-nav">
        <button class="profile-nav__btn" :class="{ active: tab === 'info' }" @click="tab = 'info'">👤 Профиль</button>
        <button class="profile-nav__btn" :class="{ active: tab === 'orders' }" @click="tab = 'orders'">📦 Заказы</button>
        <button class="profile-nav__btn" :class="{ active: tab === 'addresses' }" @click="tab = 'addresses'">📍 Адреса</button>
        <button class="profile-nav__btn profile-nav__btn--danger" @click="logout">🚪 Выйти</button>
      </nav>

      <div>
        <!-- Info Tab -->
        <div v-if="tab === 'info'" class="profile-card">
          <div class="avatar-section">
            <div class="avatar">{{ authStore.user.name.charAt(0) }}</div>
            <div>
              <div class="avatar__name">{{ authStore.user.name }}</div>
              <div class="avatar__email">{{ authStore.user.email }}</div>
            </div>
          </div>

          <div class="profile-card__title">Личные данные</div>
          <div class="form-grid">
            <div class="form-group"><label class="form-label">Имя</label><input class="form-input" v-model="authStore.user.name"></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-input" v-model="authStore.user.email"></div>
            <div class="form-group"><label class="form-label">Телефон</label><input class="form-input" v-model="authStore.user.phone"></div>
            <div class="form-group"><label class="form-label">Дата рождения</label><input class="form-input" type="date" v-model="authStore.user.birthday"></div>
          </div>
          <button class="btn btn--primary btn--sm" style="margin-top: 20px" @click="saveProfile">Сохранить</button>
        </div>

        <!-- Orders Tab -->
        <div v-if="tab === 'orders'">
          <div v-if="orderStore.orders.length" class="orders-compact">
            <div v-for="o in orderStore.orders" :key="o.id" class="order-row">
              <span class="order-row__id">{{ o.id }}</span>
              <span class="order-row__date">{{ o.date }}</span>
              <span class="order-status" :class="ORDER_STATUS_CLASSES[o.status]">{{ ORDER_STATUS_LABELS[o.status] }}</span>
              <span class="order-row__count">{{ o.items.length }} товаров</span>
              <span class="order-row__total">{{ formatCurrency(o.total) }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-state__icon">📦</div>
            <div class="empty-state__title">Заказов пока нет</div>
          </div>
        </div>

        <!-- Addresses Tab -->
        <div v-if="tab === 'addresses'" class="profile-card">
          <div class="profile-card__title">Адреса доставки</div>
          <div v-if="authStore.user.addresses.length" class="addresses-list">
            <div v-for="(a, i) in authStore.user.addresses" :key="i" class="address-item">
              <div>
                <div class="address-item__city">{{ a.city }}, {{ a.address }}</div>
                <div class="address-item__zip">{{ a.zip }}</div>
              </div>
              <button class="btn btn--danger btn--sm" @click="authStore.user!.addresses.splice(i, 1)">✕</button>
            </div>
          </div>
          <p v-else class="no-addresses">Нет сохранённых адресов</p>
          <button class="btn btn--outline btn--sm" @click="authStore.user!.addresses.push({ city: 'Москва', address: '', zip: '' })">
            + Добавить адрес
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-layout {
  display: grid; grid-template-columns: 220px 1fr; gap: 40px; padding: 40px 0 80px;
  @include tablet { grid-template-columns: 1fr; }
}

.profile-nav {
  display: flex; flex-direction: column; gap: 4px;
  position: sticky; top: 88px; align-self: start;

  &__btn {
    padding: 10px 16px; border-radius: 8px; font-size: 0.88rem;
    text-align: left; color: var(--text-s); transition: all 0.15s;
    &:hover { background: var(--surface); color: var(--text); }
    &.active { background: var(--accent-light); color: var(--accent); font-weight: 500; }
    &--danger { color: var(--danger); margin-top: 20px; }
  }
}

.profile-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 32px;
  &__title { font-family: var(--serif); font-size: 1.2rem; font-weight: 500; margin-bottom: 20px; }
}

.avatar-section {
  display: flex; align-items: center; gap: 20px;
  margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid var(--border);
}
.avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-size: 1.6rem; font-weight: 600;
}
.avatar__name { font-size: 1.05rem; font-weight: 600; }
.avatar__email { font-size: 0.85rem; color: var(--text-m); }

.orders-compact { display: flex; flex-direction: column; gap: 8px; }
.order-row {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  padding: 14px 20px; background: var(--bg-card);
  border: 1px solid var(--border); border-radius: 8px;
  &__id { font-family: var(--mono); font-size: 0.8rem; font-weight: 500; }
  &__date { font-size: 0.8rem; color: var(--text-m); }
  &__count { font-size: 0.82rem; color: var(--text-m); margin-left: auto; }
  &__total { font-size: 0.9rem; font-weight: 600; }
}

.order-status {
  padding: 3px 10px; border-radius: 16px; font-size: 0.68rem;
  font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
}

.addresses-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.address-item {
  padding: 16px; border: 1px solid var(--border); border-radius: 8px;
  display: flex; justify-content: space-between; align-items: center;
  &__city { font-size: 0.9rem; font-weight: 500; }
  &__zip { font-size: 0.8rem; color: var(--text-m); }
}
.no-addresses { font-size: 0.9rem; color: var(--text-m); margin-bottom: 16px; }

// Reuse status colors from orders page
.status--pending { background: #fef3c7; color: #92400e; }
.status--processing { background: #dbeafe; color: #1e40af; }
.status--shipped { background: #e0e7ff; color: #4338ca; }
.status--delivered { background: #d1fae5; color: #065f46; }
</style>
