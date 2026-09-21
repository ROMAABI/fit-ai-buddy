import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Sex, Objective, FitnessLevel, DayOfWeek } from '../types';

interface UserState extends UserProfile {
  isOnboardingComplete: boolean;
  isLoggedIn: boolean;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  clearUserData: () => void;
}

const initialProfile: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@athlete.io',
  sex: 'Male',
  age: 26,
  weight: 78,
  height: 182,
  trainingDaysPerWeek: 5,
  firstDayOfWeek: 'MONDAY',
  objective: 'Build Muscle',
  fitnessLevel: 'Advanced',
  photoUrl: '',
  initials: 'AR',
  calorieGoal: 2400,
  caloriesBurned: 620,
  activeMinutes: 45,
  streakDays: 7,
  monthlyExpense: 340,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialProfile,
      isOnboardingComplete: true,
      isLoggedIn: true,

      setUserProfile: (profile) => {
        const current = get();
        const updatedName = profile.name !== undefined ? profile.name : current.name;
        let initials = current.initials;
        if (profile.initials !== undefined) {
          initials = profile.initials;
        } else if (updatedName) {
          initials =
            updatedName.length >= 2
              ? updatedName.substring(0, 2).toUpperCase()
              : updatedName.toUpperCase();
        }

        set({
          ...profile,
          initials,
        });
      },

      setOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
      setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),

      clearUserData: () =>
        set({
          ...initialProfile,
          isOnboardingComplete: false,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'fit-ai-buddy-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
