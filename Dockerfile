FROM node:18-alpine AS base

# Set environment variable for the template to use
ARG REACT_APP_DOODLE_SERVER_URL
ENV REACT_APP_DOODLE_SERVER_URL=${REACT_APP_DOODLE_SERVER_URL}

# Set the working directory
WORKDIR /app

# Copy dependencies to current directory and install
COPY package*.json ./
RUN npm install

# Copy the remaining app and build
COPY . .
RUN npm run build:production

# Server with NGINX
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html

# Copy build output to nginx folder
COPY --from=base /app/build /usr/share/nginx/html

# Copy the nginx template
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template

# Use envsubst to generate the real nginx.conf from the template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 80

# Start using custom entrypoint
ENTRYPOINT ["/entrypoint.sh"]