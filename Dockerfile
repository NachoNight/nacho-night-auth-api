FROM node:10.16.3-alpine

WORKDIR /app

COPY . .

ENV NODE_ENV=docker

ENV SERVER_PORT=5000

RUN npm install

CMD ["node", "."]