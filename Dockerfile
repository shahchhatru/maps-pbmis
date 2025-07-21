# Stage 1: Build React app
FROM node:12 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . ./

# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build folder from previous stage to nginx public folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (we'll define it below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 7333
EXPOSE 7333

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
