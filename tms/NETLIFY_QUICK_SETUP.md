# ⚡ Netlify Quick Setup Guide

## 🎯 5-Minute Setup

### **Step 1: Connect to Netlify**

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your repository
4. Click **"Deploy site"**

### **Step 2: Add Environment Variables**

1. Go to **Site settings** → **Environment variables**
2. Add these two variables:

```
VITE_SUPABASE_URL
Value: https://dlesebbmlrewsbmqvuza.supabase.co
Scopes: ✅ All

VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZXNlYmJtbHJld3NibXF2dXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTMxMTcsImV4cCI6MjA3MDEyOTExN30.zFTVSgL5QpVqEDc-nQuKbaG_3egHZEm-V17UvkOpFCQ
Scopes: ✅ All
```

### **Step 3: Redeploy**

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

### **Step 4: Test**

- Visit your Netlify URL: `https://[your-site].netlify.app`
- Check if app loads without errors
- Test login/registration

## ✅ That's It!

Your app is now live on Netlify! 🎉

## 🔧 If You Need Payments

Also add:
- `VITE_RAZORPAY_KEY_ID`
- `VITE_RAZORPAY_KEY_SECRET`
- `VITE_RAZORPAY_ENVIRONMENT`

## 📖 Full Guide

See `NETLIFY_DEPLOYMENT_GUIDE.md` for detailed instructions.

