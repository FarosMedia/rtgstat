#!/bin/bash

# 🚀 Скрипт автоматического развертывания TGStat Анализатора

echo "🚀 Начинаем развертывание TGStat Анализатора..."

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js версии 16+"
    exit 1
fi

# Проверка версии Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Требуется Node.js версии 16+. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версии $(node -v) найден"

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

echo "✅ npm найден"

# Установка зависимостей
echo "📦 Устанавливаем зависимости..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi

echo "✅ Зависимости установлены"

# Проверка наличия всех необходимых файлов
echo "🔍 Проверяем структуру проекта..."

REQUIRED_FILES=(
    "src/App.js"
    "src/index.js"
    "src/index.css"
    "src/components/Sidebar.js"
    "src/components/Header.js"
    "src/context/AppContext.js"
    "src/pages/Dashboard.js"
    "src/pages/Search.js"
    "src/pages/Projects.js"
    "src/pages/Analysis.js"
    "src/pages/Users.js"
    "src/services/tgstatApi.js"
    "public/index.html"
    "package.json"
    "tailwind.config.js"
    "postcss.config.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Файл $file не найден"
        exit 1
    fi
done

echo "✅ Все необходимые файлы найдены"

# Сборка проекта
echo "🔨 Создаем продакшен сборку..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при сборке проекта"
    exit 1
fi

echo "✅ Сборка создана успешно"

# Проверка наличия папки build
if [ ! -d "build" ]; then
    echo "❌ Папка build не создана"
    exit 1
fi

echo "✅ Папка build создана"

# Определение способа развертывания
echo ""
echo "🎯 Выберите способ развертывания:"
echo "1) Локальный сервер (serve)"
echo "2) Nginx"
echo "3) Docker"
echo "4) Только сборка (без запуска)"

read -p "Введите номер (1-4): " choice

case $choice in
    1)
        echo "🚀 Запускаем локальный сервер..."
        if ! command -v serve &> /dev/null; then
            echo "📦 Устанавливаем serve..."
            npm install -g serve
        fi
        echo "🌐 Сервер запущен на http://localhost:3000"
        serve -s build -l 3000
        ;;
    2)
        echo "🔧 Настройка Nginx..."
        if [ ! -d "/var/www/html" ]; then
            echo "❌ Папка /var/www/html не существует. Запустите скрипт с правами sudo"
            exit 1
        fi
        
        echo "📁 Копируем файлы в /var/www/html..."
        sudo cp -r build/* /var/www/html/
        
        echo "⚙️ Создаем конфигурацию Nginx..."
        sudo tee /etc/nginx/sites-available/tgstat-analyzer > /dev/null <<EOF
server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
        
        echo "🔗 Активируем сайт..."
        sudo ln -sf /etc/nginx/sites-available/tgstat-analyzer /etc/nginx/sites-enabled/
        
        echo "✅ Проверяем конфигурацию Nginx..."
        sudo nginx -t
        
        if [ $? -eq 0 ]; then
            echo "🔄 Перезагружаем Nginx..."
            sudo systemctl reload nginx
            echo "✅ TGStat Анализатор доступен на http://localhost"
        else
            echo "❌ Ошибка в конфигурации Nginx"
            exit 1
        fi
        ;;
    3)
        echo "🐳 Настройка Docker..."
        
        # Создание Dockerfile
        echo "📝 Создаем Dockerfile..."
        cat > Dockerfile <<EOF
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
        
        # Создание nginx.conf
        echo "📝 Создаем nginx.conf..."
        cat > nginx.conf <<EOF
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
            try_files \$uri \$uri/ /index.html;
        }
        
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF
        
        echo "🔨 Собираем Docker образ..."
        docker build -t tgstat-analyzer .
        
        if [ $? -eq 0 ]; then
            echo "🚀 Запускаем контейнер..."
            docker run -d -p 80:80 --name tgstat-analyzer-container tgstat-analyzer
            echo "✅ TGStat Анализатор доступен на http://localhost"
        else
            echo "❌ Ошибка при сборке Docker образа"
            exit 1
        fi
        ;;
    4)
        echo "✅ Сборка завершена. Файлы находятся в папке build/"
        echo "📁 Для запуска используйте любой веб-сервер"
        ;;
    *)
        echo "❌ Неверный выбор"
        exit 1
        ;;
esac

echo ""
echo "🎉 Развертывание завершено!"
echo ""
echo "📋 Что дальше:"
echo "1. Откройте браузер и перейдите по указанному URL"
echo "2. Проверьте работу всех функций"
echo "3. Настройте домен и SSL если необходимо"
echo ""
echo "📚 Документация:"
echo "- README.md - обзор проекта"
echo "- USAGE.md - руководство пользователя"
echo "- DEPLOYMENT.md - подробные инструкции по развертыванию"
echo ""
echo "🔧 API ключ уже настроен: a1c2cd559240a5d330d2b4184a16b86f"
echo ""
echo "🚀 Удачного использования TGStat Анализатора!"