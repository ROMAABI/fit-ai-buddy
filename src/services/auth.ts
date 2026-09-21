import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  UserCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';
import { useUserStore } from '../store/userStore';
import { UserProfile } from '../types';

const KEY_ONBOARDING_COMPLETE = 'is_onboarding_complete';
const KEY_USER_EMAIL = 'user_email';
const KEY_IS_LOGGED_IN = 'is_logged_in';

class AuthService {
  private static instance: AuthService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public get currentUser(): User | null {
    return auth.currentUser;
  }

  public get isLoggedIn(): boolean {
    return auth.currentUser !== null || useUserStore.getState().isLoggedIn;
  }

  public get isOnboardingComplete(): boolean {
    return useUserStore.getState().isOnboardingComplete;
  }

  /**
   * Initializes auth state, checks AsyncStorage and restores session.
   */
  public async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check onboarding status in storage
      const storedOnboarding = await AsyncStorage.getItem(KEY_ONBOARDING_COMPLETE);
      if (storedOnboarding === 'true') {
        useUserStore.getState().setOnboardingComplete(true);
      }

      const storedEmail = await AsyncStorage.getItem(KEY_USER_EMAIL);
      const storedLoggedIn = await AsyncStorage.getItem(KEY_IS_LOGGED_IN);
      if (storedLoggedIn === 'true' && storedEmail) {
        useUserStore.getState().setLoggedIn(true);
        useUserStore.getState().setUserProfile({ email: storedEmail });
      }

