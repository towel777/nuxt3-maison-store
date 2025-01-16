<script setup lang="ts">
import { useCartStore } from '@/features/manage-cart/model/cart.store'
import { useToastStore } from '@/features/toast/model/toast.store'
import { formatCurrency } from '@/shared/lib/helpers/currency'
import type { Product } from '@/entities/product/model/product.types'

const route = useRoute()
const cartStore = useCartStore()
const toast = useToastStore()

const { data: product, error } = await useFetch<Product>(
  `/api/products/${route.params.id}`,
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
}

useHead({ title: `${product.value?.name} — MAISON` })

const qty = ref(1)

function addToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, qty.value)
  toast.success(`${product.value.name} добавлен в корзину`)
  cartStore.open()
}
</script>

<template>
  <div v-if="product" class="container">
    <div class="page-header">
      <div class="breadcrumbs">
        <NuxtLink to="/">Каталог</NuxtLink>
        <span>›</span>
        {{ product.category }}
        <span>›</span>
        {{ product.name }}
      </div>
    </div>

    <div class="product-detail">
      <div class="pd__gallery">{{ product.emoji }}</div>

      <div class="pd__info">
        <div class="pd__category">{{ product.category }}</div>
        <h1 class="pd__name">{{ product.name }}</h1>

        <div class="pd__price-row">
          <span class="pd__price">{{ formatCurrency(product.price) }}</span>
          <span v-if="product.oldPrice" class="pd__old-price">
            {{ formatCurrency(product.oldPrice) }}
          </span>
        </div>

        <p class="pd__desc">{{ product.description }}</p>

        <div class="pd__meta">
          <div class="pd__meta-row">
            <span class="pd__meta-label">Артикул</span>
            <span class="pd__meta-value">{{ product.sku }}</span>
          </div>
          <div class="pd__meta-row">
            <span class="pd__meta-label">В наличии</span>
            <span
              class="pd__meta-value"
              :style="{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }"
            >
              {{ product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии' }}
            </span>
          </div>
          <div class="pd__meta-row">
            <span class="pd__meta-label">Доставка</span>
            <span class="pd__meta-value">1–3 дня</span>
          </div>
        </div>

        <div class="pd__actions">
          <div class="qty-selector">
            <button class="qty-btn" @click="qty = Math.max(1, qty - 1)">−</button>
            <div class="qty-value">{{ qty }}</div>
            <button class="qty-btn" @click="qty = Math.min(product.stock, qty + 1)">+</button>
          </div>
          <button
            class="btn btn--primary"
            style="flex: 1"
            :disabled="!product.stock"
            @click="addToCart"
          >
            🛒 В корзину — {{ formatCurrency(product.price * qty) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  padding: 48px 0 80px;

  @include tablet { grid-template-columns: 1fr; }
}

.pd {
  &__gallery {
    aspect-ratio: 1; background: var(--surface); border-radius: var(--radius);
    display: flex; align-items: center; justify-content: center; font-size: 6rem;
  }
  &__info { padding: 8px 0; }
  &__category { font-size: 0.72rem; font-weight: 600; color: var(--text-m); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; }
  &__name { font-family: var(--serif); font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 500; margin-bottom: 16px; line-height: 1.2; }
  &__price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
  &__price { font-size: 1.8rem; font-weight: 600; }
  &__old-price { font-size: 1.1rem; color: var(--text-m); text-decoration: line-through; }
  &__desc { font-size: 0.92rem; color: var(--text-s); line-height: 1.75; margin-bottom: 28px; }

  &__meta {
    display: flex; flex-direction: column; gap: 10px;
    margin-bottom: 28px; padding: 20px; background: var(--surface); border-radius: 8px;
  }
  &__meta-row { display: flex; justify-content: space-between; font-size: 0.85rem; }
  &__meta-label { color: var(--text-m); }
  &__meta-value { font-weight: 500; }

  &__actions { display: flex; gap: 12px; }
}

.qty-selector {
  display: flex; align-items: center;
  border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
}

.qty-btn {
  width: 40px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; color: var(--text-s); transition: all 0.15s;
  &:hover { background: var(--surface); color: var(--text); }
}

.qty-value {
  width: 44px; text-align: center; font-size: 0.95rem; font-weight: 600;
  border-left: 1px solid var(--border); border-right: 1px solid var(--border);
}
</style>
