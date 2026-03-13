FROM node:20-alpine

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Rebuild native modules
RUN npm install

# Copy rest of code
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
