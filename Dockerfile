FROM node:20-alpine

WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# 3. Copy the rest of your source code
COPY . .

# 4. Build the TypeScript code
RUN npm run build

# 5. Expose your port
EXPOSE 3000

# 6. Run the app (push DB schema, then start)
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]