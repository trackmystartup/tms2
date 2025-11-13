# 🚀 Track My Startup - Netlify Deployment

This project is configured for deployment on **Netlify**.

## 📋 Quick Start

1. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Import this repository
   - Netlify will auto-detect settings

2. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - See `NETLIFY_QUICK_SETUP.md` for details

3. **Deploy**
   - Netlify will automatically deploy on every push to `main`

## 📚 Documentation

- **Quick Setup:** `NETLIFY_QUICK_SETUP.md` - 5-minute setup guide
- **Full Guide:** `NETLIFY_DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- **Migration:** `NETLIFY_MIGRATION_SUMMARY.md` - What changed from Vercel

## 🔧 Configuration Files

- `netlify.toml` - Netlify configuration (build, redirects, headers)
- `vite.config.ts` - Vite build configuration
- `package.json` - Dependencies and scripts

## 🌐 Environment Variables

Required in Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional (for payments):
- `VITE_RAZORPAY_KEY_ID`
- `VITE_RAZORPAY_KEY_SECRET`
- `VITE_RAZORPAY_ENVIRONMENT`

## 🆘 Need Help?

See the documentation files above or check:
- [Netlify Docs](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

