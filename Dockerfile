FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

ARG NODE_ENV=production

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
