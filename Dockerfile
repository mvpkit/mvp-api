FROM node:12.13-buster as development

ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn --dev install
COPY . .

# seperate build for production
FROM node:12.13-alpine as production
ENV NODE_ENV=production
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN yarn install --only=production