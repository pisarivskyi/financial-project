# Financial project

An application to track expanses with Monobank API.

## How to run

1. Install docker and docker compose.
2. Install dependencies:


    npm install


3. Add the following record to `hosts` file:


    127.0.0.1 keycloak


4. Create `.env` file (you can use the content from `.env.example` file for development environment).
5. Build docker image for Dashboard application


      npm run docker:dashboard:build:dev

6. Build docker image for API application


      npm run docker:api:build:dev

7. Run docker compose command:


      docker compose up