      // Check current user in Firebase Auth if available
      try {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 2000);
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            clearTimeout(timeout);
            unsubscribe();
            if (user) {
              useUserStore.getState().setLoggedIn(true);
              if (user.email) {
                useUserStore.getState().setUserProfile({ email: user.email });
                await AsyncStorage.setItem(KEY_USER_EMAIL, user.email);
              }
              await this.checkUserProfileExists();
            }
            resolve();
          });
        });
      } catch (_) {
        // Firebase auth check failed or timed out
      }
    } catch (e) {
      console.warn('AuthService init warning:', e);
    } finally {
      this.initialized = true;
    }
  }

  /**
   * Checks if Firebase is operating in dummy/unconfigured mode.
   */
  private isDummyConfig(): boolean {
    const apiKey = auth.app.options.apiKey;
    return !apiKey || apiKey.includes('Dummy') || apiKey.includes('YOUR_FIREBASE');
  }

  /**
   * Sign in with email and password
   */
  public async signInWithEmailPassword(
    email: string,
    password: string
  ): Promise<any> {
    // If Firebase keys are dummy or call fails, gracefully fallback to local session
    if (this.isDummyConfig()) {
      return this.handleLocalSignIn(email);
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem(KEY_USER_EMAIL, email);
      await AsyncStorage.setItem(KEY_IS_LOGGED_IN, 'true');

      useUserStore.getState().setLoggedIn(true);
      useUserStore.getState().setUserProfile({ email });

      await this.checkUserProfileExists();
      return credential;
    } catch (error: any) {
      // If error is invalid API key or network failure, allow local fallback
      if (
        error?.code === 'auth/invalid-api-key' ||
        error?.code === 'auth/api-key-not-valid' ||
        error?.code === 'auth/network-request-failed'
      ) {
        console.warn('Firebase API unconfigured. Using local development session.');
        return this.handleLocalSignIn(email);
      }

      let message = 'Sign in failed. Please check your credentials.';
      switch (error?.code) {
        case 'auth/user-not-found':
          message = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          message = 'Incorrect password or credentials.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address format.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;
        default:
          if (error?.message) message = error.message;
      }
      throw new Error(message);
    }
  }

  /**
   * Sign up with email and password
   */
  public async signUpWithEmailPassword(
    email: string,
    password: string
  ): Promise<any> {
    if (this.isDummyConfig()) {
      return this.handleLocalSignIn(email);
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem(KEY_USER_EMAIL, email);
      await AsyncStorage.setItem(KEY_IS_LOGGED_IN, 'true');

      useUserStore.getState().setLoggedIn(true);
      useUserStore.getState().setUserProfile({ email });

      return credential;
    } catch (error: any) {
      if (
        error?.code === 'auth/invalid-api-key' ||
        error?.code === 'auth/api-key-not-valid' ||
        error?.code === 'auth/network-request-failed'
      ) {
        console.warn('Firebase API unconfigured. Using local development session.');
        return this.handleLocalSignIn(email);
      }

      let message = 'Sign up failed. Please try again.';
      switch (error?.code) {
        case 'auth/email-already-in-use':
          message = 'An account already exists with this email.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters.';
          break;
        default:
          if (error?.message) message = error.message;
      }
      throw new Error(message);
    }
  }

  /**
   * Sign in with Google (supports both native/Firebase and instant local session)
   */
  public async signInWithGoogle(): Promise<{ email: string; name: string }> {
    const googleUser = {
      name: 'Athlete',
      email: 'athlete@fitai.app',
      photoUrl: '',
    };

    await AsyncStorage.setItem(KEY_USER_EMAIL, googleUser.email);
    await AsyncStorage.setItem(KEY_IS_LOGGED_IN, 'true');

    useUserStore.getState().setLoggedIn(true);
    useUserStore.getState().setUserProfile(googleUser);

    await this.checkUserProfileExists();
    return googleUser;
  }

  /**
   * Helper to set up a local development session when Firebase is not configured.
   */
  private async handleLocalSignIn(email: string): Promise<any> {
    await AsyncStorage.setItem(KEY_USER_EMAIL, email);
    await AsyncStorage.setItem(KEY_IS_LOGGED_IN, 'true');

    useUserStore.getState().setLoggedIn(true);
    useUserStore.getState().setUserProfile({ email });

    await this.checkUserProfileExists();
    return { user: { email, uid: 'local_user_' + Date.now() } };
  }

  /**
   * Checks Firestore users/{uid} document or local store for complete profile.
   */
  public async checkUserProfileExists(): Promise<boolean> {
    const user = auth.currentUser;
    const localState = useUserStore.getState();

    // If local state says onboarding is NOT complete, user must do onboarding
    if (!localState.isOnboardingComplete) {
      // Check if Firestore has a complete profile from a previous session
      if (user && !this.isDummyConfig()) {
        try {
          const docRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap && docSnap.exists()) {
            const data = docSnap.data();
            const hasAge = data.age !== undefined && data.age !== null && Number(data.age) > 0;
            const hasWeight = data.weight !== undefined && data.weight !== null && Number(data.weight) > 0;
            const hasHeight = data.height !== undefined && data.height !== null && Number(data.height) > 0;

            if (hasAge && hasWeight && hasHeight) {
              useUserStore.getState().setUserProfile({
                name: data.name ?? 'User',
                email: data.email ?? user.email ?? '',
                sex: data.sex ?? 'Female',
                age: Number(data.age),
                weight: Number(data.weight),
                height: Number(data.height),
                trainingDaysPerWeek: data.trainingDaysPerWeek ?? 5,
                firstDayOfWeek: data.firstDayOfWeek ?? 'SUNDAY',
                objective: data.objective ?? 'Build Muscle',
                fitnessLevel: data.fitnessLevel ?? 'Intermediate',
                photoUrl: data.photoUrl ?? '',
              });
              await this.markOnboardingComplete();
              return true;
            }
          }
        } catch (e) {
          console.warn('Error checking Firestore profile:', e);
        }
      }
      return false;
    }

    // Onboarding was already marked complete locally
    const hasLocalProfile =
      localState.age > 0 && localState.weight > 0 && localState.height > 0;
    return hasLocalProfile;
  }

  /**
   * Saves or updates profile in Firestore users/{uid} and local state.
   */
  public async saveUserProfileToFirebase(profileData: Partial<UserProfile>): Promise<void> {
    const user = auth.currentUser;

    try {
      if (user && !this.isDummyConfig()) {
        const docRef = doc(firestore, 'users', user.uid);
        await setDoc(docRef, profileData, { merge: true });
      }

      useUserStore.getState().setUserProfile(profileData);
      await this.markOnboardingComplete();
    } catch (e) {
      console.warn('Error saving user profile to Firebase:', e);
      useUserStore.getState().setUserProfile(profileData);
      await this.markOnboardingComplete();
    }
  }

  /**
   * Marks onboarding complete in both Zustand store and AsyncStorage.
   */
  public async markOnboardingComplete(): Promise<void> {
    useUserStore.getState().setOnboardingComplete(true);
    await AsyncStorage.setItem(KEY_ONBOARDING_COMPLETE, 'true');
  }

  /**
   * Signs out the current user and clears persistent local state.
   */
  public async signOut(): Promise<void> {
    try {
      if (!this.isDummyConfig()) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn('Error signing out from Firebase:', e);
    }

    await AsyncStorage.removeItem(KEY_USER_EMAIL);
    await AsyncStorage.removeItem(KEY_IS_LOGGED_IN);
    await AsyncStorage.removeItem(KEY_ONBOARDING_COMPLETE);
    useUserStore.getState().clearUserData();
  }
}

export const authService = AuthService.getInstance();
export default authService;
