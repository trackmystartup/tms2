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
  // Try multiple locations
  const redirectsPaths = [
    path.join(__dirname, '..', '_redirects'),
    path.join(__dirname, '..', 'public', '_redirects'),
  ];
  
  let redirectsCopied = false;
  for (const sourcePath of redirectsPaths) {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, redirectsDestPath);
      console.log(`✅ Successfully copied _redirects file from ${path.basename(path.dirname(sourcePath))} to dist folder`);
      redirectsCopied = true;
      break;
    }
  }
  
  if (!redirectsCopied) {
    // Create _redirects file if it doesn't exist
    const redirectsContent = '/*    /index.html   200\n';
    fs.writeFileSync(redirectsDestPath, redirectsContent);
    console.log('✅ Created _redirects file in dist folder');
  }
  
  // Verify _redirects file exists and has correct content
  if (fs.existsSync(redirectsDestPath)) {
    const content = fs.readFileSync(redirectsDestPath, 'utf8');
    if (!content.includes('/index.html')) {
      console.warn('⚠️  _redirects file exists but may have incorrect content');
    } else {
      console.log('✅ Verified _redirects file content is correct');
    }
  }
} catch (error) {
  console.error('❌ Error copying files:', error.message);
  process.exit(1);
}
