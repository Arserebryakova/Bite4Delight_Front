# 1) Собираем React-приложение
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем только package-файлы, ставим зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем код и билдим в папку build/
COPY . .
RUN npm run build

# 2) Деплоим с nginx
FROM nginx:stable-alpine

# Удаляем дефолтный конфиг nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем свой конфиг
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Забираем собранную статику из предыдущего этапа
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
