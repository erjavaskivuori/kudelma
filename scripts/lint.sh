#!/bin/bash

# Linting script for both client and server
echo "🔍 Running linting for client..."
cd client && npm run lint:fix && cd ..

echo "🔍 Running linting for server..."
cd server && npm run lint:fix