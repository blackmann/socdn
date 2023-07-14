FROM node:16-alpine AS build

ARG api_url
ENV VITE_API_URL=${api_url}
COPY . .

RUN yarn --frozen-lockfile
RUN yarn build:client
RUN yarn build:server

FROM node:16-alpine

WORKDIR /app
COPY --from=build server/dist/index.js .
COPY --from=build package.json .
COPY --from=build client/dist ./admin

CMD ["node", "index.js"]
