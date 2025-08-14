import {
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAnonymous: boolean;
  photoURL?: string;
}

export class AuthService {
  // Convert Firebase user to our app's user format
  private static mapFirebaseUser(firebaseUser: FirebaseUser): AuthUser {
    return {
      id: firebaseUser.uid,
      name:
        firebaseUser.displayName ||
        (firebaseUser.isAnonymous ? "Anonymous User" : "Unknown User"),
      email: firebaseUser.email || "",
      isAnonymous: firebaseUser.isAnonymous,
      photoURL: firebaseUser.photoURL || undefined,
    };
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<AuthUser> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = this.mapFirebaseUser(result.user);

      // Store user data in localStorage for persistence
      localStorage.setItem("authUser", JSON.stringify(user));

      return user;
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in was cancelled");
      }
      throw new Error(error.message || "Failed to sign in with Google");
    }
  }

  // Sign in anonymously
  static async signInAnonymously(): Promise<AuthUser> {
    try {
      const result = await signInAnonymously(auth);
      const user = this.mapFirebaseUser(result.user);

      // Store user data in localStorage for persistence
      localStorage.setItem("authUser", JSON.stringify(user));

      return user;
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in anonymously");
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
      localStorage.removeItem("authUser");
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign out");
    }
  }

  // Get current user
  static getCurrentUser(): AuthUser | null {
    const userStr = localStorage.getItem("authUser");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        localStorage.removeItem("authUser");
        return null;
      }
    }
    return null;
  }

  // Listen to auth state changes
  static onAuthStateChanged(
    callback: (user: AuthUser | null) => void
  ): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = this.mapFirebaseUser(firebaseUser);
        localStorage.setItem("authUser", JSON.stringify(user));
        callback(user);
      } else {
        localStorage.removeItem("authUser");
        callback(null);
      }
    });
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }
}
