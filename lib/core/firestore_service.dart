import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class FirestoreService {
  static final FirestoreService _instance = FirestoreService._internal();
  factory FirestoreService() => _instance;
  FirestoreService._internal();

  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  String? get _userId => _auth.currentUser?.uid;

  // ==================== WORKOUTS ====================

  Future<void> addWorkout({
    required String name,
    required String category,
    required String date,
    String? notes,
    int? duration,
    double? priority,
  }) async {
    if (_userId == null) return;

    await _firestore
        .collection('users')
        .doc(_userId)
        .collection('workouts')
        .add({
      'name': name,
      'category': category,
      'date': date,
      'notes': notes ?? '',
      'duration': duration ?? 0,
      'priority': priority ?? 0.5,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  Stream<QuerySnapshot> getWorkouts() {
    if (_userId == null) {
      return const Stream.empty();
    }

    return _firestore
        .collection('users')
        .doc(_userId)
        .collection('workouts')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  Future<void> deleteWorkout(String workoutId) async {
    if (_userId == null) return;

    await _firestore
        .collection('users')
        .doc(_userId)
        .collection('workouts')
        .doc(workoutId)
        .delete();
  }

  // ==================== NUTRITION ====================

  Future<void> addNutrition({
    required String name,
    required int calories,
    required double protein,
    required double carbs,
    required double fats,
    String? notes,
  }) async {
    if (_userId == null) return;

    await _firestore
        .collection('users')
        .doc(_userId)
        .collection('nutrition')
        .add({
      'name': name,
      'calories': calories,
      'protein': protein,
      'carbs': carbs,
      'fats': fats,
      'notes': notes ?? '',
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  Stream<QuerySnapshot> getNutrition() {
    if (_userId == null) {
      return const Stream.empty();
    }

    return _firestore
        .collection('users')
        .doc(_userId)
        .collection('nutrition')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  Future<void> deleteNutrition(String nutritionId) async {
    if (_userId == null) return;

    await _firestore
        .collection('users')
        .doc(_userId)
        .collection('nutrition')
        .doc(nutritionId)
        .delete();
  }

  // ==================== EXPENSES ====================

  Future<void> addExpense({
    required double amount,
    required String vendor,
    required String category,
    required String date,
    String? notes,
  }) async {
    if (_userId == null) return;

    await _firestore
        .collection('users')
        .doc(_userId)
        .collection('expenses')
        .add({
      'amount': amount,
      'vendor': vendor,
      'category': category,
      'date': date,
      'notes': notes ?? '',
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  Stream<QuerySnapshot> getExpenses() {
    if (_userId == null) {
      return const Stream.empty();
    }

    return _firestore
        .collection('users')
        .doc(_userId)
        .collection('expenses')
        .orderBy('createdAt', descending: true)
        .snapshots();
  }

  Future<void> deleteExpense(String expenseId) async {
    if (_userId == null) return;

    await _firestore
        .collection('users')
        .doc(_userId)
        .collection('expenses')
        .doc(expenseId)
        .delete();
  }

  // ==================== USER PROFILE ====================

  Future<void> saveUserProfile({
    required String name,
    required String email,
    String? sex,
    int? trainingDaysPerWeek,
    String? firstDayOfWeek,
    String? objective,
    String? fitnessLevel,
  }) async {
    if (_userId == null) return;

    await _firestore.collection('users').doc(_userId).set({
      'name': name,
      'email': email,
      'sex': sex ?? 'Male',
      'trainingDaysPerWeek': trainingDaysPerWeek ?? 5,
      'firstDayOfWeek': firstDayOfWeek ?? 'SUNDAY',
      'objective': objective ?? 'Build Muscle',
      'fitnessLevel': fitnessLevel ?? 'Intermediate',
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  Future<Map<String, dynamic>?> getUserProfile() async {
    if (_userId == null) return null;

    final doc = await _firestore.collection('users').doc(_userId).get();
    return doc.data();
  }
}
