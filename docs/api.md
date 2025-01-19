# Server API (Nitro)

Файлы API находятся в `src/server/api/` (не в корневом `server/`).
CORS включён для всех `/api/**` маршрутов (`nuxt.config.ts` → `routeRules`).

---

## Эндпоинты

### `GET /api/products`

Возвращает полный список товаров.

**Файл:** `src/server/api/products/index.get.ts`

**Ответ:** `Product[]`

```json
[
  {
    "id": 1,
    "name": "Кашемировый свитер",
    "category": "Одежда",
    "price": 12900,
    "oldPrice": 16900,
    "emoji": "🧥",
    "badge": "sale",
    "sku": "SW-1001",
    "stock": 15,
    "description": "..."
  }
]
```

---

### `GET /api/products/:id`

Возвращает один товар по числовому ID.

**Файл:** `src/server/api/products/[id].get.ts`

**Параметры:** `id` — число (парсится через `Number(getRouterParam(event, 'id'))`)

**Ответ:** `Product`

**Ошибка:** `404 { statusCode: 404, statusMessage: "Product not found" }` если товар не найден.

---

## Тип Product

```ts
interface Product {
  id: number
  name: string
  category: string
  price: number
  oldPrice?: number       // Если есть — показывается зачёркнутая цена
  emoji: string           // Используется вместо изображений
  badge?: 'sale' | 'new'  // Плашка на карточке
  sku: string             // Артикул товара
  stock: number           // Количество в наличии (0 = нет в наличии)
  description: string     // Полное описание для страницы товара
}
```

---

## Данные (`src/server/data/products.ts`)

16 товаров, 5 категорий:

| Категория | SKU-префикс | Количество |
|-----------|-------------|-----------|
| Одежда | SW-xxxx | 3 |
| Обувь | SH-xxxx | 3 |
| Интерьер | IN-xxxx | 4 |
| Аксессуары | AC-xxxx | 3 |
| Посуда | KT-xxxx | 3 |

Товары со скидкой (badge: `sale`): id 1, 4, 12
Новинки (badge: `new`): id 2, 5, 13

---

## Замена на реальную БД

Для подключения Prisma или Drizzle достаточно заменить содержимое обработчиков:

```ts
// src/server/api/products/index.get.ts
export default defineEventHandler(async () => {
  return await prisma.product.findMany()
})

// src/server/api/products/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) throw createError({ statusCode: 404 })
  return product
})
```
