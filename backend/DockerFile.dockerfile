# backend/Dockerfile

# Stage 1: Build
FROM node:14 AS builder

WORKDIR /app

COPY package*.json ./ RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:14

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./ RUN npm install --only=production

EXPOSE 5000

CMD ["node", "dist/server.js"]
