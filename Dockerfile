# Node version
FROM node:16.10.0 as builder

WORKDIR /app

COPY . /app

RUN yarn install
RUN yarn build


FROM node:16.10.0 as release
WORKDIR /app
COPY ./dist ./package.json /app/

EXPOSE 3000

CMD yarn start
