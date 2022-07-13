FROM node:16.16.0 AS builder

WORKDIR /app

COPY ./.yarnrc.yml ./package.json ./yarn.lock ./

COPY ./.yarn ./.yarn

RUN yarn install

ENV NODE_ENV=production

COPY ./ ./

RUN yarn run build

FROM nginx:1.23.0-alpine as runner

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
