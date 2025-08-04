# 🚀 Как получить и развернуть TGStat Анализатор

## 📥 Получение кода проекта

### Вариант 1: Скачивание всех файлов

1. **Создайте новую папку для проекта:**
```bash
mkdir tgstat-analyzer
cd tgstat-analyzer
```

2. **Создайте все необходимые файлы и папки:**

#### Структура проекта:
```
tgstat-analyzer/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── Sidebar.js
│   ├── context/
│   │   └── AppContext.js
│   ├── pages/
│   │   ├── Analysis.js
│   │   ├── Dashboard.js
│   │   ├── Projects.js
│   │   ├── Search.js
│   │   └── Users.js
│   ├── services/
│   │   └── tgstatApi.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── USAGE.md
└── DEPLOYMENT.md
```

### Вариант 2: Git репозиторий (рекомендуется)

1. **Создайте новый репозиторий на GitHub/GitLab**
2. **Клонируйте репозиторий:**
```bash
git clone <your-repository-url>
cd tgstat-analyzer
```

## 🛠 Установка и настройка

### 1. Установка зависимостей

```bash
# Установка всех необходимых пакетов
npm install
```

### 2. Проверка установки

```bash
# Проверка, что все зависимости установлены
npm list --depth=0
```

### 3. Запуск в режиме разработки

```bash
# Запуск приложения
npm start
```

Приложение будет доступно по адресу: **http://localhost:3000**

## 🔧 Настройка API

### 1. Проверьте API ключ

В файле `src/services/tgstatApi.js` уже настроен ваш API ключ:
```javascript
const API_TOKEN = 'a1c2cd559240a5d330d2b4184a16b86f';
```

### 2. Тестирование API

Откройте браузер и перейдите в раздел "Поиск". Попробуйте найти каналы по запросу "test" - если API работает, вы увидите результаты.

## 🚀 Развертывание в продакшене

### Вариант 1: Локальный сервер

```bash
# Создание продакшен сборки
npm run build

# Установка простого сервера
npm install -g serve

# Запуск сервера
serve -s build -l 3000
```

### Вариант 2: Nginx (рекомендуется)

1. **Создайте продакшен сборку:**
```bash
npm run build
```

2. **Скопируйте файлы на сервер:**
```bash
sudo cp -r build/* /var/www/html/
```

3. **Настройте Nginx:**
```bash
sudo nano /etc/nginx/sites-available/tgstat-analyzer
```

Добавьте конфигурацию:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. **Активируйте сайт:**
```bash
sudo ln -s /etc/nginx/sites-available/tgstat-analyzer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Вариант 3: Docker

1. **Создайте Dockerfile:**
```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Создайте nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

3. **Соберите и запустите контейнер:**
```bash
docker build -t tgstat-analyzer .
docker run -p 80:80 tgstat-analyzer
```

### Вариант 4: Vercel/Netlify (бесплатно)

1. **Подключите репозиторий к Vercel:**
   - Зайдите на vercel.com
   - Подключите ваш GitHub репозиторий
   - Укажите папку `build` как папку для развертывания

2. **Или используйте Netlify:**
   - Зайдите на netlify.com
   - Подключите репозиторий
   - Укажите команду сборки: `npm run build`
   - Укажите папку публикации: `build`

## 🔍 Проверка работоспособности

### 1. Тестирование функций

После развертывания проверьте:

- ✅ **Главная страница** загружается
- ✅ **Навигация** работает (боковая панель)
- ✅ **Поиск каналов** возвращает результаты
- ✅ **Создание проектов** работает
- ✅ **Управление пользователями** доступно
- ✅ **Аналитика** отображает данные

### 2. Проверка API

В консоли браузера (F12) не должно быть ошибок API.

## 🐛 Решение проблем

### Проблема: "Module not found"
```bash
# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### Проблема: "API errors"
- Проверьте API ключ в `src/services/tgstatApi.js`
- Убедитесь, что у вас есть доступ к TGStat API

### Проблема: "Port already in use"
```bash
# Убейте процесс на порту 3000
lsof -ti:3000 | xargs kill -9
# Или используйте другой порт
npm start -- --port 3001
```

### Проблема: "Build fails"
```bash
# Очистите кэш
npm run build -- --reset-cache
```

## 📱 Доступ к приложению

### Локальная разработка:
- **URL**: http://localhost:3000
- **Пользователь**: Администратор (автоматически)

### Продакшен:
- **URL**: http://your-domain.com
- **SSL**: Рекомендуется настроить HTTPS

## 🔐 Безопасность

### Рекомендации:
1. **Измените API ключ** на ваш собственный
2. **Настройте HTTPS** в продакшене
3. **Ограничьте доступ** к API ключу
4. **Регулярно обновляйте** зависимости

## 📞 Поддержка

Если возникли проблемы:

1. **Проверьте консоль браузера** (F12) на ошибки
2. **Проверьте логи сервера** (если используете)
3. **Убедитесь, что все файлы** скопированы правильно
4. **Проверьте версии Node.js** (рекомендуется 16+)

---

## 🎯 Быстрый старт (краткая версия)

```bash
# 1. Создайте папку и скопируйте все файлы
mkdir tgstat-analyzer && cd tgstat-analyzer

# 2. Установите зависимости
npm install

# 3. Запустите приложение
npm start

# 4. Откройте http://localhost:3000
```

**Готово!** 🚀 Ваш TGStat Анализатор работает!