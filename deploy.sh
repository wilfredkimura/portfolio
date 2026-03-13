#!/bin/bash
echo "🚀 Syncing with GitHub..."
cd ~/kimurasite
git pull origin master

echo "📦 Rebuilding Containers..."
docker compose up -d --build

echo "✅ Portfolio is now in sync!"
