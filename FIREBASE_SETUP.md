# Firebase Authentication Setup Guide

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com/)
- Firebase project with Authentication enabled

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Firebase Console Configuration

### 1. Enable Authentication

1. Go to Firebase Console > Authentication
2. Click "Get started" if not already enabled

### 2. Enable Google Sign-in

1. In Authentication > Sign-in method
2. Click on "Google" provider
3. Enable it and configure:
   - Project support email
   - Authorized domains (add your domain)
4. Save

### 3. Enable Anonymous Authentication

1. In Authentication > Sign-in method
2. Click on "Anonymous" provider
3. Enable it
4. Save

### 4. Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click on your web app or create one
4. Copy the config object values to your `.env` file

## Features Implemented

### Authentication Methods

- **Google OAuth**: Sign in with Google account
- **Anonymous**: Sign in as guest user
- **Persistent Sessions**: Users stay logged in across browser sessions

### Security Features

- Protected routes requiring authentication
- Automatic session restoration
- Secure token storage
- User profile management

### User Experience

- Clean login interface
- Loading states and error handling
- User profile dropdown with logout
- Responsive design

## Usage

### For Users

1. Visit the app
2. Choose to sign in with Google or continue as guest
3. Access protected features
4. User profile accessible via header dropdown
5. Sign out when done

### For Developers

- Authentication state managed via Redux
- Firebase auth service handles all auth operations
- Protected routes automatically redirect to login
- User data persisted in localStorage for session restoration

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/popup-closed-by-user)"**: User closed the Google sign-in popup
2. **"Firebase: Error (auth/unauthorized-domain)"**: Domain not authorized in Firebase Console
3. **"Firebase: Error (auth/network-request-failed)"**: Network connectivity issues

### Solutions

1. Check Firebase Console configuration
2. Verify environment variables are correct
3. Ensure domain is authorized for Google sign-in
4. Check browser console for detailed error messages
