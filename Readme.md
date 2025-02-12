## Структура
```
template-solid-js/
├── public/             // Статические файлы, которые будут напрямую использованы браузером (например, favicon.ico).
├── config/             // Конфигурационные файлы.
│  ├── config.ts       // Основной конфигурационный файл.
│  ├── dev.config.ts   // Конфигурация для режима разработки.
│  ├── odr.config.ts    // Конфигурация для ODR
│  ├── prod.config.ts  // Конфигурация для продакшн-сборки.
│  └── tsconfig.json  // Конфигурация TypeScript для файлов конфигурации.
├── src/                // Исходный код приложения.
│  ├── app/             // Основная логика приложения, компоненты верхнего уровня.
│  │  ├── modals/       // Компоненты модальных окон.
│  │  ├── pages/        // Компоненты страниц приложения (маршруты, если используется Solid-Start).
│  │  ├── popups/       // Компоненты всплывающих окон.
│  │  └── index.tsx     
│  ├── components/      // Многоразовые UI-компоненты.
│  │  └── index.tsx     
│  ├── engine/          // Ядро приложения, бизнес-логика, обработчики событий.
│  │  ├── api/          // Модули для взаимодействия с API.
│  │  │  └── module/    // (Пример структуры для модульности API).
│  │  │     └── index.ts 
│  │  ├── languages/    // Локализация приложения.
│  │  │  ├── data/       // Данные для локализации.
│  │  │  │  ├── ru.tsx
│  │  │  │  └── en.tsx
│  │  │  ├── module/       // Модули для работы с локализацией.
│  │  │  │  └── index.ts
│  │  │  └── index.ts   // Менеджер локализации.
│  │  ├── state/        // Управление состоянием приложения.
│  │  ├── utils/        // Вспомогательные функции и утилиты.
│  │  └── index.ts     
│  ├── source/         // Статические файлы (.svg).
│  │  └── index.ts     
│  ├── styles/         // Глобальные стили.
│  │  ├── default.css  // Основные стили.
│  │  └── system.css   // Системные стили (например, для модальных окон).
│  ├── index.tsx       // Точка входа.
│  └── types.d.ts      // Объявления типов.
├── package.json       
└── tsconfig.json      
```
## Начало работы

1. *Клонирование репозитория*
2. *Установка зависимостей:* npm install или yarn install
3. *Запуск сервера разработки:* npm run start или yarn start
4. *Сборка для продакшна:* npm run build или yarn build