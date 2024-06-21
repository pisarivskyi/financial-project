# Financial project

An application for tracking expanses and building budget plans. It uses [Monobank open API](https://api.monobank.ua/docs/index.html) to obtain client's data.

## Run locally

### With Docker compose

1. Install docker and docker compose.
2. Install dependencies:

```sh
npm install
```

3. Add the following record to `hosts` file:


    127.0.0.1 keycloak


4. Create `.env` file (you can use the content from `.env.example` file for development environment).
5. Build docker image for Dashboard application


      npm run docker:dashboard:build:dev

6. Build docker image for API application


      npm run docker:api:build:dev

7. Run docker compose command:


      docker compose up
