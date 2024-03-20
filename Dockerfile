# Common build stage
FROM node:16.18.1-alpine3.17 as common-build-stage

COPY . ./app

WORKDIR /app

RUN npm install

RUN npm run build

COPY config/database.json /etc/secrets/db-config.json
COPY wait-for.sh .
RUN chmod +x wait-for.sh
RUN ls

ARG PORT=4000

EXPOSE $PORT
