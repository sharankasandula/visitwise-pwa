# Firebase Setup for User Data Persistence

This document explains how to set up Firebase to persist user data when users sign in with Google OAuth.

## What's Been Implemented

1. **User Service** (`src/services/userService.ts`): Handles creating, updating, and retrieving user data from Firestore
2. **Updated Auth Service**: Now automatically saves user data to Firebase when users sign in
3. **Firestore Security Rules**: Secure access to user data
4. **Firestore Indexes**: Optimize queries on the users collection

## User Data Structure

When a user signs in, the following data is stored in the `users` collection:

```typescript
interface UserData {
  id: string; // Firebase Auth UID
  name: string; // User's display name
  email: string; // User's email address
  photoURL?: string; // User's profile picture URL
  createdAt: Date; // When the user account was created
  lastLoginAt: Date; // When the user last signed in
  isActive: boolean; // Whether the account is active
}
```

## Firebase Configuration Files

### 1. Firestore Security Rules (`firestore.rules`)

These rules ensure:

- Users can only read/write their own data
- Authenticated users can read basic info of other users
- All other access is denied by default

### 2. Firestore Indexes (`firestore.indexes.json`)

Optimizes queries for:

- Active users sorted by creation date
- Email-based lookups

## Deployment Steps

### 1. Deploy Firestore Security Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

### 2. Deploy Firestore Indexes

```bash
# Deploy indexes
firebase deploy --only firestore:indexes
```

### 3. Verify Collection Creation

The `users` collection will be automatically created when the first user signs in. You can verify this in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Look for the `users` collection

## How It Works

1. **User Signs In**: When a user signs in with Google OAuth, the `AuthService.signInWithGoogle()` method is called
2. **Data Mapping**: User data from Google is mapped to our `AuthUser` interface
3. **Firebase Persistence**: The `UserService.createOrUpdateUser()` method saves/updates the user data in Firestore
4. **Local Storage**: User data is also stored in localStorage for offline access
5. **Auth State Changes**: When auth state changes, user data is automatically persisted to Firebase

## Error Handling

- If Firebase operations fail, errors are logged to the console
- Authentication continues to work even if Firebase persistence fails
- Users can still access the app with localStorage data

## Testing

To test the implementation:

1. Sign in with a Google account
2. Check the Firebase Console to see if a user document was created
3. Sign out and sign back in to verify the `lastLoginAt` field is updated
4. Check that user data persists across browser sessions

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure Firestore security rules are deployed
2. **Collection Not Created**: Check if the user actually signed in successfully
3. **Index Errors**: Deploy the Firestore indexes configuration

### Debug Mode

Enable debug logging by checking the browser console for:

- "Error saving user to Firestore" messages
- "Error persisting user data" messages

## Security Considerations

- Users can only access their own data
- Email addresses are stored but can be used for user lookup
- Profile pictures are stored as URLs (not actual image files)

## Localhost Development

For localhost development, the current rules are intentionally permissive to avoid CORS and permission issues:

- All authenticated users can read/write to any collection
- This allows your app to work seamlessly in development
- **Important**: These rules should be tightened for production use

### Production Security Rules

When deploying to production, consider implementing these stricter rules:

```javascript
// Users can only access their own data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Patients belong to specific users
match /patients/{patientId} {
  allow read, write: if request.auth != null &&
    resource.data.userId == request.auth.uid;
}

// Subcollections inherit parent permissions
match /patients/{patientId}/{subcollection}/{documentId} {
  allow read, write: if request.auth != null &&
    get(/databases/$(database)/documents/patients/$(patientId)).data.userId == request.auth.uid;
}
```

### CORS Issues in Development

If you encounter CORS errors during development:

1. Ensure you're using `localhost` or `127.0.0.1` (not `0.0.0.0`)
2. Check that your Firebase project's authorized domains include `localhost`
3. Consider using redirect-based authentication instead of popup for development
