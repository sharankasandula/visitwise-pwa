import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthUser } from "./authService";

export interface UserData extends AuthUser {
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
}

export class UserService {
  // Create or update user in Firestore
  static async createOrUpdateUser(user: AuthUser): Promise<void> {
    try {
      const userRef = doc(db, "users", user.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          name: user.name,
          email: user.email,
          photoURL: user.photoURL,
          lastLoginAt: new Date(),
          isActive: true,
        });
      } else {
        // Create new user
        const userData: UserData = {
          ...user,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          isActive: true,
        };
        await setDoc(userRef, userData);
      }
    } catch (error: any) {
      console.error("Error saving user to Firestore:", error);
      throw new Error("Failed to save user data");
    }
  }

  // Get user data from Firestore
  static async getUserData(userId: string): Promise<UserData | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          lastLoginAt: data.lastLoginAt.toDate(),
        } as UserData;
      }
      return null;
    } catch (error: any) {
      console.error("Error fetching user data from Firestore:", error);
      return null;
    }
  }

  // Update user's last login time
  static async updateLastLogin(userId: string): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        lastLoginAt: new Date(),
        isActive: true,
      });
    } catch (error: any) {
      console.error("Error updating last login:", error);
    }
  }

  // Deactivate user account
  static async deactivateUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isActive: false,
      });
    } catch (error: any) {
      console.error("Error deactivating user:", error);
      throw new Error("Failed to deactivate user");
    }
  }
}
