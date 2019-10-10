FROM node:10.16.3-alpine

WORKDIR /app

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install

ENV DB_URL=postgres://user:pass@postgres:5432/db

ENV DB_USER=user

ENV DB_PASSWORD=pass

ENV DB_NAME=db

ENV DB_DIALECT=postgres

ENV DB_PORT=5432

ENV NODE_ENV=container

ENV SERVER_PORT=3000

COPY . .

EXPOSE 3000

CMD npm start