# Firebase Setup Guide

## Important: Firestore Security Rules

For the app to work, you need to configure Firestore security rules in Firebase Console.

### Step 1: Go to Firebase Console
1. Visit https://console.firebase.google.com/
2. Select your project: `estagio-13e16`

### Step 2: Enable Firestore Database
1. Go to **Firestore Database** in the left menu
2. Click **Create database**
3. Start in **test mode** (for development) or **production mode**

### Step 3: Set Security Rules

Go to **Firestore Database** → **Rules** and use these rules:

**For Development (Test Mode):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to create their own document
      match /punches/{punchId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

**For Production (More Secure):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can create their own document
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their own document
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Users can read/write their punches
      match /punches/{punchId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Step 4: Enable Email/Password Authentication

1. Go to **Authentication** in Firebase Console
2. Click **Get started** if not already enabled
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **Save**

## Testing

After setting up:
1. Try to register a new user
2. Check the browser console (F12) for any errors
3. Check Firebase Console → Firestore Database to see if data is being saved

## Common Issues

### "Permission denied" error
- Check Firestore security rules
- Make sure rules allow authenticated users to write

### "Operation not allowed" error
- Enable Email/Password authentication in Firebase Console
- Go to Authentication → Sign-in method → Enable Email/Password

### "Network request failed"
- Check your internet connection
- Check if Firebase project is active
- Verify Firebase config credentials are correct

