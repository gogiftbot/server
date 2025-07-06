FROM node:20.12.2-slim AS base

RUN apt-get update -y
RUN apt-get install -y openssl

RUN npm install -g pnpm

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY . .

ENV PATH /home/node/app/node_modules/.bin:$PATH
RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate
RUN pnpm build