# BUILD
FROM node:18.17.1-alpine as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ../package.json /usr/src/app/package.json
COPY ../package-lock.json /usr/src/app/package-lock.json
COPY . /usr/src/app

RUN npm i --ignore-scripts

RUN nx build api --configuration=development
RUN tsc --project ./apps/api/tsconfig.db-scripts.json
RUN tsc-alias --project ./apps/api/tsconfig.db-scripts.json

# RUN APPLICATION
FROM node:18.17.1-alpine
WORKDIR /app

# copy app deps and app build
COPY --from=builder /usr/src/app/dist/apps/api .
COPY --from=builder /usr/src/app/dist/scripts .
COPY package.json package.json
COPY package-lock.json package-lock.json

# install dependencies
RUN npm ci --ignore-scripts

# run application
CMD [ "node", "main.js" ]

EXPOSE 3200
