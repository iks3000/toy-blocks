# Быстрый старт - Toy Blocks

## 🚀 Быстрый запуск

### Вариант 1: Полный запуск (рекомендуется)

```bash
npm run dev
```

Это запустит одновременно React приложение и локальный сервер.

### Вариант 2: По отдельности

```bash
# Терминал 1: Локальный сервер
npm run server

# Терминал 2: React приложение
npm start
```

## 🔧 Решение проблем

### Ошибка: ERR_CONNECTION_REFUSED на порту 3002

**Причина:** Локальный сервер не запущен
**Решение:** Запустите `npm run server`

### Ошибка: CORS policy blocked

**Причина:** Внешние серверы не разрешают запросы с localhost
**Решение:**

1. Используйте локальный сервер (Node 4 будет работать)
2. Или отключите CORS в браузере для разработки

### Ошибка: npm install конфликты

**Решение:** Используйте `npm install --legacy-peer-deps`

### Ошибка: digital envelope routines::unsupported

**Причина:** Node.js v20 не совместим с react-scripts 4.0.3
**Решение:** ✅ Исправлено в package.json с NODE_OPTIONS='--openssl-legacy-provider'

### Ошибка: EADDRINUSE: address already in use :::3002

**Причина:** Порт 3002 уже занят
**Решение:**

```bash
lsof -ti:3002 | xargs kill -9
```

## 📊 Статус узлов

После запуска вы увидите:

- ✅ Node 4 (localhost:3002) - работает с локальным сервером
- ❌ Node 1-3 (Heroku) - CORS ошибки (нормально для разработки)

## 🧪 Тестирование

```bash
# Запуск тестов
npm test

# Сборка для продакшена
npm run build
```

## 🌐 Доступные endpoints

Локальный сервер (http://localhost:3002):

- `GET /api/v1/status` - статус сервера
- `GET /api/v1/blocks` - данные блоков
- `GET /health` - проверка здоровья сервера

## ✅ Проверка работы

```bash
# Проверка локального сервера
curl http://localhost:3002/health

# Проверка React приложения
curl http://localhost:3000
```

## 🎯 Результат

Теперь приложение должно работать без ошибок:

- React приложение на http://localhost:3000
- Локальный API сервер на http://localhost:3002
- Node 4 будет показывать данные без CORS ошибок
