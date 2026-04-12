FROM node:lts-slim

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

ENV DEBUG=kudelma-backend:*

USER node

CMD ["npm", "run", "dev:watch"]