<script setup lang="ts">
import type { Product } from '@/entities/product/model/product.types'
import { formatCurrency } from '@/shared/lib/helpers/currency'

defineProps<{
  product: Product
}>()
</script>

<template>
  <NuxtLink :to="`/products/${product.id}`" class="product-card">
    <div class="product-card__img">
      {{ product.emoji }}
      <span
        v-if="product.badge"
        class="product-card__badge"
        :class="`badge--${product.badge}`"
      >
        {{ product.badge === 'sale' ? 'Скидка' : 'Новинка' }}
      </span>
    </div>
    <div class="product-card__body">
      <div class="product-card__category">{{ product.category }}</div>
      <div class="product-card__name">{{ product.name }}</div>
      <div class="product-card__price">
        <span class="product-card__current">{{ formatCurrency(product.price) }}</span>
        <span v-if="product.oldPrice" class="product-card__old">
          {{ formatCurrency(product.oldPrice) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.35s var(--ease);
  display: block;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
    border-color: var(--border-dark);
  }

  &__img {
    aspect-ratio: 1;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    position: relative;
  }

  &__badge {
    position: absolute;
    top: 10px; left: 10px;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__body { padding: 16px 18px 18px; }

  &__category {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-m);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  &__name {
    font-family: var(--serif);
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 8px;
    line-height: 1.3;
    color: var(--text);
  }

  &__price { display: flex; align-items: baseline; gap: 8px; }
  &__current { font-size: 1.05rem; font-weight: 600; color: var(--text); }
  &__old { font-size: 0.82rem; color: var(--text-m); text-decoration: line-through; }
}

.badge--sale { background: var(--danger); color: #fff; }
.badge--new { background: var(--accent); color: #fff; }

@include mobile {
  .product-card__body { padding: 10px 12px 14px; }
}
</style>
