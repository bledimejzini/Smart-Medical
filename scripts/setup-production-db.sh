#!/bin/bash

echo "🚀 Setting up production database..."

# Pull Vercel environment variables
echo "📥 Pulling environment variables from Vercel..."
vercel env pull .env.production

# Run migrations
echo "🔄 Running database migrations..."
npx dotenv -e .env.production -- npx prisma migrate deploy

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
npx prisma generate

# Seed database
echo "🌱 Seeding database..."
npx dotenv -e .env.production -- npm run db:seed

echo "✅ Production database setup complete!"
echo ""
echo "Admin credentials:"
echo "Email: admin@vitanet.com"
echo "Password: admin123"
