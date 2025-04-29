# --- Development Stage ---
# Use a Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# If using yarn: COPY yarn.lock ./

# Install dependencies
# Don't use --frozen-lockfile here, dev dependencies might change frequently
RUN npm install
# If using yarn: RUN yarn install

# The rest of the application code will be mounted as a volume
# We don't COPY the whole app here because we'll mount it later

# Expose the default Vite dev server port (check your vite.config.js if you changed it)
EXPOSE 5173

# Command to run the development server
# This should match your "dev" script in package.json

# If using yarn: CMD ["yarn", "dev"]


# # --- Stage 1: Build the React App ---
# FROM node:20-alpine as builder

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json (or yarn.lock/pnpm-lock.yaml)
# COPY package*.json ./

# # Install dependencies
# RUN npm install 
# # Or yarn install or pnpm install

# # Copy source code
# COPY . .

# # Declare the build argument for the API URL
# ARG VITE_API_URL

# # Set the build argument as an environment variable for the build process
# # Vite will pick up VITE_* variables available during the build command
# ENV VITE_API_URL=http://127.0.0.1:5000

# # Build the app
# # The Vite build command automatically uses environment variables prefixed with VITE_
# RUN npm run build

# # --- Stage 2: Serve the App with Nginx ---
# FROM nginx:alpine

# # Copy the custom nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Copy the built React app from the builder stage to the Nginx html directory
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Expose port 80 (default for Nginx)
# EXPOSE 80

# # Command to run Nginx
# CMD ["nginx", "-g", "daemon off;"]