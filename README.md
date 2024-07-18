# Financial project

## Description

An application for analysing, reviewing and tracking expanses. It supports data synchronization with Monobank via [Monobank open API](https://api.monobank.ua/docs/index.html) to obtain client's data about its cards and expanse records.

## Features

- Synchronization with Monobank account (done)
- Expanse categorization based on MMC codes (done)
- Create planned payments calendar to track such payments (done)
- Set budget limit for a set of categories (partly introduced)
- Analytics page (partly introduced)
- Budget builder (partly introduced)

## Requirements

- Node.js v18.17.1
- Docker and Docker compose
- API key of your [Monobank account](https://api.monobank.ua/index.html)

## Run locally

### With Docker compose

1. Install docker and docker compose.
2. Install dependencies:

```shell
npm install
```

3. Add the following record to `hosts` file:

```text
127.0.0.1 keycloak
```


4. Create `.env` file (you can use the content from `.env.example` file for development environment).
5. Build docker image for Dashboard application

```shell
npm run docker:dashboard:build:dev
```

6. Build docker image for API application

```shell
npm run docker:api:build:dev
```

7. Run docker compose command:

```shell
docker compose up
```
