# Build stage
FROM node:alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

#RUN chmod -R 755 /app/node_modules

#RUN ls -la /app/node_modules/.bin

# Build the React app
RUN npm run build --force

# Serve stage
FROM nginx:alpine

# Copy the custom nginx.conf file to the container
COPY default.conf /etc/nginx/nginx.conf

# Copy the built React app from the build stage to the nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
