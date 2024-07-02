# Use the official Node.js image as a base
FROM node:lts

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Add additional options to Dockerfile
CMD ["yarn", "run", "dev"]

