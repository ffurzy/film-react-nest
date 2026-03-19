FROM node:20-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN rm -f package-lock.json && \
    npm install && \
    npm install rollup@3.29.4 --save-dev
COPY frontend/ .
RUN npm run build
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]