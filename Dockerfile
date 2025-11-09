# ---------- Stage 1: Build the Vite app ----------
    FROM node:22-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy dependency files first for better caching
    COPY package*.json ./
    
    # Install dependencies
    RUN npm ci
    
    # Copy the rest of the app (including .env)
    COPY . .
    
    # Ensure .env is included so Vite can use it during build
    # Vite automatically reads all variables prefixed with VITE_
    RUN npm run build
    
    
    # ---------- Stage 2: Serve with Nginx ----------
    FROM nginx:alpine
    
    # Set working directory for nginx
    WORKDIR /usr/share/nginx/html
    
    # Copy built assets from the builder stage
    COPY --from=builder /app/dist ./
    
    # Optional: Custom Nginx config for SPA routing and caching
    RUN echo 'server { \
        listen 80; \
        server_name localhost; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files $uri $uri/ /index.html; \
        } \
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ { \
            expires 1y; \
            add_header Cache-Control "public, immutable"; \
        } \
    }' > /etc/nginx/conf.d/default.conf
    
    # Expose port 80 for the frontend
    EXPOSE 80
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    