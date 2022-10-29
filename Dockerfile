# Node version
FROM node:16.0.0

WORKDIR /app

COPY . /app

RUN yarn install
RUN yarn build

COPY dist app

EXPOSE 3000

CMD yarn start
