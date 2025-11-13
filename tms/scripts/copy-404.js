import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');
const redirectsSourcePath = path.join(__dirname, '..', '_redirects');
const redirectsDestPath = path.join(distPath, '_redirects');

try {
  // Copy index.html to 404.html for Netlify SPA routing
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('✅ Successfully copied index.html to 404.html');
  } else {
    console.error('❌ index.html not found in dist folder');
    process.exit(1);
  }

  // Copy _redirects file to dist folder for Netlify
  if (fs.existsSync(redirectsSourcePath)) {
    fs.copyFileSync(redirectsSourcePath, redirectsDestPath);
    console.log('✅ Successfully copied _redirects file to dist folder');
  } else {
    // Create _redirects file if it doesn't exist
    fs.writeFileSync(redirectsDestPath, '/*    /index.html   200\n');
    console.log('✅ Created _redirects file in dist folder');
  }
} catch (error) {
  console.error('❌ Error copying files:', error.message);
  process.exit(1);
}
