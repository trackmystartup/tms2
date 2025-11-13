# ⚡ Quick Fix: Vercel 404 Errors

## 🎯 The Problem

You're getting 404 errors on Vercel because **environment variables are not configured**. Even though your code has hardcoded values in `config/environment.ts`, Vercel needs the environment variables set for the build process.

## ✅ Quick Solution (5 Minutes)

### **Step 1: Go to Vercel Dashboard**
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project

### **Step 2: Add Environment Variables**
1. Go to **Settings** → **Environment Variables**
2. Add these two variables:

**Variable 1:**
```
Key: VITE_SUPABASE_URL
Value: https://dlesebbmlrewsbmqvuza.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2:**
```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZXNlYmJtbHJld3NibXF2dXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTMxMTcsImV4cCI6MjA3MDEyOTExN30.zFTVSgL5QpVqEDc-nQuKbaG_3egHZEm-V17UvkOpFCQ
Environments: ✅ Production ✅ Preview ✅ Development
```

### **Step 3: Redeploy**
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**

### **Step 4: Test**
- Wait for deployment to complete
- Visit your Vercel URL
- Check if 404 errors are gone

## 🔍 How to Verify It's Fixed

1. **Check Browser Console (F12)**
   - Should NOT see 404 errors
   - Should see successful Supabase connections

2. **Test Login**
   - Try logging in
   - Should connect to Supabase successfully

3. **Check Network Tab**
   - Look for requests to `*.supabase.co`
   - Should return 200 status, not 404

## 📝 If You Have Razorpay

Also add these if you're using payment features:

```
VITE_RAZORPAY_KEY_ID=your_key_id
VITE_RAZORPAY_KEY_SECRET=your_key_secret
VITE_RAZORPAY_ENVIRONMENT=test (or live)
```

## ⚠️ Important Notes

- **Variable names are case-sensitive** - must be exactly `VITE_SUPABASE_URL`
- **Must redeploy** after adding variables
- **Select all environments** (Production, Preview, Development)
- Variables starting with `VITE_` are exposed to the browser

## 🆘 Still Getting Errors?

1. **Double-check variable names** - must match exactly
2. **Check Vercel build logs** - look for any errors
3. **Clear browser cache** - Ctrl+Shift+R
4. **Check Supabase dashboard** - ensure project is active

---

**That's it!** After redeploying with these variables, your 404 errors should be resolved. 🎉

