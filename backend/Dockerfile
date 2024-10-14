# backend/Dockerfile

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

# Install Python and necessary libraries
RUN apk add --no-cache python3 py3-pip && \
    pip3 install fpdf pandas

# Clean up to reduce image size
RUN rm -rf /var/cache/apk/*

EXPOSE 3000

CMD ["node", "dist/app.js"]
