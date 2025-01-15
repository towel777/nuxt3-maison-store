<script setup lang="ts">
import { useProductStore } from '@/entities/product/model/product.store'
import ProductCard from '@/entities/product/ui/ProductCard.vue'

const productStore = useProductStore()

// Fetch products on server
await productStore.fetchProducts()

useHead({ title: 'Каталог — MAISON' })
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-header__title">Каталог</h1>
      <p class="page-header__sub">{{ productStore.filteredProducts.length }} товаров</p>
    </div>

    <div class="catalog-layout">
      <!-- Sidebar Filters -->
      <aside class="filters">
        <div class="search-wrap">
          <input
            class="search-box"
            :value="productStore.filters.search"
            placeholder="Поиск товаров..."
            @input="productStore.setFilters({ search: ($event.target as HTMLInputElement).value })"
          >
        </div>

        <div class="filter-group">
          <div class="filter-group__title">Категории</div>
          <button
            class="filter-btn"
            :class="{ active: !productStore.filters.category }"
            @click="productStore.setFilters({ category: undefined })"
          >
            Все товары
          </button>
          <button
            v-for="c in productStore.categories"
            :key="c"
            class="filter-btn"
            :class="{ active: productStore.filters.category === c }"
            @click="productStore.setFilters({ category: c })"
          >
            {{ c }}
          </button>
        </div>

        <div class="filter-group">
          <div class="filter-group__title">Сортировка</div>
          <button
            v-for="s in sortOptions"
            :key="s.value"
            class="filter-btn"
            :class="{ active: productStore.filters.sort === s.value }"
            @click="productStore.setFilters({ sort: s.value as any })"
          >
            {{ s.label }}
          </button>
        </div>
      </aside>

      <!-- Product Grid -->
      <div>
        <div v-if="productStore.filteredProducts.length" class="products-grid">
          <ProductCard
            v-for="p in productStore.filteredProducts"
            :key="p.id"
            :product="p"
          />
        </div>

        <div v-else class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <div class="empty-state__title">Ничего не найдено</div>
          <div class="empty-state__text">Попробуйте изменить фильтры</div>
          <button class="btn btn--outline btn--sm" @click="productStore.resetFilters()">
            Сбросить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const sortOptions = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена ↑' },
  { value: 'price-desc', label: 'Цена ↓' },
  { value: 'name', label: 'По названию' },
]
</script>

<style lang="scss" scoped>
.catalog-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 40px;
  padding: 40px 0 80px;

  @include tablet { grid-template-columns: 1fr; }
}

.filters {
  position: sticky;
  top: 88px;
  align-self: start;

  @include tablet { display: none; }
}

.filter-group {
  margin-bottom: 28px;
  &__title {
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-m); margin-bottom: 12px;
  }
}

.filter-btn {
  display: block; width: 100%; text-align: left;
  padding: 8px 12px; border-radius: 6px;
  font-size: 0.88rem; color: var(--text-s); transition: all 0.15s;
  &:hover { background: var(--surface); color: var(--text); }
  &.active { background: var(--accent-light); color: var(--accent); font-weight: 500; }
}

.search-wrap {
  position: relative; margin-bottom: 24px;
  &::before { content: '🔍'; position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 0.82rem; opacity: 0.5; }
}

.search-box {
  width: 100%; padding: 10px 14px 10px 36px;
  border: 1px solid var(--border); border-radius: 8px;
  font-size: 0.88rem; background: var(--bg-card); transition: border-color 0.2s;
  &:focus { border-color: var(--accent); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;

  @include mobile { grid-template-columns: repeat(2, 1fr); gap: 12px; }
}
</style>
