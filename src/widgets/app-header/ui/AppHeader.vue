<script setup lang="ts">
import { useCartStore } from '@/features/manage-cart/model/cart.store'
import { useAuthStore } from '@/features/auth/model/auth.store'

const cartStore = useCartStore()
const authStore = useAuthStore()
const route = useRoute()

const scrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 10
  }, { passive: true })
})
</script>

<template>
  <nav class="nav" :class="{ shadow: scrolled }">
    <div class="nav__inner">
      <NuxtLink to="/" class="nav__logo">
        Mai<span>son</span>
      </NuxtLink>

      <div class="nav__links">
        <NuxtLink to="/" class="nav__link" :class="{ active: route.path === '/' }">
          Каталог
        </NuxtLink>
        <NuxtLink to="/orders" class="nav__link" :class="{ active: route.path === '/orders' }">
          Заказы
        </NuxtLink>
        <NuxtLink to="/profile" class="nav__link" :class="{ active: route.path === '/profile' }">
          Кабинет
        </NuxtLink>
      </div>

      <div class="nav__icons">
        <button class="nav__icon-btn" title="Корзина" @click="cartStore.toggle()">
          🛒
          <span v-if="cartStore.count" class="nav__badge">{{ cartStore.count }}</span>
        </button>
        <button
          class="nav__icon-btn"
          :title="authStore.isAuthenticated ? authStore.user!.name : 'Войти'"
          @click="authStore.isAuthenticated ? navigateTo('/profile') : authStore.openModal()"
        >
          {{ authStore.isAuthenticated ? '👤' : '🔑' }}
        </button>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 90;
  background: rgba(250, 248, 245, 0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  padding: 0 24px;
  transition: box-shadow 0.3s ease;

  &.shadow { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04); }

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  &__logo {
    font-family: var(--serif);
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    span { color: var(--accent); }
  }

  &__links {
    display: flex;
    gap: 28px;

    @include tablet { display: none; }
  }

  &__link {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-s);
    letter-spacing: 0.03em;
    transition: color 0.2s;
    position: relative;
    padding: 4px 0;

    &:hover, &.active { color: var(--text); }
    &.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--accent);
    }
  }

  &__icons { display: flex; gap: 8px; }

  &__icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    color: var(--text-s);
    transition: all 0.2s;
    position: relative;

    &:hover { background: var(--surface); color: var(--text); }
  }

  &__badge {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 17px;
    height: 17px;
    border-radius: 9px;
    background: var(--accent);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
  }
}
</style>
