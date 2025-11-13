# Deployment Guide

## Issue Fixed: Pages Not Found Error

This project was experiencing "pages not found" errors when deployed due to Single Page Application (SPA) routing issues.

## Solution Implemented

### 1. Created 404.html File
- Added `404.html` in the root directory
- This file contains the same content as `index.html`
- The hosting platform will serve this file for any 404 errors, allowing React routing to handle the navigation

### 2. Updated Vite Configuration
- Modified `vite.config.ts` to include proper build settings
- Added base path configuration
- Optimized build output settings

### 3. Updated Build Script
- Modified `package.json` to automatically copy `404.html` to the dist folder during build
- Build command now runs: `vite build && node scripts/copy-404.js`
- Uses cross-platform Node.js script instead of Windows-specific `copy` command

## Deployment Steps

### Option 1: Manual Deployment
1. Run `npm run build`
2. Upload the `dist` folder contents to your hosting platform
3. Configure your hosting platform to serve the static files
4. Set up proper routing to handle SPA navigation

### Option 2: Automated Deployment
1. Configure your CI/CD pipeline
2. Set up automated build and deployment
3. The workflow will automatically build and deploy your site

## Important Notes

- Update the `base` path in `vite.config.ts` if needed for your hosting setup
- Change `base: '/'` to match your deployment path if required
- The 404.html file ensures all routes work correctly when accessed directly

## Testing

After deployment, test these URLs directly:
- `yoursite.com/privacy-policy`
- `yoursite.com/about`
- `yoursite.com/contact`
- `yoursite.com/terms-conditions`

All should now work correctly instead of showing 404 errors.
