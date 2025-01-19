# Страницы

## `/` — Каталог (`pages/index.vue`)

**SSR:** ISR, кэш 60 секунд.

При загрузке вызывает `productStore.fetchProducts()` через `await` в `<script setup>` — данные приходят на сервере.

**Компоненты:**
- Sidebar с фильтрами по категории и сортировкой (sticky, скрывается на tablet)
- Поиск по названию и категории (inline filter в store)
- Сетка `ProductCard` через `auto-fill, minmax(240px, 1fr)`, на mobile — 2 колонки
- Empty state при пустом filteredProducts

**Доступные сортировки:** `default`, `price-asc`, `price-desc`, `name`

---

## `/products/:id` — Карточка товара (`pages/products/[id].vue`)

**SSR:** ISR, кэш 300 секунд.

Данные загружаются через `useFetch('/api/products/:id')`. При 404 от API — `throw createError({ statusCode: 404 })`.

**Логика:**
- Выбор количества (от 1 до `product.stock`)
- "В корзину" → `cartStore.addItem(product, qty)` + toast + открытие дравера
- Кнопка disabled при `stock === 0`
- Цена на кнопке обновляется реактивно: `formatCurrency(product.price * qty)`

---

## `/checkout` — Оформление заказа (`pages/checkout.vue`)

**CSR:** `ssr: false`. Без серверного рендеринга.

**Guard:** Если не авторизован — `navigateTo('/')` (без модалки, в отличие от middleware).

**Форма (`reactive`):**
```ts
{
  firstName, lastName, email, phone,  // Контакты (из authStore.user если есть)
  city, zip, address, comment,         // Доставка
  payment: 'card'                      // card | sbp | cash
}
```

**Валидация** `canSubmit`: `firstName && email && phone && city && address` (без zip и comment).

**Оформление:** `orderStore.placeOrder(items, total, form)` → `cartStore.clear()` → `navigateTo('/order-success')`.

**Сводка заказа** (sticky, справа): список items, subtotal, доставка, итого. Подсказка о бесплатной доставке если `untilFreeShipping > 0`.

---

## `/orders` — История заказов (`pages/orders.vue`)

**SSR:** `ssr: true`. Guard: `definePageMeta({ middleware: 'auth' })`.

Отображает `orderStore.orders` в обратном хронологическом порядке (новые сверху).

Каждая карточка показывает: ID заказа (моноширинный шрифт), дату, статус (цветной badge), список товаров с emoji и количеством, итоговую сумму.

---

## `/profile` — Личный кабинет (`pages/profile.vue`)

**CSR:** `ssr: false`. Guard: `definePageMeta({ middleware: 'auth' })`.

Три таба:

**👤 Профиль** — редактирование `authStore.user` напрямую через `v-model` (name, email, phone, birthday). Кнопка "Сохранить" показывает toast (реальное сохранение не реализовано).

**📦 Заказы** — компактный список заказов из `orderStore.orders` (статус, количество товаров, сумма).

**📍 Адреса** — список `authStore.user.addresses`. Добавление пустого адреса через `addresses.push({...})`, удаление через `addresses.splice(i, 1)`.

**Выход:** `authStore.logout()` + toast + `navigateTo('/')`.

---

## `/order-success` — Подтверждение заказа (`pages/order-success.vue`)

Простая страница-заглушка. Показывает `orderStore.lastOrderId`. Кнопки: "Мои заказы" и "Продолжить покупки".

---

## Layout (`layouts/default.vue`)

Оборачивает все страницы. Содержит:
- `<AppHeader />` — sticky nav
- `<slot />` — контент страницы в `<main>`
- `<CartDrawer />` — через Teleport, всегда в DOM
- `<AuthModal />` — через Teleport, всегда в DOM
- `<ToastContainer />` — через Teleport, всегда в DOM
