# frontend-test-assignment
Frontend test assignment with post filtering, date range picker, view switcher, and load more functionality.

Верстка профілю з перемиканням **List View** / **Grid View** за макетами Figma.


Відкрийте адресу з термінала (зазвичай http://localhost:3000).

## Структура

- `index.html` — семантична розмітка
- `css/` — стилі та design tokens
- `js/data.js` — спільні дані карток для обох режимів
- `js/main.js` — рендер, перемикач виду, Flatpickr, календар
- `assets/images/` — зображення з Figma

## Макет (desktop 1440px)

| Параметр | Значення |
|----------|----------|
| Контент | 836px по центру |
| List row | 86px висота, 8px між рядками |
| Grid | 4 колонки × 203px, gap 8px / 16px |
| Картка grid | 203×341px (зображення 203×203) |
| Шрифти | Montserrat 24px (назва), Roboto 14–16px |

## Адаптив

- **≤1200px** — сітка 3 колонки
- **≤992px** — сітка 2 колонки, спрощений header
- **≤480px** — сітка 1 колонка, компактний list
