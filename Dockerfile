# Stage 1 — Build the Vite app
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project including .env
COPY . .

# Make sure .env is available at build time
# Vite automatically picks up VITE_* variables from it
RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy built files
COPY --from=builder /app/dist ./

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
