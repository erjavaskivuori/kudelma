FROM node:24-slim AS build

WORKDIR /usr/src/app

COPY ./client/package*.json ./
RUN npm ci

COPY ./client .

ARG VITE_BACKEND_URL=/api
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM nginx:1.29.1-alpine AS production

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
