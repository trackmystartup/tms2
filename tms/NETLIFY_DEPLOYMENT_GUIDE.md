# 🚀 Netlify Deployment Guide

Complete guide for deploying your Track My Startup application to Netlify.

## 📋 Prerequisites

- [ ] GitHub repository with your code
- [ ] Netlify account (free tier works)
- [ ] Supabase project credentials
- [ ] Razorpay keys (if using payments)

## 🔧 Step 1: Prepare Your Repository

### **1.1 Ensure All Files Are Committed**

```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

### **1.2 Verify Configuration Files**

Make sure these files exist in your repository:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `package.json` - Dependencies and build scripts
- ✅ `vite.config.ts` - Vite configuration
- ✅ `404.html` - For SPA routing

## 🌐 Step 2: Connect Repository to Netlify

### **Option A: Deploy via Netlify Dashboard (Recommended)**

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign in or create a free account

2. **Add New Site**
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub** (or GitLab/Bitbucket)

3. **Authorize Netlify**
   - Grant Netlify access to your GitHub repositories
   - Select the repository: `trackmystartup/tms2`

4. **Configure Build Settings**
   - Netlify will auto-detect settings from `netlify.toml`
   - Verify these settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Node version:** `18` (or higher)

5. **Click "Deploy site"**
   - Netlify will start the first deployment
   - This may take 3-5 minutes

### **Option B: Deploy via Netlify CLI**

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site (first time only)
netlify init

# Deploy
netlify deploy --prod
```

## 🔑 Step 3: Configure Environment Variables

### **3.1 Go to Site Settings**

1. In Netlify Dashboard, go to your site
2. Click **Site settings** → **Environment variables**
3. Click **Add a variable**

### **3.2 Add Required Variables**

Add these essential variables:

**Variable 1: Supabase URL**
```
Key: VITE_SUPABASE_URL
Value: https://dlesebbmlrewsbmqvuza.supabase.co
Scopes: ✅ All scopes (Production, Deploy previews, Branch deploys)
```

**Variable 2: Supabase Anon Key**
```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsZXNlYmJtbHJld3NibXF2dXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTMxMTcsImV4cCI6MjA3MDEyOTExN30.zFTVSgL5QpVqEDc-nQuKbaG_3egHZEm-V17UvkOpFCQ
Scopes: ✅ All scopes
```

**Variable 3: Razorpay Key ID (if using payments)**
```
Key: VITE_RAZORPAY_KEY_ID
Value: rzp_test_... or rzp_live_...
Scopes: ✅ All scopes
```

**Variable 4: Razorpay Key Secret (if using payments)**
```
Key: VITE_RAZORPAY_KEY_SECRET
Value: your_razorpay_secret
Scopes: ✅ All scopes
```

**Variable 5: Razorpay Environment (if using payments)**
```
Key: VITE_RAZORPAY_ENVIRONMENT
Value: test or live
Scopes: ✅ All scopes
```

### **3.3 Redeploy After Adding Variables**

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

## 🌍 Step 4: Configure Custom Domain (Optional)

### **4.1 Add Domain in Netlify**

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `trackmystartup.com`)
4. Follow Netlify's DNS instructions

### **4.2 Configure DNS**

Add these DNS records at your domain provider:

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: @ (or www)
Value: [your-site-name].netlify.app
TTL: 3600
```

**Option B: A Records**
```
Type: A
Name: @
Value: [Netlify IP addresses - provided by Netlify]
TTL: 3600
```

### **4.3 Update Supabase Redirect URLs**

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   - `https://yourdomain.com/complete-registration`
   - `https://yourdomain.com/reset-password`
   - `https://yourdomain.com/auth/callback`
3. Update **Site URL** to: `https://yourdomain.com`

## ✅ Step 5: Verify Deployment

### **5.1 Check Deployment Status**

1. Go to **Deploys** tab
2. Check if deployment is **Published** (green)
3. Click on deployment to see build logs

### **5.2 Test Your Application**

1. **Visit your site**
   - Netlify URL: `https://[your-site-name].netlify.app`
   - Or custom domain if configured

2. **Test Key Features**
   - [ ] Homepage loads
   - [ ] User registration works
   - [ ] Login works
   - [ ] Supabase connection successful (check browser console)
   - [ ] No 404 errors
   - [ ] Payment flow works (if applicable)

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors
   - Verify Supabase connections are successful

## 🔍 Troubleshooting

### **Issue 1: Build Fails**

**Check:**
- Build logs in Netlify dashboard
- Node version (should be 18+)
- All dependencies installed correctly

**Solution:**
```bash
# Test build locally first
npm run build
```

### **Issue 2: 404 Errors on Routes**

**Solution:**
- Verify `netlify.toml` has redirect rules
- Ensure `404.html` exists in `dist` folder
- Check redirect configuration in Netlify dashboard

### **Issue 3: Environment Variables Not Working**

**Solution:**
- Verify variable names start with `VITE_`
- Check all scopes are selected
- Redeploy after adding variables
- Clear browser cache

### **Issue 4: Supabase Connection Fails**

**Solution:**
- Verify `VITE_SUPABASE_URL` is correct
- Verify `VITE_SUPABASE_ANON_KEY` is correct
- Check Supabase project is active
- Verify redirect URLs in Supabase dashboard

## 📊 Step 6: Enable Netlify Features (Optional)

### **6.1 Netlify Analytics**

1. Go to **Site settings** → **Analytics**
2. Enable **Netlify Analytics** (paid feature)
3. Or use **Plausible** or **Google Analytics** (free)

### **6.2 Form Handling**

If you have contact forms:
1. Netlify automatically handles form submissions
2. Go to **Forms** tab to see submissions
3. Configure email notifications

### **6.3 Branch Deploys**

Netlify automatically creates preview deployments for:
- Pull requests
- Feature branches
- Each has its own URL for testing

## 🔄 Step 7: Continuous Deployment

Netlify automatically deploys when you:
- Push to `main` branch → Production deployment
- Create pull request → Preview deployment
- Push to other branches → Branch deployment

**No manual deployment needed!**

## 📝 Environment Variables Reference

### **Required Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGci...` |

### **Optional Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_xxx` |
| `VITE_RAZORPAY_KEY_SECRET` | Razorpay Secret | `xxx` |
| `VITE_RAZORPAY_ENVIRONMENT` | Payment environment | `test` or `live` |

## 🎯 Quick Checklist

- [ ] Repository connected to Netlify
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Custom domain configured (if needed)
- [ ] Supabase redirect URLs updated
- [ ] Application tested and working
- [ ] No console errors
- [ ] All features functional

## 🆘 Need Help?

- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Netlify Support:** [support.netlify.com](https://support.netlify.com)
- **Check Build Logs:** Go to Deploys → Click on deployment → View logs

---

**Congratulations!** Your application is now deployed on Netlify! 🎉

