# Pinia Stores

Все stores используют Composition API стиль (`defineStore('id', () => {...})`).
Автообнаружение: `./src/**/model/**` (настроено в `nuxt.config.ts`).

---

## useAuthStore (`features/auth/model/auth.store.ts`)

### State
| Поле | Тип | Описание |
|------|-----|---------|
| `user` | `User \| null` | Текущий пользователь |
| `showModal` | `boolean` | Видимость модалки |
| `authMode` | `'login' \| 'register'` | Текущий режим модалки |

### Getters
| Геттер | Тип | Описание |
|--------|-----|---------|
| `isAuthenticated` | `boolean` | `!!user` |

### Actions
| Метод | Описание |
|-------|---------|
| `login(email, password)` | Создаёт User из email (password игнорируется) |
| `register(name, email, password)` | Создаёт User с именем |
| `logout()` | Обнуляет user |
| `openModal(mode?)` | Открывает модалку в нужном режиме |
| `closeModal()` | Закрывает модалку |
| `requireAuth()` | Guard: возвращает `true` если авторизован, иначе открывает модалку и возвращает `false` |

---

## useCartStore (`features/manage-cart/model/cart.store.ts`)

### State
| Поле | Тип | Описание |
|------|-----|---------|
| `items` | `CartItem[]` | Товары в корзине |
| `isOpen` | `boolean` | Открыта ли панель корзины |

### CartItem
```ts
interface CartItem {
  id: number
  name: string
  price: number
  emoji: string
  qty: number
}
```

### Getters
| Геттер | Тип | Описание |
|--------|-----|---------|
| `count` | `number` | Суммарное количество товаров |
| `subtotal` | `number` | Сумма без доставки |
| `shippingCost` | `number` | 0 если subtotal ≥ 5000, иначе 490 |
| `total` | `number` | subtotal + shippingCost |
| `untilFreeShipping` | `number` | Сколько не хватает до бесплатной доставки |
| `isEmpty` | `boolean` | Нет товаров |

### Actions
| Метод | Описание |
|-------|---------|
| `addItem(product, qty?)` | Добавляет товар или увеличивает qty существующего |
| `updateQty(itemId, delta)` | Изменяет qty на delta; при qty ≤ 0 удаляет товар |
| `removeItem(itemId)` | Удаляет товар |
| `clear()` | Очищает корзину |
| `open()` / `close()` / `toggle()` | Управление видимостью дравера |

---

## useProductStore (`entities/product/model/product.store.ts`)

### State
| Поле | Тип | Описание |
|------|-----|---------|
| `products` | `Product[]` | Все товары с сервера |
| `isLoading` | `boolean` | Статус загрузки |
| `filters` | `ProductFilters` | Активные фильтры |

### ProductFilters
```ts
interface ProductFilters {
  category?: string
  search?: string
  sort?: 'default' | 'price-asc' | 'price-desc' | 'name'
}
```

### Getters
| Геттер | Тип | Описание |
|--------|-----|---------|
| `categories` | `string[]` | Уникальные категории из products |
| `filteredProducts` | `Product[]` | Отфильтрованные и отсортированные товары |

### Actions
| Метод | Описание |
|-------|---------|
| `fetchProducts()` | `$fetch('/api/products')`, сохраняет в products |
| `getProductById(id)` | Ищет товар в локальном массиве |
| `setFilters(partial)` | Мёрджит фильтры |
| `resetFilters()` | Сбрасывает к `{ sort: 'default' }` |

---

## useOrderStore (`entities/order/model/order.store.ts`)

### State
| Поле | Тип | Описание |
|------|-----|---------|
| `orders` | `Order[]` | История заказов (новые в начале) |
| `lastOrderId` | `string` | ID последнего созданного заказа |

### Actions
| Метод | Описание |
|-------|---------|
| `placeOrder(items, total, data)` | Создаёт заказ, запускает симуляцию статусов, возвращает orderId |
| `getOrderById(id)` | Поиск заказа по ID |

**Формат ID заказа:** `ORD-{Date.now().toString(36).toUpperCase()}`

**Симуляция статусов** (`simulateStatusChanges`): каждые 8 секунд переключает `pending → processing → shipped → delivered`. В продакшене заменить на WebSocket или polling.

---

## useToastStore (`features/toast/model/toast.store.ts`)

### State
| Поле | Тип | Описание |
|------|-----|---------|
| `toasts` | `Toast[]` | Очередь уведомлений |

### Actions
| Метод | Описание |
|-------|---------|
| `success(text)` | Зелёный toast, авто-удаление через 3500ms |
| `error(text)` | Красный toast, авто-удаление через 3500ms |
| `show(text, type)` | Базовый метод |
