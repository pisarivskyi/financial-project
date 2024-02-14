# BUILD
FROM node:18.17.1-alpine as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ../package.json /usr/src/app/package.json
COPY ../package-lock.json /usr/src/app/package-lock.json
COPY . /usr/src/app

RUN npm ci --ignore-scripts

RUN nx build dashboard --configuration=production

# RUN CADDY
FROM caddy:2.7.6-alpine
COPY ../apps/dashboard/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/src/app/dist/apps/dashboard /srv
