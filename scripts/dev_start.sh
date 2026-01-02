#!/bin/bash

# Start Docker Compose for development
echo "🐳 Starting Docker containers for development!"
docker-compose -f docker-compose.dev.yaml up -d

echo "📂 Running database migrations"
docker-compose -f docker-compose.dev.yaml exec server npx prisma migrate dev

echo "✅ Development environment is up and running!"
