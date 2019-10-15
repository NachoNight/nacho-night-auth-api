FROM node:10.16.3-alpine

WORKDIR /app

COPY ./package.json .

COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD npm start