# 🚀 Vercel Environment Variables Setup Guide

## 🎯 Why You're Getting 404 Errors

**Yes, the 404 errors are likely because environment variables are not configured in Vercel!**

When you deploy to Vercel, your local `.env.local` file is **NOT** automatically uploaded. You must configure environment variables in the Vercel Dashboard.

## 📋 Required Environment Variables

Your project needs these environment variables to work properly:

### **Essential (Required for App to Work)**

1. **VITE_SUPABASE_URL** - Your Supabase project URL
2. **VITE_SUPABASE_ANON_KEY** - Your Supabase anonymous/public key

### **Optional (For Payment Features)**

3. **VITE_RAZORPAY_KEY_ID** - Razorpay Key ID
4. **VITE_RAZORPAY_KEY_SECRET** - Razorpay Key Secret (server-side only)
5. **VITE_RAZORPAY_ENVIRONMENT** - `test` or `live`

## 🔧 Step-by-Step Setup

### **Step 1: Get Your Environment Variable Values**

#### **A. Supabase Variables**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon/public key** → This is your `VITE_SUPABASE_ANON_KEY`

#### **B. Razorpay Variables (if using payments)**

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Copy:
   - **Key ID** → `VITE_RAZORPAY_KEY_ID`
   - **Key Secret** → `VITE_RAZORPAY_KEY_SECRET` (keep this secret!)

### **Step 2: Add Environment Variables in Vercel**

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in to your account

2. **Select Your Project**
   - Find and click on your project name

3. **Go to Settings**
   - Click on **Settings** tab in the project dashboard

4. **Navigate to Environment Variables**
   - Click on **Environment Variables** in the left sidebar

5. **Add Each Variable**

   Click **Add New** and add each variable:

   **Variable 1:**
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://dlesebbmlrewsbmqvuza.supabase.co` (your Supabase URL)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

   **Variable 2:**
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your Supabase anon key)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

   **Variable 3 (If using Razorpay):**
   - **Key:** `VITE_RAZORPAY_KEY_ID`
   - **Value:** `rzp_test_...` or `rzp_live_...` (your Razorpay Key ID)
   - **Environment:** Select all
   - Click **Save**

   **Variable 4 (If using Razorpay):**
   - **Key:** `VITE_RAZORPAY_KEY_SECRET`
   - **Value:** Your Razorpay Key Secret
   - **Environment:** Select all
   - Click **Save**

   **Variable 5 (If using Razorpay):**
   - **Key:** `VITE_RAZORPAY_ENVIRONMENT`
   - **Value:** `test` or `live`
   - **Environment:** Select all
   - Click **Save**

### **Step 3: Redeploy Your Application**

After adding environment variables, you **MUST** redeploy:

1. **Option 1: Automatic Redeploy**
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on your latest deployment
   - Click **Redeploy**
   - ✅ Environment variables will be included

2. **Option 2: Trigger New Deployment**
   - Make a small change to your code (add a comment)
   - Push to GitHub
   - Vercel will automatically deploy with new environment variables

### **Step 4: Verify Environment Variables**

After redeployment, verify the variables are loaded:

1. **Check Vercel Build Logs**
   - Go to **Deployments** → Click on latest deployment
   - Check **Build Logs** - should not show errors about missing env vars

2. **Test Your Application**
   - Visit your Vercel URL
   - Open browser console (F12)
   - Check for any 404 errors
   - Try logging in/using features

3. **Debug in Browser Console**
   Add this temporarily to check if env vars are loaded:
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
   ```

## 🔍 Troubleshooting

### **Issue 1: Still Getting 404 Errors After Setup**

**Possible Causes:**
- Environment variables not saved correctly
- Application not redeployed after adding variables
- Wrong variable names (must be exactly `VITE_SUPABASE_URL`, not `SUPABASE_URL`)

**Solution:**
1. Double-check variable names (case-sensitive!)
2. Ensure variables are added to **all environments** (Production, Preview, Development)
3. Redeploy the application
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### **Issue 2: Variables Show as Undefined**

**Solution:**
- Variables must start with `VITE_` prefix for Vite to expose them
- After adding variables, **always redeploy**
- Check Vercel build logs for any errors

### **Issue 3: Different Values for Different Environments**

**Solution:**
- You can set different values for Production, Preview, and Development
- Click on each environment when adding the variable
- Set appropriate values (e.g., test keys for Preview, live keys for Production)

## 📝 Quick Checklist

- [ ] Added `VITE_SUPABASE_URL` in Vercel
- [ ] Added `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Added `VITE_RAZORPAY_KEY_ID` (if using payments)
- [ ] Added `VITE_RAZORPAY_KEY_SECRET` (if using payments)
- [ ] Added `VITE_RAZORPAY_ENVIRONMENT` (if using payments)
- [ ] Selected all environments (Production, Preview, Development) for each variable
- [ ] Redeployed the application
- [ ] Verified no 404 errors in browser console
- [ ] Tested login/authentication
- [ ] Tested main features

## 🎯 Expected Values (Based on Your Code)

Based on your `config/environment.ts` file, you should use:

```env
VITE_SUPABASE_URL=https://dlesebbmlrewsbmqvuza.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZXNlYmJtbHJld3NibXF2dXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTMxMTcsImV4cCI6MjA3MDEyOTExN30.zFTVSgL5QpVqEDc-nQuKbaG_3egHZEm-V17UvkOpFCQ
```

**Note:** If you have different Supabase credentials, use those instead.

## 🚨 Security Notes

- **Never commit** `.env.local` to Git (it's already in `.gitignore`)
- **Never share** your environment variable values publicly
- Use **test keys** for Preview/Development environments
- Use **live keys** only for Production environment
- Rotate keys if they're accidentally exposed

## ✅ After Setup

Once environment variables are configured and the app is redeployed:

1. ✅ 404 errors should disappear
2. ✅ Supabase connection should work
3. ✅ Authentication should work
4. ✅ All features should function normally

If you still see errors after following this guide, check:
- Vercel deployment logs
- Browser console for specific error messages
- Supabase dashboard for API errors

