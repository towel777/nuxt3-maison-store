# Документация MAISON Store

E-commerce магазин на Nuxt 3 + TypeScript + Pinia + Feature-Sliced Design.

## Содержание

| Документ | Описание |
|----------|---------|
| [architecture.md](./architecture.md) | FSD-слои, компоненты, аутентификация, z-index |
| [stores.md](./stores.md) | Все Pinia stores: state, getters, actions |
| [pages.md](./pages.md) | Все страницы: логика, guards, формы |
| [api.md](./api.md) | Nitro API эндпоинты, типы, замена на БД |
| [styling.md](./styling.md) | CSS-переменные, SCSS-миксины, глобальные классы |

## Быстрый старт

```bash
npm install
npm run dev        # http://localhost:3000
```

## Стек

- **Nuxt 3.12** + **Vue 3.4** + **TypeScript 5.4** (strict)
- **Pinia 2.1** + `pinia-plugin-persistedstate`
- **Feature-Sliced Design v2** (`src/`)
- **SCSS** + CSS Custom Properties
- **Nitro** API (готов к подключению БД)
- **VueUse 10**, **Zod 3**

## Ключевые особенности

- Аутентификация **моковая** — пароль не проверяется, state не персистируется
- Корзина **персистируется** в localStorage через плагин
- Статусы заказов симулируются каждые 8 сек (для демо)
- Изображения товаров — emoji (без реальных файлов)
- `srcDir: 'src/'` — весь код приложения в `src/`, server в `src/server/`
