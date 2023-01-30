FROM node:16.10.0-slim

WORKDIR /app

COPY ./main.js /app

RUN node main.js

# Node version
# FROM node:16.10.0-slim as builder

# WORKDIR /app

# COPY . /app

# RUN yarn install
# RUN yarn build


# FROM node:16.10.0-slim as release

# WORKDIR /app

# COPY ./dist /app/dist/
# COPY ./package.json ./.env /app/

# RUN yarn install

# EXPOSE 3000

# CMD yarn start:prod
