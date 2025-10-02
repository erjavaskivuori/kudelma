# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js and try again."
  exit 1
fi

echo "🚀 Starting project setup..."

echo "📦 Installing root dependencies and initialising Husky..."
npm install

echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

echo "🧼 Making sure there aren't old containers running..."
docker-compose -f docker-compose.dev.yaml down -v

echo "🐳 Building Docker images for development..."
docker-compose -f docker-compose.dev.yaml build

echo "✅ Project setup complete!"