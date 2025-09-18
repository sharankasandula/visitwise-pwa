import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthUser } from "./authService";
import {
  ReminderSettings,
  DEFAULT_REMINDER_SETTINGS,
} from "../types/reminders";

export interface UserData extends AuthUser {
  createdAt: string; // ISO string for Redux compatibility
  lastLoginAt: string; // ISO string for Redux compatibility
  isActive: boolean;
  reminderSettings?: ReminderSettings;
}

export class UserService {
  // Create or update user in Firestore
  static async createOrUpdateUser(user: AuthUser): Promise<void> {
    try {
      const userRef = doc(db, "users", user.id);
      const userDoc = await getDoc(userRef);

      // Filter out undefined and empty values for Firestore
      const userDataForFirestore = {
        name: user.name,
        isActive: true,
        lastLoginAt: new Date(),
        ...(user.email && { email: user.email }),
        ...(user.photoURL && { photoURL: user.photoURL }),
      };

      if (userDoc.exists()) {
        // Update existing user
        await updateDoc(userRef, userDataForFirestore);
      } else {
        // Create new user
        const now = new Date();
        await setDoc(userRef, {
          ...userDataForFirestore,
          createdAt: now,
          reminderSettings: DEFAULT_REMINDER_SETTINGS,
        });
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
          createdAt:
            data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
          lastLoginAt:
            data.lastLoginAt?.toDate()?.toISOString() ||
            new Date().toISOString(),
          reminderSettings: data.reminderSettings || DEFAULT_REMINDER_SETTINGS,
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

  // Update user reminder settings
  static async updateReminderSettings(
    userId: string,
    reminderSettings: ReminderSettings
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        reminderSettings,
      });
    } catch (error: any) {
      console.error("Error updating reminder settings:", error);
      throw new Error("Failed to update reminder settings");
    }
  }

  // Get user reminder settings
  static async getReminderSettings(userId: string): Promise<ReminderSettings> {
    try {
      const userData = await this.getUserData(userId);
      return userData?.reminderSettings || DEFAULT_REMINDER_SETTINGS;
    } catch (error: any) {
      console.error("Error fetching reminder settings:", error);
      return DEFAULT_REMINDER_SETTINGS;
    }
  }
}
