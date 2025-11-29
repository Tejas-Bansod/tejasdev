# Vercel Environment Variables Setup Guide

## Problem
Contact form and login not working on Vercel because environment variables are missing.

## Solution: Add Environment Variables to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add each variable one by one:

**Variable 1:**
- Key: `MONGO_DB_USER`
- Value: `tejasbansod584_db_user`
- Environment: ✓ Production ✓ Preview ✓ Development

**Variable 2:**
- Key: `MONGO_DB_PASSWORD`
- Value: `w9CTgu848Ea7y7g6`
- Environment: ✓ Production ✓ Preview ✓ Development

**Variable 3:**
- Key: `MONGO_DB_URL`
- Value: `mongodb+srv://tejasbansod584_db_user:w9CTgu848Ea7y7g6@cluster0.ahcxjlg.mongodb.net/?appName=Cluster0`
- Environment: ✓ Production ✓ Preview ✓ Development

**Variable 4:**
- Key: `ADMIN_USERNAME`
- Value: `admin`
- Environment: ✓ Production ✓ Preview ✓ Development

**Variable 5:**
- Key: `ADMIN_PASSWORD`
- Value: `Tejas@2024`
- Environment: ✓ Production ✓ Preview ✓ Development

6. Click **Save** after each variable
7. Go to **Deployments** tab
8. Click the **...** menu on your latest deployment
9. Click **Redeploy**
10. Wait for deployment to complete

### Method 2: Using Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add MONGO_DB_USER
# Enter value: tejasbansod584_db_user
# Select: Production, Preview, Development

vercel env add MONGO_DB_PASSWORD
# Enter value: w9CTgu848Ea7y7g6
# Select: Production, Preview, Development

vercel env add MONGO_DB_URL
# Enter value: mongodb+srv://tejasbansod584_db_user:w9CTgu848Ea7y7g6@cluster0.ahcxjlg.mongodb.net/?appName=Cluster0
# Select: Production, Preview, Development

vercel env add ADMIN_USERNAME
# Enter value: admin
# Select: Production, Preview, Development

vercel env add ADMIN_PASSWORD
# Enter value: Tejas@2024
# Select: Production, Preview, Development

# Redeploy
vercel --prod
```

## Verification

After adding environment variables and redeploying:

1. Test contact form at: `https://your-domain.vercel.app/contact`
2. Test admin login at: `https://your-domain.vercel.app/contacts-data`
   - Username: `admin`
   - Password: `Tejas@2024`

## Troubleshooting

If it still doesn't work:

1. Check Vercel deployment logs for errors
2. Verify all 5 environment variables are added
3. Make sure you redeployed after adding variables
4. Check MongoDB Atlas:
   - Network Access: Add `0.0.0.0/0` to allow all IPs
   - Database User: Verify credentials are correct

## Important Notes

- Environment variables are NOT automatically deployed
- You MUST redeploy after adding/changing env vars
- `.env` files are NOT uploaded to Vercel (they're in `.gitignore`)
- Each environment variable must be added separately in Vercel dashboard
