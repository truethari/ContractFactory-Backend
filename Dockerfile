FROM node:22-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

ARG NODE_ENV=production
ARG DATABASE_URL=$DATABASE_URL

EXPOSE 3000

CMD ["node", "dist/index.js"]
