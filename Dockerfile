FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# 1. Remove any existing husky installation
# 2. Install production dependencies only
# 3. Clean cache
RUN npm uninstall husky && \
    npm install --omit=dev && \
    npm cache clean --force

# Copy the rest of the application
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"]