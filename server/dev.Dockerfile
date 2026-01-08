FROM node:lts-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

ENV DEBUG=kudelma-backend:*

USER node

CMD ["npm", "run", "dev:watch"]