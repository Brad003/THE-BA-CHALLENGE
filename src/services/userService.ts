import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { PANTHER_LEVELS } from '../data/initialData';

/**
 * Service to handle saving and retrieving user profile data to Firestore
 * after successful authentication. This explicitly handles fields like name,
 * age bracket, fitness level, primary goals, etc.
 */
export const UserService = {
  /**
   * Calculates and updates a user's 'Panther Level' and 'XP' based on their
   * total workout completions stored in the Firestore 'activities' subcollection.
   */
  async recalculateProgression(userId: string): Promise<{ xp: number, level: number }> {
    try {
      const activitiesRef = collection(db, 'users', userId, 'activities');
      const activitiesSnap = await getDocs(activitiesRef);
      
      let totalXP = 0;
      activitiesSnap.forEach(docSnap => {
        const data = docSnap.data();
        if (typeof data.xpEarned === 'number') {
          totalXP += data.xpEarned;
        }
      });
      
      let newLevel = 1;
      for (let i = PANTHER_LEVELS.length - 1; i >= 0; i--) {
        if (totalXP >= PANTHER_LEVELS[i].minXp) {
          newLevel = PANTHER_LEVELS[i].id;
          break;
        }
      }

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        xp: totalXP,
        pantherLevel: newLevel
      });
      
      return { xp: totalXP, level: newLevel };
    } catch (error: any) {
      console.warn("Could not recalculate progression from Firestore (offline or local fallback):", error?.message || error);
      return { xp: 0, level: 1 };
    }
  },

  /**
   * Retrieves the user profile from Firestore.
   * Handles offline scenarios gracefully.
   */
  async getUserProfile(userId: string): Promise<Partial<UserProfile> | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        return userDocSnap.data() as Partial<UserProfile>;
      }
      return null;
    } catch (error: any) {
      const msg = error?.message || String(error);
      if (msg.includes('offline') || msg.includes('unavailable') || error?.code === 'unavailable') {
        console.warn("[UserService] Client is offline or Firestore temporarily unavailable. Preserving local profile state.");
        return null;
      }
      console.warn("[UserService] Notice fetching user profile from Firestore:", msg);
      return null;
    }
  },

  /**
   * Saves or merges user profile data to Firestore.
   * Useful for initial onboarding to save name, age, fitness level, and goals.
   */
  async saveUserProfile(userId: string, data: Partial<UserProfile>, merge: boolean = true): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, data, { merge });
    } catch (error: any) {
      console.warn("Notice saving user profile to Firestore (queued/offline):", error?.message || error);
    }
  },

  /**
   * Updates specific fields of an existing user profile in Firestore.
   */
  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, data);
    } catch (error: any) {
      console.warn("Notice updating user profile in Firestore (queued/offline):", error?.message || error);
    }
  }
};
