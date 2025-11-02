# ---------- 1️⃣ BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

RUN npm run db:push
# Build TypeScript to JavaScript
RUN npm run build


# ---------- 2️⃣ RUN STAGE ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the built output and production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built JS files from builder stage
COPY --from=builder /app/dist ./dist

#copy necessary files
COPY --from=builder /app/src/firebase/serviceAccountKey.json ./src/firebase/serviceAccountKey.json

EXPOSE 5000

# Start the app
CMD ["node", "dist/app.js"]
