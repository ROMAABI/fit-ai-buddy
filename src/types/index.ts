export type Sex = 'Male' | 'Female';
export type Objective = 'Build Muscle' | 'Lose Weight' | 'Keep Fit';
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type DayOfWeek =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

export interface UserProfile {
  name: string;
  email: string;
  sex: Sex;
  age: number;
  weight: number; // in kg
  height: number; // in cm
  trainingDaysPerWeek: number; // 1-7
  firstDayOfWeek: DayOfWeek;
  objective: Objective;
  fitnessLevel: FitnessLevel;
  photoUrl?: string;
  initials?: string;
  calorieGoal?: number;
  caloriesBurned?: number;
  activeMinutes?: number;
  streakDays?: number;
  monthlyExpense?: number;
}

export type WorkoutMode = 'home' | 'gym';
export type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

export interface WorkoutExercise {
  name: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sets: number;
  reps: string;
  weight: string;
  restSeconds: number;
  formTip: string;
  isHomeWorkout: boolean;
}

export interface LoggedWorkout {
  id?: string;
  activity: string;
  duration_min?: number;
  intensity?: string; // 'Low' | 'Medium' | 'High'
  sets?: number;
  reps?: string | number;
  weight_kg?: number;
  notes?: string;
  source?: string;
  timestamp?: any; // Firestore Timestamp
  name?: string; // from manual session
  category?: string;
  date?: string;
  duration?: number;
  priority?: number;
  createdAt?: any;
}

export interface LoggedNutrition {
  id?: string;
  meal: string;
  calories: number;
  protein_g?: number;
  carbs_g?: number;
  fats_g?: number;
  notes?: string;
  timestamp?: any;
  name?: string;
  protein?: number;
  carbs?: number;
  fats?: number;
  createdAt?: any;
}

export interface LoggedExpense {
  id?: string;
  item: string;
  amount: number;
  currency?: string;
  category: string; // 'Supplements' | 'Gym Access' | 'Coaching' | 'Gear' | 'Other'
  notes?: string;
  timestamp?: any;
  vendor?: string;
  date?: string;
  createdAt?: any;
}

export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'system_init';
  sender: string;
  content: string;
  isUser: boolean;
  meta?: Record<string, string>;
  isPartial?: boolean;
  actionType?: 'workout' | 'nutrition' | 'expense' | null;
  actionData?: Record<string, string> | null;
  attachedImages?: string[];
  attachedFileNames?: string[];
  timestamp?: number;
}

export interface AttachedFile {
  path: string;
  name: string;
  type: 'image' | 'file';
}
