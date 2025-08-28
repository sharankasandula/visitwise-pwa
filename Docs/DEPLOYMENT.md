# 🚀 Deploying Visitwise PWA to Netlify

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Firebase Project**: Ensure your Firebase project is configured

## ⚠️ Important Fix Applied

**Issue Resolved**: Your project had Next.js dependencies that were confusing Netlify. I've removed these and configured it properly for Vite + React.

## 🚨 Critical: Next.js Plugin Issue

**Problem**: Netlify is automatically adding the Next.js plugin even though this is a Vite project.

**Solution**: I've created a specific build script and configuration to prevent auto-detection.

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Complete Netlify configuration with Vite-specific build script"
git push origin main
```

### 2. Set Up Environment Variables

Before deploying, you need to set up your Firebase environment variables in Netlify:

1. Go to your Netlify dashboard
2. Navigate to Site Settings > Environment Variables
3. Add the following variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 3. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. **Connect to GitHub**:

   - Log in to Netlify
   - Click "New site from Git"
   - Choose GitHub and authorize Netlify
   - Select your repository

2. **Configure Build Settings**:

   - Build command: `npm run netlify:build` ⚠️ **Use this exact command**
   - Publish directory: `dist`
   - Node version: `18` (or higher)

3. **Deploy**:

   - Click "Deploy site"
   - Wait for build to complete

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:

   ```bash
   netlify login
   ```

3. **Deploy**:

   ```bash
   netlify deploy --prod
   ```

### 4. Configure Custom Domain (Optional)

1. Go to Site Settings > Domain management
2. Add your custom domain
3. Follow DNS configuration instructions

### 5. Verify Deployment

1. Check that your app loads correctly
2. Test PWA functionality (install prompt, offline mode)
3. Verify Firebase authentication works
4. Test all major features

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Firebase authentication works
- [ ] PWA can be installed
- [ ] Offline functionality works
- [ ] All routes function correctly
- [ ] Environment variables are set
- [ ] Custom domain configured (if applicable)

## Troubleshooting

### Common Issues

1. **Build Fails**: Check build logs for missing dependencies
2. **Environment Variables**: Ensure all Firebase variables are set
3. **Routing Issues**: Verify `netlify.toml` redirects are correct
4. **PWA Not Working**: Check manifest.json and service worker

### Next.js Plugin Error (Most Common)

**Error**: `Plugin "@netlify/plugin-nextjs" failed`

**Solution**:

1. **Use the correct build command**: `npm run netlify:build` (not `npm run build`)
2. Ensure your `netlify.toml` has the correct configuration
3. Check that you've removed all Next.js dependencies from `package.json`
4. Try redeploying after clearing Netlify cache

**If the error persists**:

1. Go to Site Settings > Build & Deploy > Build plugins
2. Manually remove the Next.js plugin if it appears there
3. Redeploy

### Build Commands

```bash
# Local build test
npm run build

# Netlify-specific build
npm run netlify:build

# Preview build
npm run preview

# Check build output
ls -la dist/
```

## Configuration Files Created

I've prepared these configuration files for you:

1. **`netlify.toml`** - Netlify build configuration (uses `npm run netlify:build`)
2. **`.nvmrc`** - Node.js version specification
3. **`.gitignore`** - Git ignore patterns
4. **`.netlifyignore`** - Netlify ignore patterns
5. **`.netlify/state.json`** - Netlify state configuration
6. **`DEPLOYMENT.md`** - This deployment guide

## Key Changes Made

- ✅ **Removed Next.js dependencies** from `package.json`
- ✅ **Added `netlify:build` script** for explicit Vite builds
- ✅ **Updated build command** in `netlify.toml`
- ✅ **Created Netlify state file** to specify framework

## Support

If you encounter issues:

1. Check Netlify build logs
2. Verify environment variables
3. Test locally with `npm run netlify:build`
4. Check browser console for errors
5. Ensure you're using `npm run netlify:build` as the build command

---

**Happy Deploying! 🎉**
