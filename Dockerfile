FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run lint
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/server-seo-audit.mjs ./server-seo-audit.mjs
COPY --from=build /app/privacy-consent.mjs ./privacy-consent.mjs
COPY --from=build /app/server-commerce.mjs ./server-commerce.mjs
COPY --from=build /app/node_modules/stripe ./node_modules/stripe
COPY --from=build /app/server-site-seo.mjs ./server-site-seo.mjs
COPY --from=build /app/public-routes.json ./public-routes.json
COPY --from=build /app/site-content.mjs ./site-content.mjs
EXPOSE 8080
CMD ["node", "server.mjs"]
