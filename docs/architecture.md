# Архитектура проекта

## Feature-Sliced Design (FSD v2)

Проект строго следует FSD. Каждый слой может импортировать **только из слоёв ниже себя**.

```
pages → widgets → features → entities → shared
```

Запрещено: `entities` импортирует из `features`, `shared` импортирует из `entities`.

---

## Слои

### `pages/` — маршруты

| Файл | Маршрут | SSR/CSR |
|------|---------|---------|
| `index.vue` | `/` | ISR 60s |
| `products/[id].vue` | `/products/:id` | ISR 300s |
| `checkout.vue` | `/checkout` | CSR |
| `orders.vue` | `/orders` | SSR |
| `profile.vue` | `/profile` | CSR |
| `order-success.vue` | `/order-success` | — |

Страницы не содержат бизнес-логики — только оркестрируют stores и компоненты.

---

### `widgets/` — составные блоки

**`app-header/ui/AppHeader.vue`**
- Sticky nav с blur backdrop
- Добавляет тень при `scrollY > 10` (через window scroll listener)
- Показывает счётчик корзины из `useCartStore`
- Иконка профиля: если авторизован → `/profile`, иначе → `openModal()`

**`cart-drawer/ui/CartDrawer.vue`**
- Slide-out панель через `transform: translateX`
- Рендерится через `<Teleport to="body">`, z-index 210
- Управление количеством товаров (`updateQty(id, delta)`)
- При клике "Оформить заказ" вызывает `requireAuth()` — если не авторизован, показывает модалку и прерывает навигацию

---

### `features/` — пользовательские взаимодействия

**`auth/`**
- `auth.store.ts` — `useAuthStore`: хранит `user`, `showModal`, `authMode`
- Авторизация **моковая**: `login()` создаёт User из email, пароль игнорируется
- `requireAuth()` — возвращает `true` если авторизован, иначе открывает модалку и возвращает `false`
- `AuthModal.vue` — модалка логина/регистрации через `<Teleport to="body">`, z-index 300

**`manage-cart/`**
- `cart.store.ts` — `useCartStore`: список `CartItem[]`
- Бесплатная доставка при subtotal ≥ 5000 ₽, иначе +490 ₽
- `addItem()` — если товар уже в корзине, увеличивает qty
- `updateQty(id, delta)` — при qty ≤ 0 автоматически удаляет товар

**`toast/`**
- `toast.store.ts` — `useToastStore`: очередь `Toast[]`
- `success(text)` / `error(text)` — добавляет toast, авто-удаление через 3500ms
- `ToastContainer.vue` — `<TransitionGroup>` анимация fadeUp, позиция fixed bottom-right, z-index 500

---

### `entities/` — бизнес-объекты

**`product/`**
- `Product` тип: `id, name, category, price, oldPrice?, emoji, badge?, sku, stock, description`
- `useProductStore` — загружает товары через `$fetch('/api/products')`, хранит `filters` (category, search, sort)
- `filteredProducts` — computed с фильтрацией и сортировкой
- `ProductCard.vue` — карточка-ссылка на `/products/:id`, показывает badge sale/new

**`order/`**
- `Order` тип: `id, date, status, items, total, address`
- `OrderStatus`: `pending | processing | shipped | delivered`
- `useOrderStore.placeOrder()` — создаёт заказ с ID `ORD-{timestamp}`, запускает `simulateStatusChanges()`
- `simulateStatusChanges()` — меняет статус каждые 8 секунд (демо-режим, в продакшене заменить на WebSocket/polling)
- `ORDER_STATUS_LABELS` / `ORDER_STATUS_CLASSES` — маппинг статусов для отображения

**`user/`**
- `User` тип: `name, email, phone, birthday, addresses: UserAddress[]`
- `UserAddress`: `city, address, zip`

---

### `shared/` — утилиты

**`shared/lib/helpers/currency.ts`**
- `formatCurrency(amount: number): string` — форматирует число в рубли через `Intl.NumberFormat('ru-RU')`

---

## Server (Nitro)

Файлы находятся в `src/server/` (не в корневом `server/`).

```
src/server/
├── api/products/
│   ├── index.get.ts    → GET /api/products
│   └── [id].get.ts     → GET /api/products/:id
└── data/products.ts    → массив из 16 товаров, 5 категорий
```

API работает через `defineEventHandler`. Данные — статический массив, готов к замене на Prisma/Drizzle ORM.

---

## Аутентификация

Полностью клиентская, без реального бэкенда:

1. `useAuthStore.login(email, password)` — создаёт User локально, password не проверяется
2. Защищённые страницы (`/orders`, `/profile`) объявляют `definePageMeta({ middleware: 'auth' })`
3. `src/middleware/auth.ts` — при неавторизованном доступе вызывает `openModal()` и редиректит на `/`
4. State **не персистится** — при перезагрузке страницы пользователь выходит из системы (в отличие от корзины)

---

## Z-index слои

| Элемент | z-index |
|---------|---------|
| AppHeader | 90 |
| CartDrawer overlay | 200 |
| CartDrawer panel | 210 |
| AuthModal | 300 |
| ToastContainer | 500 |
