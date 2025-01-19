# Стилизация

## Система дизайна

Все стили построены на CSS Custom Properties (переменных), объявленных в `src/app/styles/global.scss`.

---

## CSS-переменные (`:root`)

### Цвета фона
| Переменная | Значение | Описание |
|-----------|---------|---------|
| `--bg` | `#faf8f5` | Основной фон |
| `--bg-card` | `#fff` | Фон карточек |
| `--bg-hover` | `#f5f2ee` | Фон при hover |
| `--bg-dark` | `#1a1814` | Тёмный фон (toasts) |
| `--surface` | `#f0ece6` | Поверхность (изображения, плашки) |
| `--surface-dark` | `#e8e2da` | Тёмная поверхность |

### Границы
| Переменная | Значение |
|-----------|---------|
| `--border` | `#e0dbd4` |
| `--border-dark` | `#d0c9bf` |

### Текст
| Переменная | Значение | Использование |
|-----------|---------|--------------|
| `--text` | `#1a1814` | Основной текст |
| `--text-s` | `#5c564d` | Вторичный текст |
| `--text-m` | `#8a847b` | Приглушённый текст (мета, подписи) |
| `--text-inv` | `#faf8f5` | Инвертированный (на тёмном фоне) |

### Акцент и состояния
| Переменная | Значение | Использование |
|-----------|---------|--------------|
| `--accent` | `#b8860b` | Золотой акцент (кнопки, ссылки, badge) |
| `--accent-hover` | `#9a7009` | Hover акцента |
| `--accent-light` | `rgba(184,134,11,0.08)` | Фон активных фильтров |
| `--accent-glow` | `rgba(184,134,11,0.15)` | Box-shadow кнопок |
| `--danger` | `#c44536` | Ошибки, badge "sale", кнопка удаления |
| `--success` | `#4a7c59` | Успех, наличие товара |

### Типографика
| Переменная | Значение |
|-----------|---------|
| `--serif` | `'Playfair Display', Georgia, serif` |
| `--sans` | `'Outfit', system-ui, sans-serif` |
| `--mono` | `'JetBrains Mono', monospace` |

### Прочее
| Переменная | Значение | Использование |
|-----------|---------|--------------|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Анимации |
| `--radius` | `10px` | Стандартное скругление |

---

## SCSS Variables & Mixins

Файл `src/app/styles/_variables.scss` **автоматически инжектируется** во все `.vue` файлы через Vite preprocessor — дополнительный импорт не нужен.

```scss
// Брейкпоинты
$breakpoint-sm: 600px;
$breakpoint-md: 900px;
$breakpoint-lg: 1200px;

// Миксины
@include mobile   // max-width: 600px
@include tablet   // max-width: 900px
```

---

## Глобальные CSS-классы (`global.scss`)

### Layout
```scss
.container          // max-width: 1200px, margin: auto, padding: 0 24px
.page-header        // Шапка страницы с отступами и бордером снизу
.page-header__title // Serif, clamp(1.8rem, 4vw, 2.6rem)
.page-header__sub   // Вторичный текст
.breadcrumbs        // Хлебные крошки, font-size 0.78rem
.divider            // Горизонтальный разделитель с градиентом
```

### Кнопки (`.btn`)
```scss
.btn--primary   // Тёмный фон → акцент при hover
.btn--accent    // Акцентный фон
.btn--outline   // Обводка
.btn--danger    // Красный текст
.btn--sm        // Уменьшенный padding
.btn--full      // width: 100%
.btn:disabled   // opacity: 0.5, pointer-events: none
```

### Формы
```scss
.form-section       // Секция формы с заголовком
.form-grid          // 2-колоночная сетка
.form-group         // flex column, gap 5px
.form-group--full   // Растягивается на всю ширину (grid-column: 1/-1)
.form-label         // 0.78rem, font-weight 500, --text-m
.form-input         // Инпут с border, focus-ring через --accent-light
```

### Пустые состояния
```scss
.empty-state        // flex column, center, padding 80px
.empty-state__icon  // 3.5rem, opacity 0.35
.empty-state__title // Serif, 1.3rem
.empty-state__text  // 0.9rem, --text-m
```

---

## Page Transitions

Переход между маршрутами — `name: 'page', mode: 'out-in'`.

```scss
.page-enter-from  // opacity: 0, translateY(12px)
.page-leave-to    // opacity: 0, translateY(-12px)
// Длительность: 0.25s ease
```

---

## Скопированные стили статусов заказа

Стили `order-status` дублируются в `orders.vue` и `profile.vue` (оба scoped). Это намеренно — нет смысла выносить в global для двух мест.

```scss
.status--pending    // #fef3c7 / #92400e (жёлтый)
.status--processing // #dbeafe / #1e40af (синий)
.status--shipped    // #e0e7ff / #4338ca (фиолетовый)
.status--delivered  // #d1fae5 / #065f46 (зелёный)
```
