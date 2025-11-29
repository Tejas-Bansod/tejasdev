#!/bin/bash

# Add environment variables to Vercel
echo "Adding environment variables to Vercel..."

# MONGO_DB_USER
echo "tejasbansod584_db_user" | vercel env add MONGO_DB_USER production
echo "tejasbansod584_db_user" | vercel env add MONGO_DB_USER preview
echo "tejasbansod584_db_user" | vercel env add MONGO_DB_USER development

# MONGO_DB_PASSWORD
echo "w9CTgu848Ea7y7g6" | vercel env add MONGO_DB_PASSWORD production
echo "w9CTgu848Ea7y7g6" | vercel env add MONGO_DB_PASSWORD preview
echo "w9CTgu848Ea7y7g6" | vercel env add MONGO_DB_PASSWORD development

# MONGO_DB_URL
echo "mongodb+srv://tejasbansod584_db_user:w9CTgu848Ea7y7g6@cluster0.ahcxjlg.mongodb.net/?appName=Cluster0" | vercel env add MONGO_DB_URL production
echo "mongodb+srv://tejasbansod584_db_user:w9CTgu848Ea7y7g6@cluster0.ahcxjlg.mongodb.net/?appName=Cluster0" | vercel env add MONGO_DB_URL preview
echo "mongodb+srv://tejasbansod584_db_user:w9CTgu848Ea7y7g6@cluster0.ahcxjlg.mongodb.net/?appName=Cluster0" | vercel env add MONGO_DB_URL development

# ADMIN_USERNAME
echo "admin" | vercel env add ADMIN_USERNAME production
echo "admin" | vercel env add ADMIN_USERNAME preview
echo "admin" | vercel env add ADMIN_USERNAME development

# ADMIN_PASSWORD
echo "Tejas@2024" | vercel env add ADMIN_PASSWORD production
echo "Tejas@2024" | vercel env add ADMIN_PASSWORD preview
echo "Tejas@2024" | vercel env add ADMIN_PASSWORD development

echo "✅ All environment variables added!"
echo "Now run: vercel --prod"
