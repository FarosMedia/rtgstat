# Инструкция по развертыванию TGStat Анализатора

## 🚀 Быстрый старт

### 1. Локальная разработка

```bash
# Клонирование репозитория
git clone <repository-url>
cd tgstat-analyzer

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

### 2. Сборка для продакшена

```bash
# Создание оптимизированной сборки
npm run build

# Сборка будет создана в папке build/
```

### 3. Развертывание на сервере

#### Вариант 1: Статический хостинг (рекомендуется)

```bash
# Скопируйте содержимое папки build/ на ваш веб-сервер
# Например, для nginx:
sudo cp -r build/* /var/www/html/

# Или для Apache:
sudo cp -r build/* /var/www/html/
```

#### Вариант 2: Docker

Создайте `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Создайте `nginx.conf`:

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

Сборка и запуск Docker контейнера:

```bash
# Сборка образа
docker build -t tgstat-analyzer .

# Запуск контейнера
docker run -p 80:80 tgstat-analyzer
```

#### Вариант 3: Vercel/Netlify

1. Подключите ваш репозиторий к Vercel или Netlify
2. Укажите папку `build` как папку для развертывания
3. Настройте переменные окружения если необходимо

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
REACT_APP_TGSTAT_API_TOKEN=a1c2cd559240a5d330d2b4184a16b86f
REACT_APP_API_BASE_URL=https://api.tgstat.ru
REACT_APP_APP_NAME=TGStat Анализатор
```

### Настройка API

В файле `src/services/tgstatApi.js` измените API ключ на ваш:

```javascript
const API_TOKEN = process.env.REACT_APP_TGSTAT_API_TOKEN || 'your-api-token-here';
```

## 📊 Мониторинг и логирование

### Логирование ошибок

Добавьте в `src/index.js`:

```javascript
// Логирование ошибок в продакшене
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
    // Отправка в сервис мониторинга (Sentry, LogRocket и т.д.)
  });
}
```

### Аналитика

Добавьте Google Analytics или Yandex.Metrika:

```javascript
// В public/index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Безопасность

### HTTPS

Обязательно используйте HTTPS в продакшене:

```nginx
# nginx.conf
server {
    listen 443 ssl;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    # ... остальные настройки
}
```

### Заголовки безопасности

Добавьте в nginx.conf:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## 📈 Масштабирование

### Кэширование

Настройте кэширование статических файлов:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN

Используйте CDN для статических файлов:

```javascript
// В package.json добавьте homepage
{
  "homepage": "https://your-cdn.com",
  // ...
}
```

## 🔄 Обновления

### Автоматические обновления

Настройте CI/CD pipeline:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.4
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/tgstat-analyzer
            git pull
            npm ci
            npm run build
            sudo systemctl reload nginx
```

## 🐛 Отладка

### Логи разработки

```bash
# Просмотр логов в режиме разработки
npm start

# Просмотр логов сборки
npm run build
```

### Проверка производительности

```bash
# Анализ размера бандла
npm run build
npx serve -s build
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте консоль браузера на наличие ошибок
2. Убедитесь, что API ключ TGStat корректный
3. Проверьте настройки CORS на сервере
4. Обратитесь к документации React и TGStat API

---

**TGStat Анализатор** готов к развертыванию! 🚀