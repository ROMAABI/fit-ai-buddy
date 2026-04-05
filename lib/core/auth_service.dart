import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart' show kIsWeb, debugPrint;
import 'dart:io' show Platform;

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  late GoogleSignIn _googleSignIn;
  GoogleSignInAccount? _currentUser;
  User? _firebaseUser;
  bool _isOnboardingComplete = false;
  bool _initialized = false;
  Map<String, dynamic>? _userProfile;

  static const String _keyOnboardingComplete = 'is_onboarding_complete';
  static const String _keyUserEmail = 'user_email';

  GoogleSignInAccount? get currentUser => _currentUser;
  User? get firebaseUser => _firebaseUser;
  bool get isOnboardingComplete => _isOnboardingComplete;
  bool get isLoggedIn => _currentUser != null || _firebaseUser != null;
  Map<String, dynamic>? get userProfile => _userProfile;

  bool get _isDesktop =>
      !kIsWeb && (Platform.isLinux || Platform.isWindows || Platform.isMacOS);

  Future<void> init() async {
    if (_initialized) return;

    try {
      _googleSignIn = GoogleSignIn(
        scopes: ['email', 'profile'],
      );

      final prefs = await SharedPreferences.getInstance();
      _isOnboardingComplete = prefs.getBool(_keyOnboardingComplete) ?? false;

      final savedEmail = prefs.getString(_keyUserEmail);
      if (savedEmail != null) {
        try {
          if (!_isDesktop) {
            _currentUser = await _googleSignIn.signInSilently();
            if (_currentUser != null) {
              await _signInToFirebase(_currentUser!);
            }
          } else {
            _firebaseUser = FirebaseAuth.instance.currentUser;
          }
        } catch (_) {
          _currentUser = null;
          _firebaseUser = null;
        }
      }
    } catch (_) {
      _googleSignIn = GoogleSignIn();
    }

    _initialized = true;
  }

  Future<void> _signInToFirebase(GoogleSignInAccount googleUser) async {
    try {
      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;
      final OAuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential =
          await FirebaseAuth.instance.signInWithCredential(credential);
      _firebaseUser = userCredential.user;
    } catch (e) {
      // Firebase sign-in failed, continue with Google Sign-In only
    }
  }

  Future<UserCredential?> signInWithEmailPassword(
      String email, String password) async {
    try {
      final UserCredential credential =
          await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      _firebaseUser = credential.user;

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyUserEmail, email);

      await checkUserProfileExists();

      return credential;
    } on FirebaseAuthException catch (e) {
      String msg;
      switch (e.code) {
        case 'user-not-found':
          msg = 'No account found with this email.';
          break;
        case 'wrong-password':
          msg = 'Incorrect password.';
          break;
        case 'invalid-email':
          msg = 'Invalid email address.';
          break;
        case 'user-disabled':
          msg = 'This account has been disabled.';
          break;
        default:
          msg = 'Sign in failed: ${e.message}';
      }
      throw Exception(msg);
    } catch (e) {
      throw Exception('Sign in failed: $e');
    }
  }

  Future<UserCredential?> signUpWithEmailPassword(
      String email, String password) async {
    try {
      final UserCredential credential =
          await FirebaseAuth.instance.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      _firebaseUser = credential.user;

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_keyUserEmail, email);

      return credential;
    } on FirebaseAuthException catch (e) {
      String msg;
      switch (e.code) {
        case 'email-already-in-use':
          msg = 'An account already exists with this email.';
          break;
        case 'invalid-email':
          msg = 'Invalid email address.';
          break;
        case 'weak-password':
          msg = 'Password should be at least 6 characters.';
          break;
        default:
          msg = 'Sign up failed: ${e.message}';
      }
      throw Exception(msg);
    } catch (e) {
      throw Exception('Sign up failed: $e');
    }
  }

  Future<bool> checkUserProfileExists() async {
    debugPrint('checkUserProfileExists called');

    if (_firebaseUser == null && _currentUser == null) {
      debugPrint('No user signed in, returning false');
      return false;
    }

    try {
      final String? uid = _firebaseUser?.uid;

      debugPrint('uid: $uid');

      if (uid == null) {
        debugPrint('No uid, returning false');
        return false;
      }

      debugPrint('Fetching user doc from Firestore');
      final doc = await FirebaseFirestore.instance
          .collection('users')
          .doc(uid)
          .get()
          .timeout(const Duration(seconds: 5));
      debugPrint('Doc exists: ${doc.exists}');

      if (doc.exists) {
        _userProfile = doc.data() as Map<String, dynamic>?;
        debugPrint('User profile: $_userProfile');

        final hasAge = _userProfile?.containsKey('age') == true &&
            _userProfile!['age'] != null;
        final hasWeight = _userProfile?.containsKey('weight') == true &&
            _userProfile!['weight'] != null;
        final hasHeight = _userProfile?.containsKey('height') == true &&
            _userProfile!['height'] != null;

        debugPrint(
            'hasAge: $hasAge, hasWeight: $hasWeight, hasHeight: $hasHeight');

        if (hasAge && hasWeight && hasHeight) {
          _isOnboardingComplete = true;
          final prefs = await SharedPreferences.getInstance();
          await prefs.setBool(_keyOnboardingComplete, true);
          debugPrint('Profile complete, returning true');
          return true;
        }
      }

      _isOnboardingComplete = false;
      debugPrint('Profile incomplete, returning false');
      return false;
    } catch (e) {
      debugPrint('Error checking profile: $e');
      _isOnboardingComplete = false;
      return false;
    }
  }

  Future<GoogleSignInAccount?> signInWithGoogle() async {
    debugPrint('signInWithGoogle called');
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();
      debugPrint('Google Sign-In account: $account');
      if (account != null) {
        _currentUser = account;
        debugPrint('Current user set: ${_currentUser?.email}');

        debugPrint('Signing in to Firebase');
        await _signInToFirebase(account);
        debugPrint('Firebase user: $_firebaseUser');

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_keyUserEmail, account.email);

        await checkUserProfileExists();

        return account;
      }
    } catch (e) {
      final errorStr = e.toString().toLowerCase();
      debugPrint('Sign-in error: $e');
      if (errorStr.contains('popup_closed') || errorStr.contains('closed')) {
        return null;
      }
      return null;
    }
    return null;
  }

  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
      await FirebaseAuth.instance.signOut();
    } catch (_) {}
    _currentUser = null;
    _firebaseUser = null;
    _isOnboardingComplete = false;
    _userProfile = null;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyUserEmail);
    await prefs.remove(_keyOnboardingComplete);
  }

  Future<void> saveUserProfileToFirebase(
      Map<String, dynamic> profileData) async {
    try {
      if (_firebaseUser != null) {
        await FirebaseFirestore.instance
            .collection('users')
            .doc(_firebaseUser!.uid)
            .set(profileData, SetOptions(merge: true));
        _userProfile = profileData;
      }

      _isOnboardingComplete = true;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_keyOnboardingComplete, true);
    } catch (e) {
      debugPrint('Error saving profile to Firebase: $e');
      _isOnboardingComplete = true;
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_keyOnboardingComplete, true);
    }
  }

  Future<void> markOnboardingComplete() async {
    _isOnboardingComplete = true;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyOnboardingComplete, true);
  }
}
