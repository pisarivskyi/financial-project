FROM node:18.17.1
WORKDIR /app

# copy app deps and app build
COPY ./dist/apps/api .
COPY package.json package.json
COPY package-lock.json package-lock.json

# copying some files to be able to run migrations and seeds scripts\
# copying them with saving original folder hierarchy
COPY tsconfig.base.json ./tsconfig.base.json
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY apps/api/tsconfig.app.json ./apps/api/tsconfig.app.json

COPY apps/api/src/migrations ./apps/api/src/migrations
COPY apps/api/src/scripts ./apps/api/src/scripts
COPY apps/api/src/seeds ./apps/api/src/seeds
COPY apps/api/src/app/configs ./apps/api/src/app/configs

# install dependencies
RUN npm ci --ignore-scripts

# run application
CMD [ "node", "main.js" ]
