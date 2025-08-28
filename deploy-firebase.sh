#!/bin/bash

echo "🚀 Deploying Firebase configuration..."

echo "📋 Deploying Firestore security rules..."
firebase deploy --only firestore:rules

echo "📊 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes

echo "✅ Firebase deployment complete!"
echo ""
echo "🔍 To verify the setup:"
echo "1. Go to Firebase Console > Firestore Database"
echo "2. Check if the 'users' collection is created when you sign in"
echo "3. Verify that patients can be loaded without permission errors"
echo ""
echo "⚠️  Note: Current rules are permissive for development."
echo "   Remember to tighten them for production use."
