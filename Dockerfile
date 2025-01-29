FROM node:22.13.0 AS base

# some dependencies

FROM base AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM base AS build

WORKDIR /app

COPY . .
COPY  --from=dependencies /app/node_modules ./node_modules

RUN npm run build
RUN npm prune --prod

FROM gcr.io/distroless/nodejs20-debian12 AS deploy

USER 1000

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json


EXPOSE 3333

CMD ["dist/infra/http/server.js"]