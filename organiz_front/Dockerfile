ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-bookworm AS base

WORKDIR /usr/src/app

FROM base AS deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps AS build

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

FROM nginx:latest

COPY --from=build /usr/src/app/dist ./usr/share/nginx/html/
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

#CMD ["tail", "-f", "/dev/null"]
ENTRYPOINT ["nginx", "-g", "daemon off;"]
