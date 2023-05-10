FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package.json
RUN yarn install
COPY . .
RUN yarn build
CMD yarn start